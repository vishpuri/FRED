const { spawn } = require('child_process');

class MCPClient {
  constructor() {
    this.process = null;
    this.isConnected = false;
    this.requestId = 0;
    this.pendingRequests = new Map();
    this.buffer = '';
  }

  async connect() {
    if (this.isConnected) return;

    const serverPath = process.env.MCP_SERVER_PATH || '../fred-mcp-server/build/index.js';
    console.log('Starting FRED MCP server:', serverPath);
    
    this.process = spawn('node', [serverPath], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: {
        ...process.env,
        FRED_API_KEY: process.env.FRED_API_KEY
      }
    });

    this.process.stdout.on('data', (data) => {
      this.handleResponse(data.toString());
    });

    this.process.stderr.on('data', (data) => {
      const error = data.toString();
      if (!error.includes('FRED MCP Server')) {
        console.error('MCP Server Error:', error);
      }
    });

    this.process.on('error', (error) => {
      console.error('MCP Process Error:', error);
      this.isConnected = false;
    });

    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Initialize connection with proper MCP protocol
    try {
      const initResult = await this.sendRequest('initialize', {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: {}
        },
        clientInfo: {
          name: 'fred-query-app',
          version: '1.0.0'
        }
      });

      console.log('MCP Initialize result:', initResult);

      // Send initialized notification
      this.sendNotification('initialized', {});

      this.isConnected = true;
      console.log('Connected to FRED MCP server');
      
      // List available tools
      const tools = await this.listTools();
      console.log('Available MCP tools:', tools.tools?.map(t => t.name) || []);
      
    } catch (error) {
      console.error('Failed to initialize MCP connection:', error);
      throw error;
    }
  }

  async sendRequest(method, params = {}) {
    const id = ++this.requestId;
    const request = {
      jsonrpc: '2.0',
      id,
      method,
      params
    };

    return new Promise((resolve, reject) => {
      this.pendingRequests.set(id, { resolve, reject });
      
      const requestStr = JSON.stringify(request) + '\n';
      this.process.stdin.write(requestStr);
      console.log('Sent MCP request:', method, 'with ID:', id);
      
      setTimeout(() => {
        if (this.pendingRequests.has(id)) {
          this.pendingRequests.delete(id);
          reject(new Error(`MCP request timeout for ${method} (ID: ${id})`));
        }
      }, 15000);
    });
  }

  sendNotification(method, params = {}) {
    const notification = {
      jsonrpc: '2.0',
      method,
      params
    };
    
    const notificationStr = JSON.stringify(notification) + '\n';
    this.process.stdin.write(notificationStr);
    console.log('Sent MCP notification:', method);
  }

  handleResponse(data) {
    this.buffer += data;
    const lines = this.buffer.split('\n');
    this.buffer = lines.pop() || '';
    
    for (const line of lines) {
      if (!line.trim()) continue;
      
      try {
        const response = JSON.parse(line);
        console.log('Received MCP response:', response);
        
        if (response.id && this.pendingRequests.has(response.id)) {
          const { resolve, reject } = this.pendingRequests.get(response.id);
          this.pendingRequests.delete(response.id);
          
          if (response.error) {
            console.error('MCP Error Response:', response.error);
            reject(new Error(`MCP Error ${response.error.code}: ${response.error.message}`));
          } else {
            resolve(response.result);
          }
        }
      } catch (error) {
        console.warn('Failed to parse MCP response:', line.substring(0, 200));
      }
    }
  }

  async callTool(name, args) {
    if (!this.isConnected) {
      await this.connect();
    }
    
    console.log(`Calling MCP tool: ${name} with args:`, args);
    
    try {
      const result = await this.sendRequest('tools/call', {
        name,
        arguments: args
      });
      
      console.log(`MCP tool ${name} result:`, result);
      return result;
    } catch (error) {
      console.error(`MCP tool ${name} failed:`, error);
      throw error;
    }
  }

  async listTools() {
    if (!this.isConnected) {
      await this.connect();
    }
    
    return await this.sendRequest('tools/list');
  }

  disconnect() {
    if (this.process) {
      this.process.kill();
      this.process = null;
      this.isConnected = false;
      console.log('Disconnected from FRED MCP server');
    }
  }
}

module.exports = new MCPClient();