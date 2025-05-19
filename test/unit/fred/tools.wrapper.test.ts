import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import { FREDToolsWrapper } from '../../../src/fred/tools.wrapper.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

describe('FREDToolsWrapper', () => {
  // Create mock functions
  const mockRegisterSeriesTool = jest.fn();
  const mockRegisterDynamicSeriesTool = jest.fn();
  const mockHandleDynamicSeries = jest.fn();
  const mockFetchSeriesData = jest.fn();
  
  // Create a wrapper with mock functions
  let wrapper: FREDToolsWrapper;
  
  // Mock server
  const mockServer = {
    tool: jest.fn()
  } as unknown as McpServer;
  
  // Setup before each test
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    
    // Create wrapper with mock functions
    wrapper = new FREDToolsWrapper(
      mockRegisterSeriesTool,
      mockRegisterDynamicSeriesTool,
      mockHandleDynamicSeries,
      mockFetchSeriesData
    );
    
    // Mock console.error to prevent test output clutter
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  
  test('registerSeriesTool calls underlying function', () => {
    wrapper.registerSeriesTool(mockServer, 'CPIAUCSL');
    
    expect(mockRegisterSeriesTool).toHaveBeenCalledWith(mockServer, 'CPIAUCSL');
  });
  
  test('registerDynamicSeriesTool calls underlying function', () => {
    wrapper.registerDynamicSeriesTool(mockServer);
    
    expect(mockRegisterDynamicSeriesTool).toHaveBeenCalledWith(mockServer);
  });
  
  test('handleDynamicSeries properly extracts series_id', async () => {
    mockFetchSeriesData.mockResolvedValue({ result: 'success' });
    
    const input = {
      series_id: 'GDP',
      start_date: '2023-01-01',
      limit: 10
    };
    
    const result = await wrapper.handleDynamicSeries(input);
    
    // Verify fetchSeriesData was called with correct parameters
    expect(mockFetchSeriesData).toHaveBeenCalledWith('GDP', {
      start_date: '2023-01-01',
      limit: 10
    });
    
    // Verify result
    expect(result).toEqual({ result: 'success' });
  });
  
  test('handleDynamicSeries handles errors', async () => {
    mockFetchSeriesData.mockRejectedValue(new Error('Test error'));
    
    const input = {
      series_id: 'GDP',
      start_date: '2023-01-01'
    };
    
    await expect(wrapper.handleDynamicSeries(input))
      .rejects
      .toThrow('Failed to retrieve FRED series data: Test error');
  });
  
  test('createSeriesHandler returns a function that logs and fetches data', async () => {
    mockFetchSeriesData.mockResolvedValue({ result: 'success' });
    
    const handler = wrapper.createSeriesHandler('CPIAUCSL');
    const input = { start_date: '2023-01-01' };
    
    const result = await handler(input);
    
    // Verify fetchSeriesData was called with correct parameters
    expect(mockFetchSeriesData).toHaveBeenCalledWith('CPIAUCSL', input);
    
    // Verify result
    expect(result).toEqual({ result: 'success' });
    
    // Verify logging (console.error is mocked)
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenNthCalledWith(1, expect.stringContaining('CPIAUCSL tool called with params'));
    expect(console.error).toHaveBeenNthCalledWith(2, expect.stringContaining('CPIAUCSL tool handling complete'));
  });
  
  test('createDynamicSeriesHandler returns a function that logs and handles requests', async () => {
    // Return mock data
    const mockResult = { result: 'success' };
    mockFetchSeriesData.mockResolvedValue(mockResult);
    
    const handler = wrapper.createDynamicSeriesHandler();
    const input = { series_id: 'GDP', start_date: '2023-01-01' };
    
    const result = await handler(input);
    
    // Verify logging was called
    expect(console.error).toHaveBeenCalledTimes(2);
    expect(console.error).toHaveBeenNthCalledWith(1, expect.stringContaining('FREDSeries tool called with params'));
    expect(console.error).toHaveBeenNthCalledWith(2, expect.stringContaining('FREDSeries tool handling complete'));
    
    // Since we're using our own implementation, fetchSeriesData should be called
    expect(mockFetchSeriesData).toHaveBeenCalledWith('GDP', { start_date: '2023-01-01' });
    
    // Verify result
    expect(result).toEqual(mockResult);
  });
  
  test('registerAllSeriesTools registers multiple series tools', () => {
    const seriesIds = ['CPIAUCSL', 'GDP', 'UNRATE'];
    
    wrapper.registerAllSeriesTools(mockServer, seriesIds);
    
    // Verify each series was registered
    seriesIds.forEach(seriesId => {
      expect(mockRegisterSeriesTool).toHaveBeenCalledWith(mockServer, seriesId);
    });
    
    // Verify dynamic tool was registered
    expect(mockRegisterDynamicSeriesTool).toHaveBeenCalledWith(mockServer);
  });
});