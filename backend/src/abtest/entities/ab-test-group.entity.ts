import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ABTest } from './ab-test.entity';
import { ABTestAssignment } from './ab-test-assignment.entity';

@Entity('ab_test_groups')
export class ABTestGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'test_id' })
  testId: string;

  @Column({ name: 'group_name' })
  groupName: string;

  @Column({ nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => ABTest, (test) => test.groups, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'test_id' })
  test: ABTest;

  @OneToMany(() => ABTestAssignment, (assignment) => assignment.group)
  assignments: ABTestAssignment[];
}
