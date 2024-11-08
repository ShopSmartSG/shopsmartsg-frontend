"use client";
import React, { useEffect } from 'react';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import axios from 'axios';

const Order = ({ params }) => {
  const orderDetails = {
    status: 'Order Placed',
    time: '10:00 AM',
    date: '2023-10-01',
    customerName: 'Ali',
    products: [
      { id: 'P12345', name: 'Sample Product 1', quantity: '2' },
      { id: 'P12346', name: 'Sample Product 2', quantity: '1' },
      // Add more products as needed
    ],
  };
  useEffect(() => {
    const getOrderDetails = async () => {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getOrderById/${params.orderId}`
      );
      console.log(response.data);
    }
    getOrderDetails();
  },[])
  return (
    <div>
      <Card title={`Order ID: ${params.orderId}`}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            {orderDetails.products.map((product) => (
              <div key={product.id} style={{ marginBottom: '10px' }}>
                <p>Product ID: {product.id}</p>
                <Image src="https://via.placeholder.com/150" alt="Product Image" style={{ marginRight: '10px' }} />
                <p>{product.name}</p>
                <p>Quantity: {product.quantity}</p>
              </div>
            ))}
          </div>
          <div>
            <p>Status: {orderDetails.status}</p>
            <p>Time: {orderDetails.time}</p>
            <p>Date: {orderDetails.date}</p>
            <p>Customer: {orderDetails.customerName}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Order;