package com.logistics.management.service;

import com.logistics.management.entity.Inventory;
import com.logistics.management.entity.Order;
import com.logistics.management.entity.Product;
import com.logistics.management.entity.Warehouse;
import com.logistics.management.repository.InventoryRepository;
import com.logistics.management.repository.OrderRepository;
import com.logistics.management.repository.ProductRepository;
import com.logistics.management.repository.WarehouseRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final InventoryRepository inventoryRepository;

    public OrderService(
            OrderRepository orderRepository,
            ProductRepository productRepository,
            WarehouseRepository warehouseRepository,
            InventoryRepository inventoryRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.warehouseRepository = warehouseRepository;
        this.inventoryRepository = inventoryRepository;
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Order getOrderById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }

    public Order createOrder(
            String orderNumber,
            Long productId,
            Long warehouseId,
            Integer quantity) {

        if (quantity == null || quantity <= 0) {
            throw new RuntimeException("Quantity must be greater than zero");
        }

        if (orderRepository.findByOrderNumber(orderNumber).isPresent()) {
            throw new RuntimeException("Order number already exists");
        }

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Warehouse warehouse = warehouseRepository.findById(warehouseId)
                .orElseThrow(() -> new RuntimeException("Warehouse not found"));

        Inventory inventory = inventoryRepository
                .findByProductIdAndWarehouseId(productId, warehouseId)
                .orElseThrow(() -> new RuntimeException("Inventory not found"));

        if (inventory.getQuantity() < quantity) {
            throw new RuntimeException("Insufficient inventory");
        }

        inventory.setQuantity(inventory.getQuantity() - quantity);
        inventoryRepository.save(inventory);

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setProduct(product);
        order.setWarehouse(warehouse);
        order.setQuantity(quantity);
        order.setStatus("CREATED");

        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, String status) {
        Order order = getOrderById(id);

        String currentStatus = order.getStatus();

        boolean validTransition =
                (currentStatus.equals("CREATED") && status.equals("DISPATCHED")) ||
                (currentStatus.equals("DISPATCHED") && status.equals("IN_TRANSIT")) ||
                (currentStatus.equals("IN_TRANSIT") && status.equals("DELIVERED"));

        if (!validTransition) {
            throw new RuntimeException(
                    "Invalid status transition from "
                            + currentStatus
                            + " to "
                            + status
            );
        }

        order.setStatus(status);

        return orderRepository.save(order);
    }
    public void deleteOrder(Long id) {
        Order order = getOrderById(id);
        orderRepository.delete(order);
    }
}