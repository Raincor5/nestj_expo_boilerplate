import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        const isProd = nodeEnv === 'production';
        const isDev = nodeEnv === 'development';
        const databaseUrl = configService.get<string>('DATABASE_URL');
        const shouldUseSsl = (
          configService.get<string>('DB_SSL', 'true') || 'true'
        )
          .toLowerCase()
          .trim() === 'true';

        const connectionConfig = databaseUrl
          ? { url: databaseUrl }
          : {
              host: configService.get<string>('DB_HOST') || 'localhost',
              port:
                parseInt(configService.get<string>('DB_PORT') || '', 10) || 5432,
              username: configService.get<string>('DB_USERNAME') || 'postgres',
              password: configService.get<string>('DB_PASSWORD') || 'postgres',
              database: configService.get<string>('DB_NAME') || 'auth_db',
            };

        return {
          type: 'postgres',
          ...connectionConfig,
          ssl: shouldUseSsl ? { rejectUnauthorized: false } : undefined,
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: !isProd,
          logging: isDev,
        };
      },
    }),
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
