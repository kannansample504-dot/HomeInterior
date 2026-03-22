import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EstimationRecord } from './entities/estimation-record.entity';
import { PricingMatrix } from './entities/pricing-matrix.entity';
import { TaxConfig } from './entities/tax-config.entity';

const ROOM_AREA_DEFAULTS: Record<string, number> = {
  living_room: 300,
  bedroom: 180,
  kitchen: 150,
  bathroom: 60,
  dining_room: 200,
  home_office: 160,
};

@Injectable()
export class EstimateService {
  constructor(
    @InjectRepository(EstimationRecord)
    private recordsRepo: Repository<EstimationRecord>,
    @InjectRepository(PricingMatrix)
    private pricingRepo: Repository<PricingMatrix>,
    @InjectRepository(TaxConfig)
    private taxRepo: Repository<TaxConfig>,
  ) {}

  async calculate(rooms: { room_type: string; count: number }[], tier: string) {
    const pricingRows = await this.pricingRepo.find({ where: { tier } });
    const pricingMap: Record<string, number> = {};
    for (const row of pricingRows) {
      pricingMap[row.roomType] = Number(row.pricePerSqft);
    }

    const taxConfig = await this.taxRepo.findOne({ where: { id: 1 } });
    const gstPercent = taxConfig ? Number(taxConfig.gstPercent) : 18;
    const labourPercent = taxConfig ? Number(taxConfig.labourPercent) : 12;

    const breakdown: any[] = [];
    let materialTotal = 0;

    for (const room of rooms) {
      const defaultArea = ROOM_AREA_DEFAULTS[room.room_type] || 200;
      const area = defaultArea * room.count;
      const pricePerSqft = pricingMap[room.room_type] || 0;
      const roomCost = area * pricePerSqft;

      breakdown.push({
        room_type: room.room_type,
        count: room.count,
        area_sqft: area,
        price_per_sqft: pricePerSqft,
        room_cost: roomCost,
      });

      materialTotal += roomCost;
    }

    const labourCost = materialTotal * (labourPercent / 100);
    const subtotal = materialTotal + labourCost;
    const gstAmount = subtotal * (gstPercent / 100);
    const grandTotal = subtotal + gstAmount;

    return {
      breakdown,
      material_cost: materialTotal,
      labour_cost: labourCost,
      labour_percent: labourPercent,
      subtotal,
      gst_amount: gstAmount,
      gst_percent: gstPercent,
      grand_total: grandTotal,
      tier,
    };
  }

  async save(data: any, userId?: string) {
    const result = await this.calculate(data.rooms, data.tier);

    const record = this.recordsRepo.create({
      userId: userId || null,
      guestEmail: data.guest_email || '',
      projectType: data.project_type || 'new',
      propertyType: data.property_type || 'apartment',
      style: data.style || '',
      tier: data.tier,
      roomsBreakdown: result.breakdown,
      materialCost: result.material_cost,
      labourCost: result.labour_cost,
      labourPercentSnapshot: result.labour_percent,
      subtotal: result.subtotal,
      gstAmount: result.gst_amount,
      gstPercentSnapshot: result.gst_percent,
      grandTotal: result.grand_total,
      status: userId ? 'saved' : 'draft',
    });

    return this.recordsRepo.save(record);
  }

  async findByUser(userId: string) {
    return this.recordsRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string, userId: string) {
    return this.recordsRepo.findOne({ where: { id, userId } });
  }

  async delete(id: string, userId: string) {
    const record = await this.recordsRepo.findOne({ where: { id, userId } });
    if (!record) return null;
    await this.recordsRepo.remove(record);
    return { deleted: true };
  }
}
