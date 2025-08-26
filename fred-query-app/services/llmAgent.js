const OpenAI = require('openai');
const mcpClient = require('./mcpClient');

class LLMAgent {
  constructor() {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY is required for LLM Agent');
    }
    
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
    
    console.log('LLM Agent initialized for MCP communication');
  }

  async processQuery(query) {
    console.log('LLM Agent processing with MCP:', query);

    try {
      // Step 1: Parse intent and plan data needs
      const plan = await this.createExecutionPlan(query);
      console.log('Execution plan:', plan.intent);

      // Step 2: Execute data retrieval via MCP
      const rawData = await this.executeDataRetrieval(plan);
      console.log('MCP data retrieved for', Object.keys(rawData).length, 'series');

      if (Object.keys(rawData).length === 0) {
        throw new Error('No data retrieved from FRED MCP server');
      }

      // Step 3: Interpret and validate data
      const analysis = await this.interpretData(query, plan, rawData);
      console.log('Analysis complete');

      return analysis;
    } catch (error) {
      console.error('LLM Agent MCP processing failed:', error);
      throw error;
    }
  }

  async createExecutionPlan(query) {
    const response = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `You are an economic data analyst creating execution plans for FRED MCP server queries.

The FRED MCP server provides these tools:
- fred_search: Search for FRED series
- fred_series: Get time series data 
- fred_browse: Browse FRED categories`
      }, {
        role: "user",
        content: `Query: "${query}"

For employment sector queries, target these series:
- MANEMP: Manufacturing Employment
- USCONS: Construction Employment
- USTPU: Trade, Transportation & Utilities
- USPBS: Professional & Business Services  
- USLAH: Leisure & Hospitality
- USEHS: Education & Health Services
- USFIRE: Financial Activities
- USGOV: Government Employment

Create an execution plan:

{
  "intent": "what user wants to know",
  "query_type": "sector_analysis|comparison|trend",
  "mcp_steps": [
    {
      "tool": "fred_search|fred_series",
      "params": {"search_text": "employment", "limit": 5},
      "purpose": "why this step"
    }
  ],
  "target_series": ["MANEMP", "USPBS", "USLAH"],
  "time_range": {"start": "2024-01-01", "end": "2024-12-31"}
}`
      }],
      temperature: 0.1
    });

    return JSON.parse(response.choices[0].message.content);
  }

  async executeDataRetrieval(plan) {
    await mcpClient.connect();
    const retrievedData = {};

    // Execute each MCP step
    for (const step of plan.mcp_steps) {
      console.log(`Executing MCP step: ${step.tool} for ${step.purpose}`);
      
      try {
        const result = await mcpClient.callTool(step.tool, step.params);
        
        if (step.tool === 'fred_search') {
          // Process search results
          if (result.content?.[0]?.text) {
            const searchData = JSON.parse(result.content[0].text);
            console.log('Search found', searchData.seriess?.length || 0, 'series');
            
            // Get data for found series
            for (const series of (searchData.seriess || []).slice(0, 5)) {
              const seriesResult = await mcpClient.callTool('fred_series', {
                series_id: series.id,
                observation_start: plan.time_range.start,
                observation_end: plan.time_range.end,
                limit: 50
              });
              
              if (seriesResult.content?.[0]?.text) {
                const seriesData = JSON.parse(seriesResult.content[0].text);
                retrievedData[series.id] = {
                  series_info: series,
                  data: seriesData,
                  purpose: step.purpose
                };
              }
            }
          }
        } else if (step.tool === 'fred_series') {
          // Direct series fetch
          if (result.content?.[0]?.text) {
            const seriesData = JSON.parse(result.content[0].text);
            const seriesId = step.params.series_id;
            retrievedData[seriesId] = {
              series_info: { id: seriesId, title: `Series ${seriesId}` },
              data: seriesData,
              purpose: step.purpose
            };
          }
        }
      } catch (error) {
        console.error(`MCP step failed (${step.tool}):`, error.message);
      }
    }

    // Also try direct series fetches for target series
    for (const seriesId of plan.target_series || []) {
      if (!retrievedData[seriesId]) {
        try {
          console.log(`Direct MCP fetch for ${seriesId}`);
          const result = await mcpClient.callTool('fred_series', {
            series_id: seriesId,
            observation_start: plan.time_range.start,
            observation_end: plan.time_range.end,
            limit: 50
          });
          
          if (result.content?.[0]?.text) {
            const seriesData = JSON.parse(result.content[0].text);
            retrievedData[seriesId] = {
              series_info: { id: seriesId, title: this.getSeriesDescription(seriesId) },
              data: seriesData,
              purpose: 'Employment sector analysis'
            };
          }
        } catch (error) {
          console.error(`Direct fetch failed for ${seriesId}:`, error.message);
        }
      }
    }

    return retrievedData;
  }

  getSeriesDescription(seriesId) {
    const descriptions = {
      'MANEMP': 'Manufacturing Employment',
      'USCONS': 'Construction Employment', 
      'USTPU': 'Trade, Transportation & Utilities Employment',
      'USPBS': 'Professional & Business Services Employment',
      'USLAH': 'Leisure & Hospitality Employment',
      'USEHS': 'Education & Health Services Employment',
      'USFIRE': 'Financial Activities Employment',
      'USGOV': 'Government Employment'
    };
    return descriptions[seriesId] || seriesId;
  }

  async interpretData(originalQuery, plan, rawData) {
    const dataContext = Object.entries(rawData).map(([id, info]) => {
      const observations = info.data.observations || [];
      const validObs = observations.filter(obs => obs.value !== '.' && !isNaN(parseFloat(obs.value)));
      
      if (validObs.length === 0) return null;
      
      const latest = validObs[validObs.length - 1];
      const yearAgo = validObs.find(obs => {
        const obsDate = new Date(obs.date);
        const latestDate = new Date(latest.date);
        return Math.abs(obsDate.getFullYear() - latestDate.getFullYear()) === 1;
      });
      
      const change = yearAgo ? parseFloat(latest.value) - parseFloat(yearAgo.value) : 0;
      const changePercent = yearAgo ? (change / parseFloat(yearAgo.value)) * 100 : 0;
      
      return {
        series_id: id,
        title: info.series_info.title,
        latest_value: parseFloat(latest.value),
        latest_date: latest.date,
        absolute_change: change,
        percent_change: changePercent,
        purpose: info.purpose
      };
    }).filter(item => item !== null);

    const interpretationResponse = await this.openai.chat.completions.create({
      model: "gpt-4",
      messages: [{
        role: "system",
        content: `Analyze employment sector data retrieved via FRED MCP server. Provide specific rankings and insights.`
      }, {
        role: "user",
        content: `Query: "${originalQuery}"

Employment Sector Data from MCP:
${dataContext.map(d => 
  `${d.series_id} (${d.title}):
  - Latest: ${d.latest_value.toLocaleString()} (${d.latest_date})
  - Annual change: ${d.absolute_change > 0 ? '+' : ''}${d.absolute_change.toFixed(1)}k (${d.percent_change.toFixed(2)}%)`
).join('\n\n')}

Analyze and rank sectors by employment growth. Provide specific insights.

JSON response:
{
  "answer": "Direct answer with rankings and numbers",
  "rankings": [
    {
      "rank": 1,
      "sector": "sector name", 
      "series_id": "ID",
      "growth_value": 123.4,
      "growth_percent": 2.5
    }
  ],
  "methodology": "how analysis was performed using MCP data"
}`
      }],
      temperature: 0.1
    });

    const interpretation = JSON.parse(interpretationResponse.choices[0].message.content);

    return {
      success: true,
      query: originalQuery,
      answer: interpretation.answer,
      analysis: {
        method: 'llm_agent_mcp',
        methodology: interpretation.methodology
      },
      results: interpretation.rankings,
      raw_data_summary: dataContext
    };
  }
}

module.exports = new LLMAgent();