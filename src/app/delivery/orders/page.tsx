"use client";
import React, { useEffect, useState } from "react";
// import Link from "next/link";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import axios from "axios";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders from both endpoints independently
        const [profileResponse, activeResponse] = await Promise.allSettled([
          axios.get(
            `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getOrdersListForProfile/ALL/profiles/deliveryPartner/id/${userId}`
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getActiveOrdersForDeliveries`
          ),
        ]);

        // Handle responses, using empty arrays for failed requests
        const profileOrders =
          profileResponse.status === "fulfilled"
            ? profileResponse.value.data
            : [];
        const activeOrders =
          activeResponse.status === "fulfilled"
            ? activeResponse.value.data
            : [];

        // Combine orders from both successful responses
        const allOrders = [...profileOrders, ...activeOrders];

        // Fetch additional details for each order
        const ordersWithDetails = await Promise.all(
          allOrders.map(async (order) => {
            try {
              // Fetch merchant and customer details independently
              const [merchantResponse, customerResponse] =
                await Promise.allSettled([
                  getMerchantDetails(order.merchantId),
                  getCustomerDetails(order.customerId),
                ]);

              // Use default values if detail fetching fails
              const merchantDetails =
                merchantResponse.status === "fulfilled"
                  ? merchantResponse.value
                  : { latitude: null, longitude: null };

              const customerDetails =
                customerResponse.status === "fulfilled"
                  ? customerResponse.value
                  : { latitude: null, longitude: null };

              return {
                ...order,
                merchantDetails,
                merchantLatitude: merchantDetails.latitude,
                merchantLongitude: merchantDetails.longitude,
                customerLatitude: customerDetails.latitude,
                customerLongitude: customerDetails.longitude,
                customerDetails,
              };
            } catch (error) {
              // If detail fetching fails, return order with default values
              console.error(
                `Error fetching details for order ${order.id}:`,
                error
              );
              return {
                ...order,
                merchantDetails: {},
                merchantLatitude: null,
                merchantLongitude: null,
                customerLatitude: null,
                customerLongitude: null,
                customerDetails: {},
              };
            }
          })
        );

        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Error in order fetching process:", error);
        // Even if there's an error, ensure orders state is at least an empty array
        setOrders([]);
      }
    };

    fetchOrders();
  }, [userId]); // Added userId to dependency array

  const handleDirections = (lat, long) => {
    window.open(
      `https://www.google.com/maps?q=@${lat},${long}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/updateOrderStatus/${orderId}/${status}`,
        {
          deliveryPartnerId: userId,
        }
      );

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
    (order) =>
      order.status === "READY" ||
      order.status === "DELIVERY_ACCEPTED" ||
      order.status === "DELIVERY_PICKED_UP"
  );
  const pastOrders = orders.filter((order) => order.status === "COMPLETED");

  const getMerchantDetails = async (merchantId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getMerchant/${merchantId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getCustomerDetails = async (customerId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getCustomer/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const renderButtons = (orderId, status) => {
    switch (status) {
      case "READY":
        return (
          <div className="flex flex-column align-items-end">
            <Button
              label="Accept Order"
              className="p-button-success m-3"
              onClick={() => updateOrderStatus(orderId, "DELIVERY_ACCEPTED")}
            />
          </div>
        );
      case "DELIVERY_ACCEPTED":
        return (
          <Button
            label="Order Picked Up"
            className="p-button-success m-3"
            onClick={() => updateOrderStatus(orderId, "DELIVERY_PICKED_UP")}
          />
        );
      case "DELIVERY_PICKED_UP":
        return (
          <Button
            label="Order Completed"
            className="p-button-success m-3"
            onClick={() => updateOrderStatus(orderId, "COMPLETED")}
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
      default:
        return null;
    }
  };

  const footer = (order) => (
    <div>
      <Tooltip
        target=".navigate-tooltip"
        content="Click to navigate to merchant."
        position="bottom"
      ></Tooltip>
      <div className="flex ">
        <div
          className="mr-2 mt-2 navigate-tooltip "
          onClick={() =>
            handleDirections(order?.merchantLatitude, order?.merchantLongitude)
          }
        >
          <i className="pi pi-arrow-circle-right block mt-2 navigate-tooltip cursor-pointer"></i>
        </div>
        <div>
          <Message severity="info" text="Click To Navigate Merchant." />
        </div>
      </div>
      <Tooltip
        target=".navigate-tooltip"
        content="Click to navigate to Customer."
        position="bottom"
      ></Tooltip>
      <div className="flex ">
        <div
          className="mr-2 mt-2 navigate-tooltip "
          onClick={() =>
            handleDirections(order?.customerLatitude, order?.customerLongitude)
          }
        >
          <i className="pi pi-arrow-circle-right block mt -2 navigate-tooltip cursor-pointer"></i>
        </div>
        <div>
          <Message severity="info" text="Click To Navigate Customer." />
        </div>
      </div>
    </div>
  );

  if (userType === "DELIVERY") {
    return (
      <div>
        <h2>Ongoing Orders</h2>
        <div className="p-grid">
          {ongoingOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-4">
              <Card title={`Order ID: ${order.orderId}`} footer={footer(order)}>
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
                    <p>Customer: {order.customerDetails?.name}</p>
                    <p>Merchant: {order.merchantDetails?.name}</p>
                  </div>
                  {renderButtons(order.orderId, order.status)}
                </div>
              </Card>
            </div>
          ))}
        </div>

        <h2>Past Orders</h2>
        <div className="p-grid">
          {pastOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-4">
              <Card title={`Order ID: ${order.orderId}`} footer={footer(order)}>
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
                    <p>Customer: {order.customerDetails?.name}</p>
                    <p>Merchant: {order.merchantDetails?.name}</p>
                  </div>
                  {renderButtons(order.orderId, order.status)}
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    return null;
  }
};

export default Orders;
