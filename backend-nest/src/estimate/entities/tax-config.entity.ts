import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity('tax_config')
export class TaxConfig {
  @PrimaryColumn()
  id: number;

  @Column({ name: 'gst_percent', type: 'decimal', precision: 5, scale: 2, default: 18 })
  gstPercent: number;

  @Column({ name: 'labour_percent', type: 'decimal', precision: 5, scale: 2, default: 12 })
  labourPercent: number;

  @Column({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
