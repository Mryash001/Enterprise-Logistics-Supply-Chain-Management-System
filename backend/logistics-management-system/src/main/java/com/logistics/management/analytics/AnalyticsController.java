package com.logistics.management.analytics;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    @GetMapping("/inventory")
    public List<Map<String, Object>> getInventorySummary() {
        return analyticsService.getInventorySummary();
    }

    @GetMapping("/overview")
    public Map<String, Object> getOverallAnalytics() {
        return analyticsService.getOverallAnalytics();
    }
}