import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstimateController } from './estimate.controller';
import { EstimateService } from './estimate.service';
import { EstimationRecord } from './entities/estimation-record.entity';
import { PricingMatrix } from './entities/pricing-matrix.entity';
import { TaxConfig } from './entities/tax-config.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([EstimationRecord, PricingMatrix, TaxConfig]),
  ],
  controllers: [EstimateController],
  providers: [EstimateService],
  exports: [EstimateService],
})
export class EstimateModule {}
