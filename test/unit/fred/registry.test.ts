import { describe, expect, test } from '@jest/globals';
import { SERIES_REGISTRY, FREDSeriesMetadata } from '../../../src/fred/registry.js';

describe('SERIES_REGISTRY', () => {
  test('contains expected metadata for known series', () => {
    // Test a few known entries in the registry
    expect(SERIES_REGISTRY).toBeDefined();
    
    // Check CPI data
    const cpi = SERIES_REGISTRY['CPIAUCSL'];
    expect(cpi).toBeDefined();
    expect(cpi.title).toBe('Consumer Price Index for All Urban Consumers: All Items in U.S. City Average');
    expect(cpi.units).toBe('Index 1982-1984=100');
    
    // Check RRP data
    const rrp = SERIES_REGISTRY['RRPONTSYD'];
    expect(rrp).toBeDefined();
    expect(rrp.title).toBe('Overnight Reverse Repurchase Agreements: Treasury Securities Sold by the Federal Reserve');
    expect(rrp.units).toBe('Billions of Dollars');
    
    // Check Treasury yield spread
    const t10y2y = SERIES_REGISTRY['T10Y2Y'];
    expect(t10y2y).toBeDefined();
    expect(t10y2y.title).toBe('10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity');
    expect(t10y2y.units).toBe('Percentage Points');
  });

  test('ensures all registry entries have required fields', () => {
    // Each entry should have the correct structure
    Object.entries(SERIES_REGISTRY).forEach(([seriesId, metadata]) => {
      expect(metadata).toMatchObject({
        title: expect.any(String),
        description: expect.any(String),
        units: expect.any(String)
      });
      
      // Title should include the series ID or a descriptive name
      expect(metadata.title.length).toBeGreaterThan(5);
      
      // Description should be meaningful
      expect(metadata.description.length).toBeGreaterThan(10);
      
      // Units should be specified
      expect(metadata.units.length).toBeGreaterThan(0);
    });
  });

  test('registry is exported with correct type definition', () => {
    // Verify the structure corresponds to the FREDSeriesMetadata interface
    const expectedKeys: (keyof FREDSeriesMetadata)[] = ['title', 'description', 'units'];
    
    Object.values(SERIES_REGISTRY).forEach(metadata => {
      expectedKeys.forEach(key => {
        expect(metadata).toHaveProperty(key);
      });
    });
  });
});