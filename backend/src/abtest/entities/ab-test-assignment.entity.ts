import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ABTest } from './ab-test.entity';
import { ABTestGroup } from './ab-test-group.entity';
import { User } from '../../user/entities/user.entity';

@Entity('ab_test_assignments')
@Index(['userId', 'testId'], { unique: true })
export class ABTestAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @Column({ name: 'test_id' })
  testId: string;

  @Column({ name: 'group_id' })
  groupId: string;

  @CreateDateColumn({ name: 'assigned_at' })
  assignedAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => ABTest, (test) => test.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: ABTest;

  @ManyToOne(() => ABTestGroup, (group) => group.assignments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id' })
  group: ABTestGroup;
}
