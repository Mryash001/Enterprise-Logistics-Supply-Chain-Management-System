package com.logistics.management.service;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public class InventoryAlertService {

    private final JdbcTemplate jdbcTemplate;

    public InventoryAlertService(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Scheduled(fixedRate = 60000)
    public void checkLowStock() {

        List<Map<String, Object>> alerts = jdbcTemplate.queryForList(
                "SELECT " +
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

        for (Map<String, Object> alert : alerts) {
            System.out.println(
                    "LOW STOCK ALERT: Product " +
                    alert.get("product_code") +
                    " at Warehouse " +
                    alert.get("warehouse_code") +
                    " has quantity " +
                    alert.get("quantity")
            );
        }
    }
}