"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Message } from "primereact/message";
import axios from "axios";

const Order = ({ params }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [productDetails, setProductDetails] = useState({});

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

  // First useEffect to fetch order details
  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getOrderById/${params.orderId}`
        );

        if (response.status === 200) {
          console.log("Order details received:", response.data);
          setOrderDetails(response.data);
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };
    getOrderDetails();
  }, [params.orderId]);

  // Second useEffect to fetch product details once order details are available
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!orderDetails) return;

      try {
        const details = {};
        // Make sure we're accessing the correct path for orderItems
        const items = orderDetails.orderItems || [];

        console.log("Fetching details for items:", items);

        for (const item of items) {
          try {
            const response = await axios.get(
              `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getProduct/${orderDetails.merchantId}/products/${item.productId}`
            );

            if (response.status === 200) {
              console.log(
                `Product details received for ${item.productId}:`,
                response.data
              );
              details[item.productId] = response.data;
            }
          } catch (productError) {
            console.error(
              `Error fetching details for product ${item.productId}:`,
              productError
            );
          }
        }

        setProductDetails(details);
      } catch (error) {
        console.error("Error in fetchProductDetails:", error);
      }
    };

    fetchProductDetails();
  }, [orderDetails]);

  if (!orderDetails) {
    return <p>Loading order details...</p>;
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
          <div className="flex-1">
            {(orderDetails.orderItems || []).map((item) => (
              <div
                key={item.productId}
                className="mb-4 p-4 border rounded-lg flex gap-4 items-start"
              >
                <Image
                  src={
                    productDetails[item.productId]?.imageUrl ||
                    "https://via.placeholder.com/150"
                  }
                  alt={productDetails[item.productId]?.name || "Product Image"}
                  width="150"
                  height="150"
                  className="rounded-md"
                />
                <div>
                  <h3 className="text-xl font-semibold mb-2">
                    {productDetails[item.productId]?.productName ||
                      "Loading product name..."}
                  </h3>
                  <p className="text-gray-600 mb-1">
                    Product ID: {item.productId}
                  </p>
                  <p className="text-gray-600 mb-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-gray-800 font-medium">
                    Price: ${item.price}
                  </p>
                  {productDetails[item.productId]?.description && (
                    <p className="text-gray-600 mt-2">
                      {productDetails[item.productId].description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="ml-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <p className="mb-2">
              Status: <span className="font-medium">{orderDetails.status}</span>
            </p>
            <p className="mb-2">
              Total Price:{" "}
              <span className="font-medium">${orderDetails.totalPrice}</span>
            </p>
            <p className="mb-2">
              Date:{" "}
              <span className="font-medium">
                {new Date(orderDetails.createdDate).toLocaleDateString()}
              </span>
            </p>
            <p className="mb-2">
              Merchant ID:{" "}
              <span className="font-medium">{orderDetails.merchantId}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Order;
