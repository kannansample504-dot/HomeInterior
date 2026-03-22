import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('estimation_records')
export class EstimationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ name: 'guest_email', default: '' })
  guestEmail: string;

  @Column({ name: 'project_type', default: 'new' })
  projectType: string;

  @Column({ name: 'property_type', default: 'apartment' })
  propertyType: string;

  @Column({ default: '' })
  style: string;

  @Column({ default: '' })
  tier: string;

  @Column({ name: 'rooms_breakdown', type: 'jsonb', default: [] })
  roomsBreakdown: any[];

  @Column({ name: 'material_cost', type: 'decimal', precision: 12, scale: 2, default: 0 })
  materialCost: number;

  @Column({ name: 'labour_cost', type: 'decimal', precision: 12, scale: 2, default: 0 })
  labourCost: number;

  @Column({ name: 'labour_percent_snapshot', type: 'decimal', precision: 5, scale: 2, default: 12 })
  labourPercentSnapshot: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 })
  subtotal: number;

  @Column({ name: 'gst_amount', type: 'decimal', precision: 12, scale: 2, default: 0 })
  gstAmount: number;

  @Column({ name: 'gst_percent_snapshot', type: 'decimal', precision: 5, scale: 2, default: 18 })
  gstPercentSnapshot: number;

  @Column({ name: 'grand_total', type: 'decimal', precision: 12, scale: 2, default: 0 })
  grandTotal: number;

  @Column({ default: 'draft' })
  status: string;

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date;

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date;
}
