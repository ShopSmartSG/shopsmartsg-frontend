"use client";
import React, { useState } from "react";
import { Menubar } from "primereact/menubar";
import { InputText } from "primereact/inputtext";
import { MenuItem } from "primereact/menuitem";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import "./navbar.css";
import Link from "next/link";
import HeadlessDemo from "../sidebar/sidebar";
import { Button } from "primereact/button";

export default function Navbar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

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
    },
    {
      label: "Customer",
      icon: "pi pi-users",
      url: "/customer/login",
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
      <InputText
        placeholder="Search"
        type="text"
        className="w-8rem sm:w-auto"
      />
      <Avatar
        image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
        shape="circle"
      />
      <Button
        icon="pi pi-bars"
        onClick={() => setSidebarVisible(true)}
        className="p-button-text"
      />
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
