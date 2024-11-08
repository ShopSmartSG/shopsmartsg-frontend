"use client";
import React from 'react';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';

const Order = ({ params }) => {
  const orderDetails = {
    status: 'Order Placed',
    time: '10:00 AM',
    date: '2023-10-01',
    customerName: 'Ali',
    products: [
      { id: 'P12345', name: 'Sample Product 1', quantity: '2' },
      { id: 'P12346', name: 'Sample Product 2', quantity: '1' },
      
    ],
  };

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