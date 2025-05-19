import { describe, expect, test, jest, beforeEach, afterEach } from '@jest/globals';
import fs from 'fs';
import path from 'path';
import { createServer, startServer } from '../../src/index.js';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Create mock class instead of using jest.mock
// This avoids ESM module mocking issues
const MockServer = jest.fn().mockImplementation(() => ({
  connect: jest.fn().mockResolvedValue(undefined)
}));

const MockTransport = jest.fn().mockImplementation(() => ({}));

describe('Server entry point', () => {
  const indexPath = path.resolve(process.cwd(), 'src/index.ts');

  // Mock console.error to avoid cluttering test output
  const originalConsoleError = console.error;
  let mockConsoleError;

  beforeEach(() => {
    jest.clearAllMocks();
    // Create a spy for console.error
    mockConsoleError = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    // Restore console.error
    mockConsoleError.mockRestore();
    console.error = originalConsoleError;
  });

  test('index file exists', () => {
    expect(fs.existsSync(indexPath)).toBe(true);
  });

  test('index file contains server initialization code', () => {
    const content = fs.readFileSync(indexPath, 'utf-8');

    // Check for key components in the server setup
    expect(content).toContain('McpServer');
    expect(content).toContain('StdioServerTransport');
    expect(content).toContain('registerSeriesTool');
    expect(content).toContain('registerDynamicSeriesTool');
    expect(content).toContain('export function createServer()');
    expect(content).toContain('export async function startServer');
  });

  test('index file registers multiple FRED data series', () => {
    const content = fs.readFileSync(indexPath, 'utf-8');

    // Check if all expected series are registered
    const expectedSeries = [
      'CPIAUCSL',
      'RRPONTSYD',
      'MORTGAGE30US',
      'T10Y2Y',
      'UNRATE',
      'WALCL',
      'GDP',
      'GDPC1',
      'DGS10'
    ];

    // Verify each series is registered
    expectedSeries.forEach(series => {
      expect(content).toContain(`registerSeriesTool(server, "${series}")`);
    });
  });
});
