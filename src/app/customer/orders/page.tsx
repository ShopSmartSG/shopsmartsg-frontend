"use client";
import React from 'react';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
        

const orders = [
    { id: '123', status: 'Order Placed', time: '10:00 AM', date: '2023-10-01' },
    { id: '124', status: 'Order Picked Up', time: '11:00 AM', date: '2023-10-02' },
    { id: '125', status: 'Order Ready for Pick Up', time: '12:00 PM', date: '2023-10-03' },
    // Add more orders as needed
  ];

const Orders = () => {
const ongoingOrders = orders.filter(order => order.status === 'Order Ready for Pick Up' || order.status === 'Order Placed');
const pastOrders = orders.filter(order => order.status === 'Order Picked Up');
  

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
              <Link href={`/customer/orders/${order.id}`}>
                View Order Details
              </Link>
            </div>
            <Image src="https://via.placeholder.com/150" alt="Order Image" style={{ marginLeft: '10px' }} />
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
              <Link href={`/customer/orders/${order.id}`}>
                View Order Details
              </Link>
            </div>
            <Image src="https://via.placeholder.com/150" alt="Order Image" style={{ marginLeft: '10px' }} />
          </div>
        </Card>
      </div>
    ))}
  </div>
</div>
  );
};


export default Orders;