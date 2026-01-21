import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ABTest } from './entities/ab-test.entity';
import { ABTestGroup } from './entities/ab-test-group.entity';
import { ABTestAssignment } from './entities/ab-test-assignment.entity';
import { ABTestMetric } from './entities/ab-test-metric.entity';
import { ABTestService } from './abtest.service';
import { ABTestController } from './abtest.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ABTest,
      ABTestGroup,
      ABTestAssignment,
      ABTestMetric,
    ]),
  ],
  providers: [ABTestService],
  controllers: [ABTestController],
  exports: [ABTestService],
})
export class ABTestModule {}
