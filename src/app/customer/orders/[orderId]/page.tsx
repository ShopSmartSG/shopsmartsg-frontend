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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                setLoading(true);
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
                setError("Failed to load order details. Please try again later.");
            } finally {
                // Even if there's an error, we're no longer loading
                setLoading(false);
            }
        };

        if (params?.orderId) {
            getOrderDetails();
        } else {
            setLoading(false);
            setError("No order ID provided");
        }
    }, [params?.orderId]);

    // Second useEffect to fetch all product details at once using array of productIds
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

    if (loading) {
        return <p>Loading order details...</p>;
    }

    if (error) {
        return <Message severity="error" text={error} />;
    }

    if (!orderDetails) {
        return <Message severity="warn" text="No order details found" />;
    }

    return (
        <div>
            <Card title={`Order ID: ${orderDetails?.orderId || 'Unknown'}`} footer={footer}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                    }}
                >
                    <div className="flex-1">
                        {(orderDetails?.orderItems || []).map((item) => (
                            <div
                                key={item.productId}
                                className="mb-4 p-4 border rounded-lg flex gap-4 items-start"
                            >
                                <Image
                                    src={
                                        productDetails[item.productId]?.imageUrl ||
                                        "https://via.placeholder.com/150"
                                    }
                                    alt={productDetails[item.productId]?.productName || "Product Image"}
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
                                        Product ID: {item?.productId}
                                    </p>
                                    <p className="text-gray-600 mb-1">
                                        Quantity: {item?.quantity}
                                    </p>
                                    <p className="text-gray-800 font-medium">
                                        Price: ${item?.price}
                                    </p>
                                    {productDetails[item?.productId]?.productDescription && (
                                        <p className="text-gray-600 mt-2">
                                            {productDetails[item?.productId]?.productDescription}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="ml-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
                        <p className="mb-2">
                            Status: <span className="font-medium">{orderDetails.status || 'Unknown'}</span>
                        </p>
                        <p className="mb-2">
                            Total Price:{" "}
                            <span className="font-medium">${orderDetails.totalPrice || '0.00'}</span>
                        </p>
                        <p className="mb-2">
                            Date:{" "}
                            <span className="font-medium">
                {orderDetails.createdDate
                    ? new Date(orderDetails.createdDate).toLocaleDateString()
                    : 'Unknown'}
              </span>
                        </p>
                        <p className="mb-2">
                            Merchant ID:{" "}
                            <span className="font-medium">{orderDetails.merchantId || 'Unknown'}</span>
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default Order;