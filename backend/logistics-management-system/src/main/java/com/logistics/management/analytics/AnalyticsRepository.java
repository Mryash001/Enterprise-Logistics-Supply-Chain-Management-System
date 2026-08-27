package com.logistics.management.analytics;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;

@Repository
public class AnalyticsRepository {

    private final JdbcTemplate jdbcTemplate;

    public AnalyticsRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<Map<String, Object>> getInventorySummary() {
        String sql = """
                SELECT
                    p.product_code,
                    p.name AS product_name,
                    w.warehouse_code,
                    w.name AS warehouse_name,
                    i.quantity
                FROM inventory i
                JOIN products p ON i.product_id = p.id
                JOIN warehouses w ON i.warehouse_id = w.id
                ORDER BY p.name, w.name
                """;

        return jdbcTemplate.queryForList(sql);
    }

    public Map<String, Object> getOverallAnalytics() {
        String sql = """
                SELECT
                    (SELECT COUNT(*) FROM products) AS total_products,
                    (SELECT COUNT(*) FROM warehouses) AS total_warehouses,
                    COALESCE(SUM(i.quantity), 0) AS total_stock,
                    COALESCE(SUM(i.quantity * p.price), 0) AS total_inventory_value
                FROM inventory i
                JOIN products p ON i.product_id = p.id
                """;

        return jdbcTemplate.queryForMap(sql);
    }
}