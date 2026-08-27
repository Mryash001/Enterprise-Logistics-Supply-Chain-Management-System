package com.logistics.management.service;

import com.logistics.management.entity.Warehouse;
import com.logistics.management.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WarehouseService {

    private final WarehouseRepository warehouseRepository;

    public WarehouseService(WarehouseRepository warehouseRepository) {
        this.warehouseRepository = warehouseRepository;
    }

    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    public Warehouse getWarehouseById(Long id) {
        return warehouseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));
    }

    public Warehouse createWarehouse(Warehouse warehouse) {
        return warehouseRepository.save(warehouse);
    }

    public Warehouse updateWarehouse(Long id, Warehouse warehouse) {
        Warehouse existing = getWarehouseById(id);

        existing.setWarehouseCode(warehouse.getWarehouseCode());
        existing.setName(warehouse.getName());
        existing.setLocation(warehouse.getLocation());
        existing.setManagerName(warehouse.getManagerName());

        return warehouseRepository.save(existing);
    }

    public void deleteWarehouse(Long id) {
        warehouseRepository.deleteById(id);
    }
}