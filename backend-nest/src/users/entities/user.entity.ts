import { Entity, PrimaryColumn, Column, BeforeInsert } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity('users')
export class User {
  @PrimaryColumn('uuid')
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

  @BeforeInsert()
  generateId() {
    if (!this.id) {
      this.id = uuidv4();
    }
  }
}
