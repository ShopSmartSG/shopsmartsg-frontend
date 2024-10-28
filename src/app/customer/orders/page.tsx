"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Steps } from "primereact/steps";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import axios from "axios";

const getActiveIndex = (status) => {
  switch (status) {
    case "CREATED":
      return 0;
    case "READY":
      return 1;
    case "COMPLETED":
      return 2;
    case "CANCELLED":
      return 3;
    default:
      return 0;
  }
};

const OrderCard = ({ order }) => {
  const activeIndex = getActiveIndex(order.status);
  console.log(activeIndex,'activeIndex');
  const itemRenderer = (item, itemIndex) => {
    const isActiveItem = activeIndex === itemIndex;
    const backgroundColor = isActiveItem
      ? "var(--primary-color)"
      : "var(--surface-b)";
    const textColor = isActiveItem
      ? "var(--surface-b)"
      : "var(--text-color-secondary)";

    return (
      <div
        className="flex flex-column align-items-center"
        style={{ marginTop: "20px" }}
      >
        <span
          className="inline-flex align-items-center justify-content-center border-circle border-primary border-1 h-3rem w-3rem z-1 cursor-pointer"
          style={{ backgroundColor: backgroundColor, color: textColor }}
        >
          <i className={`${item.icon} text-xl`} />
        </span>
        <span className="mt-2 text-center">{item.label}</span>
      </div>
    );
  };
  const orderSteps = [
    {
      label: "Order Placed",
      icon: "pi pi-shopping-cart",
      template: (item) => itemRenderer(item, 0),
    },
    {
      label: "Ready",
      icon: "pi pi-box",
      template: (item) => itemRenderer(item, 1),
    },
    {
      label: "Order Picked Up",
      icon: "pi pi-check",
      template: (item) => itemRenderer(item, 2),
    },
    {
      label: "Order Cancelled",
      icon: "pi pi-times",
      template: (item) => itemRenderer(item, 3),
    },
  ];

  return (
    <Card title={`Order ID: ${order.orderId}`} className="mb-3">
      <div className="flex flex-column md:flex-row justify-content-between align-items-center">
        <div className="flex-grow-1 mr-3 w-full" style={{ marginTop: "-50px" }}>
          <Steps
            model={orderSteps}
            activeIndex={activeIndex}
            readOnly={true}
            className="m-2 pt-4"
          />
          <p className="mt-3 mb-2">Total Price: ${order.totalPrice}</p>
          <p className="mb-2">
            Date: {new Date(order.createdDate).toLocaleDateString()}
          </p>
          <p className="mb-2">Merchant: {order.merchantId}</p>
          <Link
            href={`/customer/orders/${order.orderId}`}
            className="p-button p-button-text"
          >
            View Order Details
          </Link>
          <Tooltip
            target=".navigate-tooltip"
            content="Click to navigate."
            position="bottom"
          ></Tooltip>
          <div className="flex ">
            <div className="mr-2 mt-2 navigate-tooltip ">
              <i className="pi pi-arrow-circle-right block mt-2 navigate-tooltip cursor-pointer"></i>
            </div>
            <div>
              <Message severity="info" text="Click To Navigate." />
            </div>
          </div>
        </div>
        
      </div>
    </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getAllOrdersCustomer/4c699c23-81bf-4a25-9dee-7fb7c37f7f60`
        );
        if (response.status === 200) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  const ongoingOrders = orders.filter(
    (order) => order.status !== "COMPLETED" && order.status !== "CANCELLED" || order.status === 'READY'
  );
  const pastOrders = orders.filter(
    (order) => order.status === "COMPLETED" || order.status === "CANCELLED"
  );

  return (
    <div className="p-4">
      <h2 className="mb-3">Ongoing Orders</h2>
      <div className="grid">
        {ongoingOrders.map((order) => (
          <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
            <OrderCard order={order} />
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-5">Past Orders</h2>
      <div className="grid">
        {pastOrders.map((order) => (
          <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
            <OrderCard order={order} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
