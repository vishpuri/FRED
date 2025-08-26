const https = require('https');

class FredService {
  constructor() {
    this.baseUrl = 'https://api.stlouisfed.org/fred';
    this.apiKey = process.env.FRED_API_KEY;
    
    if (!this.apiKey) {
      console.warn('⚠️  FRED_API_KEY not found in environment variables');
    } else {
      console.log('✅ FRED API Key loaded');
    }
  }

  async makeRequest(endpoint, params = {}) {
    if (!this.apiKey) {
      throw new Error('FRED API key is required. Please set FRED_API_KEY in your .env file');
    }

    return new Promise((resolve, reject) => {
      // Build query string manually
      const queryParams = {
        api_key: this.apiKey,
        file_type: 'json',
        ...params
      };
      
      const queryString = Object.entries(queryParams)
        .filter(([key, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      
      const fullUrl = `${this.baseUrl}${endpoint}?${queryString}`;
      console.log(`🔗 FRED API URL: ${fullUrl}`);
      
      const request = https.get(fullUrl, (res) => {
        let data = '';
        
        console.log(`📡 FRED API Response Status: ${res.statusCode}`);
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`📄 FRED API Raw Response (first 100 chars): ${data.substring(0, 100)}`);
          
          if (res.statusCode !== 200) {
            reject(new Error(`FRED API returned status ${res.statusCode}: ${data}`));
            return;
          }
          
          try {
            const jsonData = JSON.parse(data);
            
            if (jsonData.error_code) {
              reject(new Error(`FRED API Error (${jsonData.error_code}): ${jsonData.error_message}`));
            } else {
              console.log(`✅ FRED API request successful: ${endpoint}`);
              resolve(jsonData);
            }
          } catch (parseError) {
            console.error('❌ Failed to parse FRED API response as JSON');
            console.error('📄 Full response:', data);
            reject(new Error(`Invalid JSON response from FRED API: ${parseError.message}`));
          }
        });
      });
      
      request.on('error', (error) => {
        console.error('❌ FRED API request failed:', error);
        reject(new Error(`Network error: ${error.message}`));
      });
      
      request.setTimeout(10000, () => {
        request.destroy();
        reject(new Error('Request timeout'));
      });
    });
  }

  async getSeries(params) {
    try {
      const result = await this.makeRequest('/series/observations', {
        series_id: params.series_id,
        observation_start: params.observation_start,
        observation_end: params.observation_end,
        limit: params.limit,
        offset: params.offset || 0,
        sort_order: params.sort_order || 'asc',
        units: params.units || 'lin',
        frequency: params.frequency,
        aggregation_method: params.aggregation_method || 'avg'
      });
      
      return result;
    } catch (error) {
      console.error('FRED series error:', error.message);
      throw error;
    }
  }

  async search(params) {
    try {
      const result = await this.makeRequest('/series/search', {
        search_text: params.search_text,
        limit: params.limit || 25,
        offset: params.offset || 0,
        order_by: params.order_by || 'popularity',
        sort_order: params.sort_order || 'desc'
      });
      
      return result;
    } catch (error) {
      console.error('FRED search error:', error.message);
      throw error;
    }
  }

  async browse(params) {
    return { message: 'Browse not implemented yet' };
  }
}

module.exports = new FredService();