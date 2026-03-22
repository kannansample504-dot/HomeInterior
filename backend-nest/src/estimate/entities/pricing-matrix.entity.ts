import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('pricing_matrix')
export class PricingMatrix {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'room_type' })
  roomType: string;

  @Column()
  tier: string;

  @Column({ name: 'price_per_sqft', type: 'decimal', precision: 10, scale: 2 })
  pricePerSqft: number;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
