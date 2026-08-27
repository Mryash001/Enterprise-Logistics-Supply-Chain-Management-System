package com.logistics.management.controller;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryAlertController {

    private final JdbcTemplate jdbcTemplate;

    public InventoryAlertController(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @GetMapping("/alerts")
    public List<Map<String, Object>> getInventoryAlerts() {

        return jdbcTemplate.queryForList(
                "SELECT " +
                "i.id, " +
                "p.product_code, " +
                "p.name AS product_name, " +
                "w.warehouse_code, " +
                "w.name AS warehouse_name, " +
                "i.quantity " +
                "FROM inventory i " +
                "JOIN products p ON i.product_id = p.id " +
                "JOIN warehouses w ON i.warehouse_id = w.id " +
                "WHERE i.quantity <= 50"
        );
    }
}