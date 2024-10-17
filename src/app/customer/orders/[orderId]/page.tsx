"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from 'react';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';

import { Message } from "primereact/message";

const Order = ({ params }) => {

  const handleDirections = () =>{
    window.open(
      `https://www.google.com/maps?q=@${1.2834},${103.8607}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
  const orderDetails = {
    status: 'Order Placed',
    time: '10:00 AM',
    date: '2023-10-01',
    Merchant: 'Ali',
    products: [
      { id: 'P12345', name: 'Sample Product 1', quantity: '2' },
      { id: 'P12346', name: 'Sample Product 2', quantity: '1' },
      // Add more products as needed
    ],
  };

  const footer = () => {
    return (
      <div className="w-100 text-right">
        <Message
          severity="info"
          text='Click the icon to navigate to the Merchant.'
        />
        <i
          className="pi pi-directions directions mt-3 ml-2 cursor-pointer text-xl"
          onClick={handleDirections}
        ></i>
      </div>
    );
  }

  return (
    <div>
      <Card title={`Order ID: ${params.orderId}`} footer = {footer}>
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
            <p>Merchant: {orderDetails.Merchant}</p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Order;