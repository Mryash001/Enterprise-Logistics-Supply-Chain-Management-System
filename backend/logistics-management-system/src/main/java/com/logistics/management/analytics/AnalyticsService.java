package com.logistics.management.analytics;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public List<Map<String, Object>> getInventorySummary() {
        return analyticsRepository.getInventorySummary();
    }

    public Map<String, Object> getOverallAnalytics() {
        return analyticsRepository.getOverallAnalytics();
    }
}