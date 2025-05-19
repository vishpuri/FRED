import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import { handleDynamicSeries } from '../../../src/fred/tools.js';

// Mock global fetch to avoid open handles
global.fetch = jest.fn(() => 
  Promise.reject(new Error('Mocked fetch error'))
);

// Since we can't easily mock fetchSeriesData directly due to ESM limitations,
// this test just verifies that the function is called in specific ways
// by testing for expected errors
describe('handleDynamicSeries', () => {
  test('extracts series_id from input parameters', async () => {
    try {
      // This will fail because fetchSeriesData is not mocked,
      // but we can verify from the error that series_id is extracted correctly
      await handleDynamicSeries({
        series_id: 'TEST_SERIES',
        start_date: '2023-01-01'
      });
      // If this doesn't throw, the test should fail
      expect(true).toBe(false);
    } catch (error) {
      // Verify the error message contains the series_id
      if (error instanceof Error) {
        expect(error.message).toContain('TEST_SERIES');
      } else {
        // Unexpected error type, fail the test
        expect(true).toBe(false);
      }
    }
  });
  
  test('formats error with additional context', async () => {
    try {
      // This will throw an error we can inspect
      await handleDynamicSeries({ series_id: 'GDP' });
      // If it doesn't throw, fail the test
      expect(true).toBe(false);
    } catch (error) {
      // Verify that our error contains the expected message pattern
      if (error instanceof Error) {
        expect(error.message).toContain('Failed to retrieve FRED series data');
      } else {
        // Unexpected error type, fail the test
        expect(true).toBe(false);
      }
    }
  });
});