import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ABTest } from './ab-test.entity';
import { ABTestGroup } from './ab-test-group.entity';
import { User } from '../../user/entities/user.entity';

@Entity('ab_test_metrics')
@Index(['userId', 'testId', 'recordedAt'])
export class ABTestMetric {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'test_id' })
  testId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @Column({ name: 'metric_name' })
  metricName: string;

  @Column({ name: 'metric_value', nullable: true })
  metricValue: string;

  @CreateDateColumn({ name: 'recorded_at' })
  recordedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ABTest, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: ABTest;

  @ManyToOne(() => ABTestGroup, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: ABTestGroup;
}
