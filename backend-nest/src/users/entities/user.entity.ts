import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column({ default: '' })
  phone: string;

  @Column({ default: '' })
  city: string;

  @Column({ default: 'user' })
  role: string;

  @Column()
  password: string;

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ name: 'is_staff', default: false })
  isStaff: boolean;

  @Column({ name: 'is_superuser', default: false })
  isSuperuser: boolean;

  @Column({ name: 'date_joined', type: 'timestamptz', default: () => 'NOW()' })
  dateJoined: Date;

  @Column({ name: 'last_login', type: 'timestamptz', nullable: true })
  lastLogin: Date;
}
