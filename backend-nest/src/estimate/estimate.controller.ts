import {
  Controller, Post, Get, Delete, Body, Param, UseGuards, Request,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { EstimateService } from './estimate.service';
import { CalculateEstimateDto } from './dto/calculate-estimate.dto';
import { SaveEstimateDto } from './dto/save-estimate.dto';

@ApiTags('Estimate')
@Controller('api/estimate')
export class EstimateController {
  constructor(private estimateService: EstimateService) {}

  @Post('calculate')
  @ApiOperation({ summary: 'Calculate estimate (no auth required)' })
  async calculate(@Body() dto: CalculateEstimateDto) {
    return this.estimateService.calculate(dto.rooms, dto.tier);
  }

  @Post()
  @ApiOperation({ summary: 'Save estimate (auth optional)' })
  async save(@Body() dto: SaveEstimateDto, @Request() req) {
    const userId = req.user?.id || null;
    return this.estimateService.save(dto, userId);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List user estimates' })
  async list(@Request() req) {
    return this.estimateService.findByUser(req.user.id);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get single estimate' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.estimateService.findById(id, req.user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete own estimate' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.estimateService.delete(id, req.user.id);
  }
}
