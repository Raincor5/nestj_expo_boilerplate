import {
  Injectable,
  NotFoundException,
  BadRequestException,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ABTest } from './entities/ab-test.entity';
import { ABTestGroup } from './entities/ab-test-group.entity';
import { ABTestAssignment } from './entities/ab-test-assignment.entity';
import { ABTestMetric } from './entities/ab-test-metric.entity';
import { CreateMetricDto } from './dto/create-metric.dto';

@Injectable()
export class ABTestService implements OnModuleInit {
  private readonly DEFAULT_TEST_NAME = 'home_ui_test';

  constructor(
    @InjectRepository(ABTest)
    private testRepository: Repository<ABTest>,
    @InjectRepository(ABTestGroup)
    private groupRepository: Repository<ABTestGroup>,
    @InjectRepository(ABTestAssignment)
    private assignmentRepository: Repository<ABTestAssignment>,
    @InjectRepository(ABTestMetric)
    private metricRepository: Repository<ABTestMetric>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.ensureDefaultTest();
  }

  private async ensureDefaultTest(): Promise<void> {
    // Ensure the default test exists and is active
    let test = await this.testRepository.findOne({
      where: { name: this.DEFAULT_TEST_NAME },
    });

    if (!test) {
      test = this.testRepository.create({
        name: this.DEFAULT_TEST_NAME,
        description: 'Testing home screen UI variants',
        active: true,
      });
      test = await this.testRepository.save(test);
    }

    if (!test.active) {
      test.active = true;
      await this.testRepository.save(test);
    }

    // Ensure default groups exist
    const groups = await this.groupRepository.find({ where: { testId: test.id } });
    const hasVariantA = groups.some((g) => g.groupName === 'variant_a');
    const hasVariantB = groups.some((g) => g.groupName === 'variant_b');

    if (!hasVariantA) {
      await this.groupRepository.save(
        this.groupRepository.create({
          testId: test.id,
          groupName: 'variant_a',
          description: 'Control variant - original UI',
        }),
      );
    }

    if (!hasVariantB) {
      await this.groupRepository.save(
        this.groupRepository.create({
          testId: test.id,
          groupName: 'variant_b',
          description: 'Treatment variant - new UI',
        }),
      );
    }
  }

  /**
   * Assign a user to a test group
   * If already assigned, return existing assignment
   */
  async assignUserToTest(
    userId: string,
    testName: string,
  ): Promise<ABTestAssignment> {
    // Make sure default test/groups exist when using the default test name
    if (testName === this.DEFAULT_TEST_NAME) {
      await this.ensureDefaultTest();
    }

    const test = await this.testRepository.findOne({
      where: { name: testName, active: true },
      relations: ['groups'],
    });

    if (!test) {
      throw new NotFoundException(`Test "${testName}" not found or inactive`);
    }

    if (!test.groups || test.groups.length === 0) {
      throw new BadRequestException(`Test "${testName}" has no groups`);
    }

    // Check if user already assigned
    let assignment = await this.assignmentRepository.findOne({
      where: {
        userId,
        testId: test.id,
      },
      relations: ['group', 'test'],
    });

    if (assignment) {
      return assignment;
    }

    // Randomly assign to a group (50/50 distribution for 2 groups)
    const randomGroupIndex = Math.floor(Math.random() * test.groups.length);
    const assignedGroup = test.groups[randomGroupIndex];

    assignment = this.assignmentRepository.create({
      userId,
      testId: test.id,
      groupId: assignedGroup.id,
    });

    await this.assignmentRepository.save(assignment);
    assignment.group = assignedGroup;
    assignment.test = test;
    return assignment;
  }

  /**
   * Get user's assignment for a specific test
   */
  async getUserTestAssignment(
    userId: string,
    testName: string,
  ): Promise<ABTestAssignment> {
    const test = await this.testRepository.findOne({
      where: { name: testName },
    });

    if (!test) {
      throw new NotFoundException(`Test "${testName}" not found`);
    }

    const assignment = await this.assignmentRepository.findOne({
      where: {
        userId,
        testId: test.id,
      },
      relations: ['group', 'test'],
    });

    if (!assignment) {
      throw new NotFoundException(
        `User not assigned to test "${testName}"`,
      );
    }

    return assignment;
  }

  /**
   * Record a metric for a user's test participation
   */
  async recordMetric(
    userId: string,
    testName: string,
    createMetricDto: CreateMetricDto,
  ): Promise<ABTestMetric> {
    // Ensure default test exists if using the default name
    if (testName === this.DEFAULT_TEST_NAME) {
      await this.ensureDefaultTest();
    }

    // Make sure the user has an assignment; if not, assign them now
    let assignment: ABTestAssignment;
    try {
      assignment = await this.getUserTestAssignment(userId, testName);
    } catch (error) {
      assignment = await this.assignUserToTest(userId, testName);
    }

    const metric = this.metricRepository.create({
      userId,
      testId: assignment.testId,
      groupId: assignment.groupId,
      metricName: createMetricDto.metricName,
      metricValue: createMetricDto.metricValue,
    });

    return this.metricRepository.save(metric);
  }

  /**
   * Get all metrics for a user in a test
   */
  async getUserMetrics(userId: string, testName: string): Promise<ABTestMetric[]> {
    const test = await this.testRepository.findOne({
      where: { name: testName },
    });

    if (!test) {
      throw new NotFoundException(`Test "${testName}" not found`);
    }

    return this.metricRepository.find({
      where: {
        userId,
        testId: test.id,
      },
      order: {
        recordedAt: 'DESC',
      },
    });
  }

  /**
   * Get aggregated metrics for a test
   */
  async getTestMetrics(testName: string): Promise<any> {
    const test = await this.testRepository.findOne({
      where: { name: testName },
      relations: ['groups'],
    });

    if (!test) {
      throw new NotFoundException(`Test "${testName}" not found`);
    }

    const metrics = await this.metricRepository.find({
      where: { testId: test.id },
      relations: ['group'],
    });

    // Group metrics by variant and metric name
    const aggregated = {};

    for (const group of test.groups) {
      aggregated[group.groupName] = {};
    }

    for (const metric of metrics) {
      const groupName = metric.group.groupName;
      if (!aggregated[groupName][metric.metricName]) {
        aggregated[groupName][metric.metricName] = [];
      }
      aggregated[groupName][metric.metricName].push({
        value: metric.metricValue,
        recordedAt: metric.recordedAt,
      });
    }

    return {
      testName: test.name,
      testId: test.id,
      aggregated,
    };
  }
}
