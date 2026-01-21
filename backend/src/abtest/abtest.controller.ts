import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ABTestService } from './abtest.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

interface RequestWithUser extends Request {
  user: {
    sub: string;
    email: string;
  };
}

@Controller('abtest')
@UseGuards(JwtAuthGuard)
export class ABTestController {
  constructor(private abtestService: ABTestService) {}

  /**
   * Assign user to a test variant
   * If already assigned, returns existing assignment
   */
  @Post('assign/:testName')
  async assignTest(
    @Param('testName') testName: string,
    @Request() req: RequestWithUser,
  ) {
    const assignment = await this.abtestService.assignUserToTest(
      req.user.sub,
      testName,
    );

    return {
      testId: assignment.testId,
      testName: testName,
      groupId: assignment.groupId,
      groupName: assignment.group.groupName,
      assignedAt: assignment.assignedAt,
    };
  }

  /**
   * Get user's group assignment for a test
   */
  @Get('group/:testName')
  async getTestGroup(
    @Param('testName') testName: string,
    @Request() req: RequestWithUser,
  ) {
    const assignment = await this.abtestService.getUserTestAssignment(
      req.user.sub,
      testName,
    );

    return {
      testId: assignment.testId,
      testName: testName,
      groupId: assignment.groupId,
      groupName: assignment.group.groupName,
      assignedAt: assignment.assignedAt,
    };
  }

  /**
   * Record a metric for the user
   */
  @Post('metrics/:testName')
  async recordMetric(
    @Param('testName') testName: string,
    @Body() createMetricDto: CreateMetricDto,
    @Request() req: RequestWithUser,
  ) {
    const metric = await this.abtestService.recordMetric(
      req.user.sub,
      testName,
      createMetricDto,
    );

    return {
      metricId: metric.id,
      metricName: metric.metricName,
      metricValue: metric.metricValue,
      recordedAt: metric.recordedAt,
    };
  }

  /**
   * Get user's metrics for a test
   */
  @Get('metrics/:testName')
  async getUserMetrics(
    @Param('testName') testName: string,
    @Request() req: RequestWithUser,
  ) {
    const metrics = await this.abtestService.getUserMetrics(
      req.user.sub,
      testName,
    );

    return metrics.map((metric) => ({
      metricId: metric.id,
      metricName: metric.metricName,
      metricValue: metric.metricValue,
      recordedAt: metric.recordedAt,
    }));
  }

  /**
   * Get aggregated metrics for a test (admin)
   */
  @Get('results/:testName')
  async getTestResults(@Param('testName') testName: string) {
    return this.abtestService.getTestMetrics(testName);
  }
}
