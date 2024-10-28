"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Message } from "primereact/message";
import axios from "axios";

const Order = ({ params }) => {
  const [orderDetails, setOrderDetails] = useState(null);

  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps?q=@${1.2834},${103.8607}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const footer = () => {
    return (
      <div className="w-100 text-right">
        <Message
          severity="info"
          text="Click the icon to navigate to the Merchant."
        />
        <i
          className="pi pi-directions directions mt-3 ml-2 cursor-pointer text-xl"
          onClick={handleDirections}
        ></i>
      </div>
    );
  };

  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getOrderById/${params.orderId}`
        );
        if (response.status === 200) {
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.log(error, "Error");
      }
    };
    getOrderDetails();
  }, [params.orderId]);

  if (!orderDetails) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Card title={`Order ID: ${orderDetails.orderId}`} footer={footer}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            {orderDetails.orderItems.map((product) => (
              <div key={product.productId} style={{ marginBottom: "10px" }}>
                <p>Product ID: {product.productId}</p>
                <Image
                  src="https://via.placeholder.com/150"
                  alt="Product Image"
                  style={{ marginRight: "10px" }}
                />
                <p>Quantity: {product.quantity}</p>
                <p>Price: ${product.price}</p>
              </div>
            ))}
          </div>
          <div>
            <p>Status: {orderDetails.status}</p>
            <p>Total Price: ${orderDetails.totalPrice}</p>
            <p>
              Date: {new Date(orderDetails.createdDate).toLocaleDateString()}
            </p>
            <p>Merchant: {orderDetails.merchantId}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Order;
