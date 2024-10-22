"use client";
import React from 'react';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
        

const orders = [
    { id: '123', status: 'Order Placed', time: '10:00 AM', date: '2023-10-01', customerName: 'Ali' },
    { id: '124', status: 'Order Picked Up', time: '11:00 AM', date: '2023-10-02', customerName: 'Ali' },
    { id: '125', status: 'Order Ready for Pick Up', time: '12:00 PM', date: '2023-10-03', customerName: 'Ali' },
    // Add more orders as needed
  ];

const Orders = () => {
const ongoingOrders = orders.filter(order => order.status === 'Order Ready for Pick Up' || order.status === 'Order Placed');
const pastOrders = orders.filter(order => order.status === 'Order Picked Up');

const renderButtons = (status) => {
  switch (status) {
    case 'Order Placed':
      return (
        <div className="flex flex-column align-items-end">
          <Button label="Cancel Order" className="p-button-danger m-3" />
          <Button label="Order Ready" className="p-button-success m-3" />
        </div>
      );
    case 'Order Ready for Pick Up':
      return <Button label="Order Picked Up" className="p-button-info" />;
    default:
      return null;
  }
};
  

return (
<div>
  <h2>Ongoing Orders</h2>
  <div className="p-grid">
    {ongoingOrders.map((order) => (
      <div key={order.id} className="col-12 md-4">
        <Card title={`Order ID: ${order.id}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p>Status: {order.status}</p>
              <p>Time: {order.time}</p>
              <p>Date: {order.date}</p>
              <p>Customer: {order.customerName}</p>
              <Link href={`/merchant/orders/${order.id}`}>
                View Order Details
              </Link>
            </div>
            {renderButtons(order.status)}
          </div>
        </Card>
      </div>
    ))}
  </div>

  <h2>Past Orders</h2>
  <div className="p-grid">
    {pastOrders.map((order) => (
      <div key={order.id} className="col-12 md-4">
        <Card title={`Order ID: ${order.id}`}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p>Status: {order.status}</p>
              <p>Time: {order.time}</p>
              <p>Date: {order.date}</p>
              <p>Customer: {order.customerName}</p>
              <Link href={`/merachant/orders/${order.id}`}>
                View Order Details
              </Link>
            </div>
            {renderButtons(order.status)}
          </div>
        </Card>
      </div>
    ))}
  </div>
</div>
  );
};


export default Orders;