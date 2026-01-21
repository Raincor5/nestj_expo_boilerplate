import api from './api';

interface RecordMetricRequest {
  metricName: string;
  metricValue?: string;
}

export const abtestService = {
  /**
   * Get user's assignment for a test
   */
  async getTestGroup(testName: string): Promise<{
    testId: string;
    testName: string;
    groupId: string;
    groupName: string;
    assignedAt: string;
  }> {
    const response = await api.get(`/abtest/group/${testName}`);
    return response.data;
  },

  /**
   * Record a metric for the user
   */
  async recordMetric(
    testName: string,
    metricData: RecordMetricRequest,
  ): Promise<{
    metricId: string;
    metricName: string;
    metricValue?: string;
    recordedAt: string;
  }> {
    const response = await api.post(`/abtest/metrics/${testName}`, metricData);
    return response.data;
  },

  /**
   * Batch record multiple metrics
   */
  async recordMetrics(
    testName: string,
    metrics: RecordMetricRequest[],
  ): Promise<any[]> {
    const results = await Promise.all(
      metrics.map((metric) => this.recordMetric(testName, metric)),
    );
    return results;
  },

  /**
   * Get user's metrics for a test
   */
  async getUserMetrics(testName: string): Promise<any[]> {
    const response = await api.get(`/abtest/metrics/${testName}`);
    return response.data;
  },
};
