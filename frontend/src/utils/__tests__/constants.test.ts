import { describe, it, expect } from 'vitest';
import { ROOM_TYPES, TIERS, PROPERTY_TYPES, DESIGN_STYLES, STATUS_COLORS } from '../constants';

describe('ROOM_TYPES', () => {
  it('has 6 room types', () => {
    expect(ROOM_TYPES).toHaveLength(6);
  });

  it('each room has value, label, icon, area', () => {
    ROOM_TYPES.forEach(r => {
      expect(r).toHaveProperty('value');
      expect(r).toHaveProperty('label');
      expect(r).toHaveProperty('icon');
      expect(r).toHaveProperty('area');
      expect(r.area).toBeGreaterThan(0);
    });
  });

  it('has unique values', () => {
    const values = ROOM_TYPES.map(r => r.value);
    expect(new Set(values).size).toBe(values.length);
  });
});

describe('TIERS', () => {
  it('has 4 tiers in expected order', () => {
    expect(TIERS.map(t => t.value)).toEqual(['basic', 'standard', 'premium', 'luxury']);
  });
});

describe('PROPERTY_TYPES', () => {
  it('has 4 property types', () => {
    expect(PROPERTY_TYPES).toHaveLength(4);
  });
});

describe('DESIGN_STYLES', () => {
  it('has 6 design styles', () => {
    expect(DESIGN_STYLES).toHaveLength(6);
  });

  it('each style has an image URL', () => {
    DESIGN_STYLES.forEach(s => {
      expect(s.image).toMatch(/^https:\/\/images\.unsplash\.com/);
    });
  });

  it('each style has a multiplier >= 1', () => {
    DESIGN_STYLES.forEach(s => {
      expect(s.multiplier).toBeGreaterThanOrEqual(1.0);
    });
  });
});

describe('STATUS_COLORS', () => {
  it('has all expected statuses', () => {
    expect(Object.keys(STATUS_COLORS)).toEqual(
      expect.arrayContaining(['draft', 'saved', 'reviewed', 'converted', 'completed'])
    );
  });

  it('each status has bg, text, dot', () => {
    Object.values(STATUS_COLORS).forEach(c => {
      expect(c).toHaveProperty('bg');
      expect(c).toHaveProperty('text');
      expect(c).toHaveProperty('dot');
    });
  });
});
