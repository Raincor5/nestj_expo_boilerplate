import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateMetricDto {
  @IsString()
  @IsNotEmpty()
  metricName: string;

  @IsString()
  @IsOptional()
  metricValue?: string;
}
