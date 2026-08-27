package com.logistics.management.service;

import com.logistics.management.entity.Order;
import com.logistics.management.entity.Shipment;
import com.logistics.management.repository.OrderRepository;
import com.logistics.management.repository.ShipmentRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ShipmentService {

    private final ShipmentRepository shipmentRepository;
    private final OrderRepository orderRepository;

    public ShipmentService(
            ShipmentRepository shipmentRepository,
            OrderRepository orderRepository) {
        this.shipmentRepository = shipmentRepository;
        this.orderRepository = orderRepository;
    }

    public List<Shipment> getAllShipments() {
        return shipmentRepository.findAll();
    }

    public Shipment getShipmentById(Long id) {
        return shipmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Shipment not found"));
    }

    public Shipment createShipment(
            String trackingNumber,
            Long orderId,
            String carrier) {

        if (trackingNumber == null || trackingNumber.trim().isEmpty()) {
            throw new RuntimeException("Tracking number is required");
        }

        if (carrier == null || carrier.trim().isEmpty()) {
            throw new RuntimeException("Carrier is required");
        }

        if (shipmentRepository.findByTrackingNumber(trackingNumber).isPresent()) {
            throw new RuntimeException("Tracking number already exists");
        }

        if (shipmentRepository.findByOrderId(orderId).isPresent()) {
            throw new RuntimeException("Shipment already exists for this order");
        }

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getStatus().equals("CREATED")) {
            throw new RuntimeException(
                    "Shipment can only be created for an order with CREATED status"
            );
        }

        Shipment shipment = new Shipment();

        shipment.setTrackingNumber(trackingNumber);
        shipment.setOrder(order);
        shipment.setCarrier(carrier);
        shipment.setStatus("PREPARING");
        shipment.setEstimatedDeliveryDate(
                LocalDate.now().plusDays(5)
        );

        return shipmentRepository.save(shipment);
    }

    public Shipment updateShipmentStatus(Long id, String status) {

        Shipment shipment = getShipmentById(id);

        String currentStatus = shipment.getStatus();

        boolean validTransition =
                (currentStatus.equals("PREPARING") && status.equals("SHIPPED")) ||
                (currentStatus.equals("SHIPPED") && status.equals("IN_TRANSIT")) ||
                (currentStatus.equals("IN_TRANSIT") && status.equals("DELIVERED"));

        if (!validTransition) {
            throw new RuntimeException(
                    "Invalid shipment status transition from "
                            + currentStatus
                            + " to "
                            + status
            );
        }

        shipment.setStatus(status);

        if (status.equals("DELIVERED")) {

            shipment.setActualDeliveryDate(LocalDate.now());

            Order order = shipment.getOrder();

            if (!order.getStatus().equals("CREATED")) {
                throw new RuntimeException(
                        "Order cannot be marked DELIVERED from status "
                                + order.getStatus()
                );
            }

            order.setStatus("DISPATCHED");
            order.setStatus("IN_TRANSIT");
            order.setStatus("DELIVERED");

            orderRepository.save(order);
        }

        return shipmentRepository.save(shipment);
    }

    public Shipment getShipmentByTrackingNumber(String trackingNumber) {
        return shipmentRepository.findByTrackingNumber(trackingNumber)
                .orElseThrow(() -> new RuntimeException("Tracking number not found"));
    }

    public void deleteShipment(Long id) {
        Shipment shipment = getShipmentById(id);
        shipmentRepository.delete(shipment);
    }
}