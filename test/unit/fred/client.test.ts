import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import { fetchSeriesData } from '../../../src/fred/client.js';

// Test data
const mockAPIResponse = {
  realtime_start: '2023-01-01',
  realtime_end: '2023-01-31',
  observation_start: '2023-01-01',
  observation_end: '2023-01-31',
  units: 'lin',
  output_type: 1,
  file_type: 'json',
  order_by: 'observation_date',
  sort_order: 'asc',
  count: 2,
  offset: 0,
  limit: 1000,
  observations: [
    {
      realtime_start: '2023-01-01',
      realtime_end: '2023-01-31',
      date: '2023-01-15',
      value: '100.5'
    },
    {
      realtime_start: '2023-01-01',
      realtime_end: '2023-01-31',
      date: '2023-01-30',
      value: '101.2'
    }
  ]
};

describe('FRED API client', () => {
  // Store the original fetch
  const originalFetch = global.fetch;
  
  // Setup before tests
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = jest.fn().mockImplementation(() => 
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockAPIResponse),
        text: () => Promise.resolve('response text')
      })
    );
  });
  
  // Cleanup after tests
  afterEach(() => {
    // Restore the original fetch
    global.fetch = originalFetch;
  });
  
  test('fetchSeriesData correctly formats data for known series', async () => {
    // Call the function
    const result = await fetchSeriesData('CPIAUCSL', {
      start_date: '2023-01-01',
      end_date: '2023-01-31'
    });
    
    // Verify fetch was called with the correct URL
    expect(global.fetch).toHaveBeenCalledTimes(1);
    const url = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(url).toContain('series/observations');
    expect(url).toContain('series_id=CPIAUCSL');
    expect(url).toContain('observation_start=2023-01-01');
    expect(url).toContain('observation_end=2023-01-31');
    
    // Check the result structure
    expect(result).toHaveProperty('content');
    expect(Array.isArray(result.content)).toBe(true);
    expect(result.content[0]).toHaveProperty('type', 'text');
    
    // Parse and check the JSON content
    const content = JSON.parse(result.content[0].text);
    expect(content).toHaveProperty('title');
    expect(content).toHaveProperty('description');
    expect(content).toHaveProperty('source', 'Federal Reserve Economic Data (FRED)');
    expect(content).toHaveProperty('series_id', 'CPIAUCSL');
    expect(content).toHaveProperty('total_observations', 2);
    
    // Check data transformation
    expect(content.data).toHaveLength(2);
    expect(content.data[0]).toEqual({
      date: '2023-01-15',
      value: 100.5,
      units: expect.any(String)
    });
  });
  
  test('fetchSeriesData uses default metadata for unknown series', async () => {
    // Call with an unknown series ID
    const result = await fetchSeriesData('UNKNOWN_SERIES', {});
    
    // Parse the response
    const content = JSON.parse(result.content[0].text);
    
    // Check default metadata was used
    expect(content.title).toBe('FRED Data Series: UNKNOWN_SERIES');
    expect(content.description).toBe('Economic data from FRED series UNKNOWN_SERIES');
    expect(content.data[0].units).toBe('Value');
  });
  
  test('fetchSeriesData passes correct parameters to API', async () => {
    // Call with all optional parameters
    await fetchSeriesData('GDP', {
      start_date: '2023-01-01',
      end_date: '2023-12-31',
      limit: 100,
      sort_order: 'desc'
    });
    
    // Check the URL parameters
    const url = (global.fetch as jest.Mock).mock.calls[0][0];
    expect(url).toContain('series_id=GDP');
    expect(url).toContain('observation_start=2023-01-01');
    expect(url).toContain('observation_end=2023-12-31');
    expect(url).toContain('limit=100');
    expect(url).toContain('sort_order=desc');
  });
  
  test('fetchSeriesData handles API errors', async () => {
    // Mock a failed response
    global.fetch = jest.fn().mockImplementationOnce(() => 
      Promise.resolve({
        ok: false,
        status: 404,
        text: () => Promise.resolve('Not Found')
      })
    );
    
    // Call should throw an error
    await expect(fetchSeriesData('CPIAUCSL', {}))
      .rejects.toThrow('Failed to retrieve CPIAUCSL data: FRED API error (404): Not Found');
  });
  
  test('fetchSeriesData rethrows non-Error objects', async () => {
    // Mock a rejection with a non-Error object
    global.fetch = jest.fn().mockImplementationOnce(() => Promise.reject('Not an error'));
    
    // The non-Error should be rethrown as-is
    await expect(fetchSeriesData('CPIAUCSL', {}))
      .rejects.toBe('Not an error');
  });
});