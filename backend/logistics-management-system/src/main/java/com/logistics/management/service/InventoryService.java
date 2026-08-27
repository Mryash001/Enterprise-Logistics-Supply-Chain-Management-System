package com.logistics.management.service;

import com.logistics.management.entity.Inventory;
import com.logistics.management.entity.Product;
import com.logistics.management.entity.Warehouse;
import com.logistics.management.repository.InventoryRepository;
import com.logistics.management.repository.ProductRepository;
import com.logistics.management.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;

    public InventoryService(
            InventoryRepository inventoryRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository) {
        this.inventoryRepository = inventoryRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
    }

    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    public Inventory getInventoryById(Long id) {
        return inventoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));
    }

    public Inventory createInventory(Long productId, Long warehouseId, Integer quantity) {

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        if (inventoryRepository.findByProductIdAndWarehouseId(productId, warehouseId).isPresent()) {
            throw new RuntimeException("Inventory already exists for this product and warehouse");
        }

        Inventory inventory = new Inventory(product, warehouse, quantity);

        return inventoryRepository.save(inventory);
    }

    public Inventory updateInventory(Long id, Integer quantity) {
        Inventory existing = getInventoryById(id);

        existing.setQuantity(quantity);

        return inventoryRepository.save(existing);
    }

    public void deleteInventory(Long id) {
        inventoryRepository.deleteById(id);
    }
}