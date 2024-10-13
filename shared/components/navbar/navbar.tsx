"use client";
import React, { useState } from "react";
import { Menubar } from "primereact/menubar";

import { MenuItem } from "primereact/menuitem";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import "./navbar.css";
import Link from "next/link";
import HeadlessDemo from "../sidebar/sidebar";
import { Button } from "primereact/button";
import data from "../../assets/dummyData/cart";

import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";

export default function Navbar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [cartVisibility,setCartVisibility] = useState(false);

  const itemRenderer = (item) => (
    <Link className="flex align-items-center p-menuitem-link" href={item.url}>
      <span className={item.icon} />
      <span className="mx-2">{item.label}</span>
      {item.badge && <Badge className="ml-auto" value={item.badge} />}
      {item.shortcut && (
        <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">
          {item.shortcut}
        </span>
      )}
    </Link>
  );
  const headerElement = (
    <div className="inline-flex align-items-center justify-content-center gap-2">
      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
      <span className="font-bold white-space-nowrap">
        Yatharth's Cart <i className="pi pi-cart-plus"></i>
      </span>
    </div>
  );

  const totalPrice = () => {
    return data.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

    const footerContent = (
      <div className="p-2">
        <Button
          label="Checkout"
          icon="pi pi-check"
          className="p-button-success"
          autoFocus
        />
        <Button
          label="Clear Cart"
          icon="pi pi-trash"
          className="p-button-danger"
        />
      </div>
    );

  const items: MenuItem[] = [
    {
      label: "Dashboard",
      icon: "pi pi-home",
      url: "/customer/dashboard",
      template: itemRenderer,
    },
    {
      label: "Merchant",
      icon: "pi pi-users",
      url: "/merchant",
      template: itemRenderer,
    },
    {
      label: "Admin",
      icon: "pi pi-user",
      url: "/admin",
      template: itemRenderer,
    }
  ];

  const start = (
    <Link href="/" className="navbar-title">
      ShopSmart
    </Link>
  );

  const end = (
    <div className="flex align-items-center gap-2">
      <i
        className="pi pi-shopping-cart p-overlay-badge mr-3 cursor-pointer"
        style={{ fontSize: "24px" }}
        onClick={() => setCartVisibility(true)}
      >
        <Badge value={data.length} />
      </i>
      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
      <Button
        icon="pi pi-bars"
        onClick={() => setSidebarVisible(true)}
        className="p-button-text"
      />
      <Dialog
        visible={cartVisibility}
        style={{ width: "50vw" }}
        onHide={() => setCartVisibility(false)}
        resizable={false}
        modal={true}
        draggable={false}
        header={headerElement}
        footer={footerContent}
        maximized={true}
      >
        {data.map((item, index) => (
          <div
            key={index}
            className="grid align-items-center gap-3 mb-3"
            style={{ padding: "10px", borderBottom: "1px solid #e0e0e0" }}
          >
            <div className="col-4">
              <Image
                src="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                alt="Product Image"
                height="200"
                width="180"
                
              />
            </div>

            <div className="col-7 product-details p-1">
              <div className="grid">
                
                <div className="col-4 text-left font-bold">
                  <p>Product Name</p>
                  <p>Quantity</p>
                  <p>Origin</p>
                  <p>Price</p>
                </div>
                <div className="col-7 text-right">
                  <p>{item.name}</p>
                  <p>{item.quantity}</p>
                  <p>{item.country}</p>
                  <p>${item.price}</p>
                  <i className="pi pi-trash" style={{color:'red'}}></i>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-right">
          <h3 className="mr-6">
            Total Price:<small>${totalPrice()}</small>
          </h3>
        </div>
      </Dialog>

      <HeadlessDemo
        visible={sidebarVisible}
        onHide={() => setSidebarVisible(false)}
      />
    </div>
  );

  return (
    <div className="card">
      <Menubar model={items} start={start} end={end} />
    </div>
  );
}
