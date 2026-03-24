import { describe, it, expect } from 'vitest';
import { formatINR } from '../formatCurrency';

describe('formatINR', () => {
  it('formats zero', () => {
    expect(formatINR(0)).toContain('0');
  });

  it('formats small amounts', () => {
    const result = formatINR(1500);
    expect(result).toContain('1,500');
  });

  it('formats lakh-scale amounts with Indian grouping', () => {
    const result = formatINR(150000);
    expect(result).toContain('1,50,000');
  });

  it('formats crore-scale amounts', () => {
    const result = formatINR(10000000);
    expect(result).toContain('1,00,00,000');
  });

  it('includes rupee symbol', () => {
    expect(formatINR(100)).toMatch(/₹/);
  });

  it('rounds to zero decimal places', () => {
    const result = formatINR(1234.56);
    expect(result).not.toContain('.');
  });
});
