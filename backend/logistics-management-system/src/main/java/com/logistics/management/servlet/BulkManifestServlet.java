package com.logistics.management.servlet;

import jakarta.servlet.ServletException;
import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.context.support.WebApplicationContextUtils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Map;

@MultipartConfig
public class BulkManifestServlet extends HttpServlet {

    private JdbcTemplate jdbcTemplate;

    @Override
    public void init() throws ServletException {
        WebApplicationContext context =
                WebApplicationContextUtils.getWebApplicationContext(
                        getServletContext()
                );

        jdbcTemplate = context.getBean(JdbcTemplate.class);
    }

    @Override
    protected void doPost(
            HttpServletRequest request,
            HttpServletResponse response)
            throws ServletException, IOException {

        Part filePart = request.getPart("file");

        if (filePart == null || filePart.getSize() == 0) {
            response.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            response.setContentType("text/plain");
            response.getWriter().write("CSV file is required");
            return;
        }

        int processedRecords = 0;
        int insertedRecords = 0;
        int updatedRecords = 0;
        int skippedRecords = 0;

        try (BufferedReader reader = new BufferedReader(
                new InputStreamReader(
                        filePart.getInputStream(),
                        StandardCharsets.UTF_8))) {

            String line;
            boolean header = true;

            while ((line = reader.readLine()) != null) {

                if (header) {
                    header = false;
                    continue;
                }

                if (line.trim().isEmpty()) {
                    continue;
                }

                String[] data = line.split(",");

                if (data.length != 3) {
                    skippedRecords++;
                    continue;
                }

                String productCode = data[0].trim();
                String warehouseCode = data[1].trim();
                int quantity;

                try {
                    quantity = Integer.parseInt(data[2].trim());
                } catch (NumberFormatException e) {
                    skippedRecords++;
                    continue;
                }

                if (quantity < 0) {
                    skippedRecords++;
                    continue;
                }

                List<Map<String, Object>> products = jdbcTemplate.queryForList(
                        "SELECT id FROM products WHERE product_code = ?",
                        productCode
                );

                if (products.isEmpty()) {
                    skippedRecords++;
                    continue;
                }

                Long productId =
                        ((Number) products.get(0).get("id")).longValue();

                List<Map<String, Object>> warehouses = jdbcTemplate.queryForList(
                        "SELECT id FROM warehouses WHERE warehouse_code = ?",
                        warehouseCode
                );

                if (warehouses.isEmpty()) {
                    skippedRecords++;
                    continue;
                }

                Long warehouseId =
                        ((Number) warehouses.get(0).get("id")).longValue();

                List<Map<String, Object>> inventory = jdbcTemplate.queryForList(
                        "SELECT id FROM inventory WHERE product_id = ? AND warehouse_id = ?",
                        productId,
                        warehouseId
                );

                if (inventory.isEmpty()) {

                    jdbcTemplate.update(
                            "INSERT INTO inventory (product_id, warehouse_id, quantity) VALUES (?, ?, ?)",
                            productId,
                            warehouseId,
                            quantity
                    );

                    insertedRecords++;

                } else {

                    jdbcTemplate.update(
                            "UPDATE inventory SET quantity = ? WHERE product_id = ? AND warehouse_id = ?",
                            quantity,
                            productId,
                            warehouseId
                    );

                    updatedRecords++;
                }

                processedRecords++;
            }
        }

        response.setContentType("application/json");

        response.getWriter().write(
                "{"
                        + "\"message\":\"Manifest processed successfully\","
                        + "\"processedRecords\":" + processedRecords + ","
                        + "\"insertedRecords\":" + insertedRecords + ","
                        + "\"updatedRecords\":" + updatedRecords + ","
                        + "\"skippedRecords\":" + skippedRecords
                        + "}"
        );
    }
}