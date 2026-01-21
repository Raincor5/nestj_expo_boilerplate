import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ABTestGroup } from './ab-test-group.entity';
import { ABTestAssignment } from './ab-test-assignment.entity';

@Entity('ab_tests')
export class ABTest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ default: true })
  active: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => ABTestGroup, (group) => group.test)
  groups: ABTestGroup[];

  @OneToMany(() => ABTestAssignment, (assignment) => assignment.test)
  assignments: ABTestAssignment[];
}
