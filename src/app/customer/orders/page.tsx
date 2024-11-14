"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Steps } from "primereact/steps";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
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

const getActiveIndexForDelivery = (status) => {
  switch (status) {
    case "CREATED":
      return 0;
    case "READY":
      return 1;
    case "COMPLETED":
      return 3;
    
    
    case "CANCELLED":
      return 4;
    case "DELIVERY_ACCEPTED":
      return 1;
    case "DELIVERY_PICKED_UP":
      return 2;
    
    default:
      return 0;
  }
};

const userId = localStorage.getItem("userId");
const userType = localStorage.getItem("userType");

const OrderCard = ({ order, isDelivery }) => {
  const [merchantDetails, setMerchantDetails] = useState(null);

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getMerchant/${order.merchantId}`
        );
        if (response.status === 200) {
          setMerchantDetails(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMerchantDetails();
  }, [order.merchantId]);

  const activeIndex = isDelivery
    ? getActiveIndexForDelivery(order.status)
    : getActiveIndex(order.status);
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

  const pickupOrderSteps = [
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

  const deliveryOrderSteps = [
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
      label: "Order Delivered",
      icon: "pi pi-check-circle",
      template: (item) => itemRenderer(item, 3),
    },
    {
      label: "Order Cancelled",
      icon: "pi pi-times",
      template: (item) => itemRenderer(item, 4),
    },
  ];

  const handleDirections = (lat, long) => {
    window.open(
      `https://www.google.com/maps?q=@${lat},${long}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <Card title={`Order ID: ${order.orderId}`} className="mb-3">
      <div className="flex flex-column md:flex-row justify-content-between align-items-center">
        <div className="flex-grow-1 mr-3 w-full" style={{ marginTop: "-50px" }}>
          <Steps
            model={isDelivery ? deliveryOrderSteps : pickupOrderSteps}
            activeIndex={activeIndex}
            readOnly={true}
            className="m-2 pt-4"
          />
          <p className="mt-3 mb-2">Total Price: ${order.totalPrice}</p>
          <p className="mb-2">
            Date: {new Date(order.createdDate).toLocaleDateString()}
          </p>
          <p className="mb-2">
            Merchant: {merchantDetails ? merchantDetails.name : "Loading..."}
          </p>
          <p className="mb-2">
            Delivery Type : {isDelivery ? "Partner Assisted" : "Self Pickup"}
          </p>
          <div>
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
          </div>
          {isDelivery ? (
            <div></div>
          ) : (
            <div className="flex ">
              <div
                className="mr-2 mt-2 navigate-tooltip "
                onClick={() =>
                  handleDirections(
                    merchantDetails?.latitude,
                    merchantDetails?.longitude
                  )
                }
              >
                <i className="pi pi-arrow-circle-right block mt-2 navigate-tooltip cursor-pointer"></i>
              </div>
              <div>
                <Message severity="info" text="Click To Navigate." />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getOrdersListForProfile/ALL/profiles/customer/id/${userId}`
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



 

  const ongoingPickupOrders = orders.filter(
    (order) =>
      (order.status !== "COMPLETED" &&
        order.status !== "CANCELLED" &&
        !order.useDelivery) ||
      order.status === "READY"
  );
  const ongoingDeliveryOrders = orders.filter(
    (order) =>
      order.useDelivery &&
      (order.status === "CREATED" ||
       
        
        order.status == "DELIVERY_ACCEPTED" ||
      order.status === "DELIVERY_PICKED_UP" 
     )
  );
  const pastPickupOrders = orders.filter(
    (order) =>
      (order.status === "COMPLETED" || order.status === "CANCELLED") &&
      !order.useDelivery
  );
  const pastDeliveryOrders = orders.filter(
    (order) => order.useDelivery && order.status === "COMPLETED"
  );

  if (userType && userType === "CUSTOMER" && userId) {
    return (
      <div className="p-4">
        <h2 className="mb-3">Ongoing  Orders</h2>
        <div className="grid">
          {ongoingPickupOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
              <OrderCard order={order} isDelivery={false} />
            </div>
          ))}
        </div>

        <h2 className="mb-3">Ongoing DELIVERY Orders</h2>
        <div className="grid">
          {ongoingDeliveryOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
              <OrderCard order={order} isDelivery={true} />
            </div>
          ))}
        </div>

        <h2 className="mb-3 mt-5">Past Orders</h2>
        <div className="grid">
          {pastPickupOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
              <OrderCard order={order} isDelivery={false} />
            </div>
          ))}
        </div>
        <h2 className="mb-3 mt-5">Past Delivery Orders</h2>
        <div className="grid">
          {pastDeliveryOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
              <OrderCard order={order} isDelivery={true} />
            </div>
          ))}
        </div>
      </div>
    );
  } else {
    router.push("/customer/login");
  }
};

export default Orders;
