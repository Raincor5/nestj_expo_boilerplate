import { useCallback, useRef } from 'react';
import { abtestService } from '../services/abtestService';

interface MetricEvent {
  name: string;
  value?: string;
  timestamp: number;
}

/**
 * Hook for tracking A/B test metrics
 * Batches events and sends them to the backend with debouncing
 */
export function useABTestMetrics(testName: string, debounceMs: number = 5000) {
  const metricsQueue = useRef<MetricEvent[]>([]);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  const flushMetrics = useCallback(async () => {
    if (metricsQueue.current.length === 0) return;

    try {
      const metricsToSend = metricsQueue.current.splice(0);
      await Promise.all(
        metricsToSend.map((event) =>
          abtestService.recordMetric(testName, {
            metricName: event.name,
            metricValue: event.value,
          }),
        ),
      );
    } catch (error) {
      console.error('Failed to record metrics:', error);
      // Re-add failed metrics to queue
      // (in production, you'd want more sophisticated retry logic)
    }
  }, [testName]);

  const trackEvent = useCallback(
    (eventName: string, eventValue?: string) => {
      // Add event to queue
      metricsQueue.current.push({
        name: eventName,
        value: eventValue,
        timestamp: Date.now(),
      });

      // Reset debounce timer
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      // Set new debounce timer
      debounceTimer.current = setTimeout(() => {
        flushMetrics();
      }, debounceMs);
    },
    [debounceMs, flushMetrics],
  );

  const trackEventImmediate = useCallback(
    async (eventName: string, eventValue?: string) => {
      try {
        await abtestService.recordMetric(testName, {
          metricName: eventName,
          metricValue: eventValue,
        });
      } catch (error) {
        console.error('Failed to record metric immediately:', error);
      }
    },
    [testName],
  );

  return {
    trackEvent,
    trackEventImmediate,
    flushMetrics,
  };
}
