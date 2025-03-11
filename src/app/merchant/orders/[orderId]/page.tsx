"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React, {useEffect, useRef, useState} from "react";
import { Card } from "primereact/card";
import { Image } from "primereact/image";
import { Message } from "primereact/message";
import axios from "axios";
import {useRouter} from "next/navigation";

const Order = ({ params }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [productDetails, setProductDetails] = useState({});
  const [isValidSession, setValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const router = useRouter();
  const toast = useRef(null);
  const handleDirections = () => {
    window.open(
      `https://www.google.com/maps?q=@${1.2834},${103.8607}`,
      "_blank",
      "noopener,noreferrer"
    );
  };


  // First useEffect to fetch order details
  useEffect(() => {
    const getOrderDetails = async () => {
      try {
        const response = await axios.get(

          `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getOrderById/${params.orderId}`,
          { withCredentials: true }
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
    const validator = async () => {
      try {
        const response = await axios.get(`https://central-hub.shopsmartsg.com/auth/validate-token`, {
          withCredentials: true
        });
        const data = response.data;
        console.log('API Response:', data); // Debug the response
        if (data.status && data.status.toLowerCase() !== 'failure') {
          setValidSession(true);
        } else {
          setValidSession(false);
          toast.current.show({ severity: "error", detail: "You are logged out!! Please Login Again", summary: 'Error' });
        }
      } catch (error) {
        console.error('Validation Error:', error); // Log the error
        setValidSession(false);
      } finally {
        setIsLoading(false);
      }
    };
    validator();
  }, []);
  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!orderDetails || !orderDetails.orderItems || orderDetails.orderItems.length === 0) {
        return;
      }

      try {
        // Extract all product IDs from order items
        const productIds = Array.from(new Set(orderDetails.orderItems.map(item => item.productId)));
        const queryParam = productIds.join(',');

        // Make a single API call with all product IDs
        const response = await axios.get(
            `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getProducts?productIds=${queryParam}`,
            {
              params: { productIds: productIds.join(',') },
              withCredentials: true
            }
        );

        if (response.status === 200) {
          console.log("Products details received:", response.data);

          // Convert array of products to an object with productId as keys
          const productsMap = {};
          response.data.forEach(product => {
            productsMap[product.productId] = product;
          });

          setProductDetails(productsMap);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        // We don't set loading to false here as it might interfere with the order loading state
      }
    };

    fetchProductDetails();
  }, [orderDetails]);

  if (!orderDetails) {
    return <p>Loading order details...</p>;
  }
  if(isLoading){
    return <div>Loading...</div>;
  }
  if(isValidSession){
    return (
        <div>
          <Card title={`Order ID: ${orderDetails.orderId}`} >
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

              </div>
            </div>
          </Card>
        </div>
    );
  }
  else{
    router.push('/merchant/login');
    return null;
  }
};

export default Order;
