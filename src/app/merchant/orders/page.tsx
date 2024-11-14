"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import axios from "axios";
import { useRouter } from "next/navigation";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch Merchant Order Requests
  useEffect(() => {
    const fetchMerchantOrderRequests = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getOrdersListForProfile/ALL/profiles/merchant/id/${userId}`
        );
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching merchant order requests:", error);
      }
    };
    fetchMerchantOrderRequests();
  }, []);
  const userType = localStorage.getItem("userType");
  const userId = localStorage.getItem("userId");
  const router = useRouter();
  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/updateOrderStatus/${orderId}/${status}`,
        {
          k: "",
        }
      );
      // Update the local state to reflect the status change
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const ongoingOrders = orders.filter(
    (order) => order.status === "CREATED" || order.status === "READY" || order.status == "DELIVERY_ACCEPTED"
  );
  const pastOrders = orders.filter(
    (order) => order.status === "COMPLETED" || order.status === "CANCELLED" || order.status === "DELIVERY_PICKED_UP"
  );

  const renderButtons = (orderId, status,delivery) => {
    switch (status) {
      case "CREATED":
        return (
          <div className="flex flex-column align-items-end">
            <Button
              label="Cancel Order"
              className="p-button-danger m-3"
              onClick={() => updateOrderStatus(orderId, "CANCELLED")}
            />
            <Button
              label="Order Ready"
              className="p-button-success m-3"
              onClick={() => updateOrderStatus(orderId, "READY")}
            />
          </div>
        );
      case "READY":
        return (
          <Button
            label="Order Picked Up"
            className="p-button-info"
            onClick={() => updateOrderStatus(orderId, "COMPLETED")}
            disabled = {delivery}
          />
        );
      case "COMPLETED":
        return (
          <Button
            label="Order Completed"
            className="p-button-secondary"
            disabled
          />
        );
      case "CANCELLED":
        return (
          <Button
            label="Order Cancelled"
            className="p-button-secondary"
          disabled
          />
        );
      default:
        return null;
    }
  };

  if (userType === "MERCHANT" && (userId != null || userId != "")) {
    return (
      <div>
        <h2>Ongoing Orders</h2>
        <div className="p-grid">
          {ongoingOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-4">
              <Card title={`Order ID: ${order.orderId}`}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p>Status: {order.status}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>
                      Date: {new Date(order.createdDate).toLocaleDateString()}
                    </p>
                    <p>Customer: {order.customerId}</p>
                    <Link href={`/merchant/orders/${order.orderId}`}>
                      View Order Details
                    </Link>
                    <p>
                      Delivery :{" "}
                      {order.useDelivery ? "Partner Assisted" : "Self - Pickup"}{" "}
                    </p>
                  </div>
                  {renderButtons(
                    order.orderId,
                    order.status,
                    order.useDelivery
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>

        <h2>Past Orders</h2>
        <div className="p-grid">
          {pastOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-4">
              <Card title={`Order ID: ${order.orderId}`}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p>Status: {order.status}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>
                      Date: {new Date(order.createdDate).toLocaleDateString()}
                    </p>
                    <p>Customer: {order.customerId}</p>
                    <Link href={`/merchant/orders/${order.orderId}`}>
                      View Order Details
                    </Link>
                  </div>
                  {renderButtons(
                    order.orderId,
                    order.status,
                    order.useDelivery
                  )}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    router.push("/merchant/login");
  }
};

export default Orders;
