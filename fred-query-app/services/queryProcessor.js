// services/queryProcessor.js
const llmAgent = require('./llmAgent');

class QueryProcessor {
  async processQuery(query) {
    try {
      console.log('Processing query with LLM Agent architecture:', query);
      
      const result = await llmAgent.processQuery(query);
      
      // Format for frontend display
      return {
        success: true,
        analysis: {
          understanding: result.answer,
          method: 'llm_agent_with_mcp',
          reasoning: result.analysis.method
        },
        series: {
          id: 'LLM_AGENT_ANALYSIS',
          title: result.answer
        },
        data: this.formatForVisualization(result.results),
        metadata: {
          query_type: 'intelligent_analysis',
          execution_plan: result.execution_plan.steps,
          data_quality: result.data_quality,
          findings: result.analysis.findings
        }
      };
    } catch (error) {
      console.error('Query processing error:', error);
      throw error;
    }
  }

  formatForVisualization(results) {
    return results.map((result, index) => ({
      date: result.date || `Result-${index + 1}`,
      value: result.value,
      category: result.category,
      metric: result.metric,
      source: result.source_series
    }));
  }
}

module.exports = new QueryProcessor();