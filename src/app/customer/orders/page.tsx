"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
import Link from 'next/link';
import { Card } from 'primereact/card';
import { Image } from 'primereact/image';
import { Steps } from 'primereact/steps';
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";


const orders = [
  { id: '123', status: 'Order Placed', time: '10:00 AM', date: '2023-10-01', Merchant: 'Ali' },
  { id: '124', status: 'Order Picked Up', time: '11:00 AM', date: '2023-10-02', Merchant: 'Ali' },
  { id: '125', status: 'Order Ready for Pick Up', time: '12:00 PM', date: '2023-10-03', Merchant: 'Ali' },
];

const getActiveIndex = (status) => {
  switch (status) {
    case 'Order Placed': return 0;
    case 'Order Ready for Pick Up': return 1;
    case 'Order Picked Up': return 2;
    default: return 0;
  }
};

const OrderCard = ({ order }) => {
  const activeIndex = getActiveIndex(order.status);
  const itemRenderer = (item, itemIndex) => {
    const isActiveItem = activeIndex === itemIndex;
    const backgroundColor = isActiveItem ? 'var(--primary-color)' : 'var(--surface-b)';
    const textColor = isActiveItem ? 'var(--surface-b)' : 'var(--text-color-secondary)';

    return (
        <div className="flex flex-column align-items-center" style={{ marginTop: '20px' }}>
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
const orderSteps = [
    { label: 'Order Placed', icon: 'pi pi-shopping-cart', template: (item) => itemRenderer(item, 0) },
    { label: 'Order Ready for Pick Up', icon: 'pi pi-box', template: (item) => itemRenderer(item, 1) },
    { label: 'Order Picked Up', icon: 'pi pi-check', template: (item) => itemRenderer(item, 2) }
  ];

  return (
    <Card title={`Order ID: ${order.id}`} className="mb-3">
      <div className="flex flex-column md:flex-row justify-content-between align-items-center">
        <div className="flex-grow-1 mr-3 w-full" style={{ marginTop: "-50px" }}>
          <Steps
            model={orderSteps}
            activeIndex={activeIndex}
            readOnly={true}
            className="m-2 pt-4"
          />
          <p className="mt-3 mb-2">Time: {order.time}</p>
          <p className="mb-2">Date: {order.date}</p>
          <p className="mb-2">Merchant: {order.Merchant}</p>
          <Link
            href={`/customer/orders/${order.id}`}
            className="p-button p-button-text"
          >
            View Order Details
          </Link>
          <Tooltip
            target=".navigate-tooltip"
            content="Click to navigate."
            position="bottom"
          ></Tooltip>
          <div className="flex ">
            <div className="mr-2 mt-2 navigate-tooltip ">
              <i className="pi pi-arrow-circle-right block mt-2 navigate-tooltip cursor-pointer"></i>
            </div>
            <div>
              <Message severity="info" text="Click To Navigate." />
            </div>
          </div>
        </div>
        <Image
          src="https://via.placeholder.com/150"
          alt="Order Image"
          width="150"
          className="mt-3 md:mt-0"
        />
      </div>
    </Card>
  );
};

const Orders = () => {
  const ongoingOrders = orders.filter(order => order.status !== 'Order Picked Up');
  const pastOrders = orders.filter(order => order.status === 'Order Picked Up');

  return (
    <div className="p-4">
      <h2 className="mb-3">Ongoing Orders</h2>
      <div className="grid">
        {ongoingOrders.map((order) => (
          <div key={order.id} className="col-12 md:col-6 lg:col-4">
            <OrderCard order={order} />
          </div>
        ))}
      </div>

      <h2 className="mb-3 mt-5">Past Orders</h2>
      <div className="grid">
        {pastOrders.map((order) => (
          <div key={order.id} className="col-12 md:col-6 lg:col-4">
            <OrderCard order={order} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;