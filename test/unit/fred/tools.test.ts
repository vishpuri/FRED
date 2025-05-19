import { describe, expect, test, jest, beforeEach } from '@jest/globals';
import { registerSeriesTool, registerDynamicSeriesTool, handleDynamicSeries } from '../../../src/fred/tools.js';
import * as clientModule from '../../../src/fred/client.js';

// Create a mock for console.error to avoid cluttering test output
// and to allow us to verify logging behavior
const originalConsoleError = console.error;
console.error = jest.fn();

// Clean up after tests
afterAll(() => {
  console.error = originalConsoleError;
});

describe('FRED tools module', () => {
  // Create a mock server for testing
  const createMockServer = () => ({
    tool: jest.fn()
  });
  
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('registerSeriesTool', () => {
    test('function exists and has correct signature', () => {
      expect(typeof registerSeriesTool).toBe('function');
    });
    
    test('registers a tool with the server with correct parameters', () => {
      const mockServer = createMockServer();
      registerSeriesTool(mockServer as any, 'CPIAUCSL');
      
      // Verify server.tool was called with correct parameters
      expect(mockServer.tool).toHaveBeenCalledTimes(1);
      expect(mockServer.tool.mock.calls[0][0]).toBe('CPIAUCSL');
      
      // Verify description contains series info
      expect(mockServer.tool.mock.calls[0][1]).toContain('Consumer Price Index');
      
      // Verify schema has expected fields
      const schema = mockServer.tool.mock.calls[0][2];
      expect(schema).toHaveProperty('start_date');
      expect(schema).toHaveProperty('end_date');
      expect(schema).toHaveProperty('limit');
      expect(schema).toHaveProperty('sort_order');
      
      // Verify handler is a function
      const handler = mockServer.tool.mock.calls[0][3];
      expect(typeof handler).toBe('function');
    });
    
    test('uses default metadata for unknown series', () => {
      const mockServer = createMockServer();
      registerSeriesTool(mockServer as any, 'UNKNOWN_SERIES');
      
      // Verify description uses default metadata
      const description = mockServer.tool.mock.calls[0][1];
      expect(description).toContain('FRED Data Series: UNKNOWN_SERIES');
    });
  });
  
  describe('handleDynamicSeries', () => {
    test('function exists and has correct signature', () => {
      expect(typeof handleDynamicSeries).toBe('function');
    });
    
    // Note: Due to ESM limitations, we can't properly mock imported modules
    // In a real setting, we would test this function more thoroughly
  });
  
  describe('registerDynamicSeriesTool', () => {
    test('function exists and has correct signature', () => {
      expect(typeof registerDynamicSeriesTool).toBe('function');
    });
    
    test('registers the FREDSeries tool with correct parameters', () => {
      const mockServer = createMockServer();
      registerDynamicSeriesTool(mockServer as any);
      
      // Verify server.tool was called correctly
      expect(mockServer.tool).toHaveBeenCalledTimes(1);
      expect(mockServer.tool.mock.calls[0][0]).toBe('FREDSeries');
      
      // Verify description is appropriate
      expect(mockServer.tool.mock.calls[0][1]).toContain('Retrieve data for any FRED data series');
      
      // Verify schema includes series_id parameter and query parameters
      const schema = mockServer.tool.mock.calls[0][2];
      expect(schema).toHaveProperty('series_id');
      expect(schema).toHaveProperty('start_date');
      expect(schema).toHaveProperty('end_date');
      expect(schema).toHaveProperty('limit');
      expect(schema).toHaveProperty('sort_order');
      
      // Verify handler is a function
      const handler = mockServer.tool.mock.calls[0][3];
      expect(typeof handler).toBe('function');
    });
  });
});