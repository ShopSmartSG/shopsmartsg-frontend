"use client";
import React, { LegacyRef, useEffect, useRef, useState } from "react";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { Avatar } from "primereact/avatar";
import { Ripple } from "primereact/ripple";
import { StyleClass } from "primereact/styleclass";
import Link from "next/link";
import axios from "axios";

interface HeadlessDemoProps {
  visible: boolean;
  onHide: () => void;
}

export default function HeadlessDemo({ visible, onHide }: HeadlessDemoProps) {
  // Create unique refs for each dropdown
  const favoritesRef = useRef(null);
  const merchantRef = useRef(null);
  const revenueRef = useRef(null);
  const customerRef = useRef(null);

  const [name, setName] = useState("");

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchUsername = async () => {
      try {
        if (!userId) return;

        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getMerchant/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (response.status === 200) {
          setName(response.data.name);
        }
      } catch (error) {
        console.error("Error fetching merchant data:", error);
      }
    };

    fetchUsername();
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    localStorage.removeItem("userId");
    // Add navigation logic if needed
  };

  return (
    <div>
      <Sidebar
        visible={visible}
        onHide={onHide}
        position="right"
        content={({ closeIconRef, hide }) => (
          <div className="min-h-screen flex relative lg:static surface-ground">
            <div
              id="app-sidebar-2"
              className="surface-section h-screen block flex-shrink-0 absolute lg:static left-0 top-0 z-1 border-right-1 surface-border select-none"
              style={{ width: "280px" }}
            >
              <div className="flex flex-column h-full">
                {/* Header */}
                <div className="flex align-items-center justify-content-between px-4 pt-3 flex-shrink-0">
                  <span className="inline-flex align-items-center gap-2">
                    {/* Logo SVG remains the same */}
                    <span className="font-semibold text-2xl text-primary">
                      ShopSmart
                    </span>
                  </span>
                  <Button
                    type="button"
                    ref={closeIconRef as unknown as LegacyRef<Button>}
                    onClick={(e) => hide(e)}
                    icon="pi pi-times"
                    rounded
                    outlined
                    className="h-2rem w-2rem"
                  />
                </div>

                {/* Navigation Menu */}
                <div className="overflow-y-auto">
                  <ul className="list-none p-3 m-0">
                    <li>
                      <StyleClass
                        nodeRef={favoritesRef}
                        selector="@next"
                        enterClassName="hidden"
                        enterActiveClassName="slidedown"
                        leaveToClassName="hidden"
                        leaveActiveClassName="slideup"
                      >
                        <div
                          ref={favoritesRef}
                          className="p-ripple p-3 flex align-items-center justify-content-between text-600 cursor-pointer"
                        >
                          <span className="font-medium">FAVORITES</span>
                          <i className="pi pi-chevron-down"></i>
                          <Ripple />
                        </div>
                      </StyleClass>

                      <ul className="list-none p-0 m-0 overflow-hidden">
                        {/* Dashboard & Bookmarks */}
                        <li>
                          <Link
                            href="/"
                            className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                          >
                            <i className="pi pi-home mr-2"></i>
                            <span className="font-medium">Dashboard</span>
                            <Ripple />
                          </Link>
                        </li>

                        {/* Merchant Section */}
                        <li>
                          <StyleClass
                            nodeRef={merchantRef}
                            selector="@next"
                            enterClassName="hidden"
                            enterActiveClassName="slidedown"
                            leaveToClassName="hidden"
                            leaveActiveClassName="slideup"
                          >
                            <button
                              ref={merchantRef}
                              className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                            >
                              <i className="pi pi-shopping-cart mr-2"></i>
                              <span className="font-medium">Merchant</span>
                              <i className="pi pi-chevron-down ml-auto"></i>
                              <Ripple />
                            </button>
                          </StyleClass>

                          <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden">
                            <li>
                              <Link
                                href="/merchant/manage/create"
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-plus mr-2"></i>
                                <span className="font-medium">Add Product</span>
                                <Ripple />
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/merchant/manage/view"
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-list mr-2"></i>
                                <span className="font-medium">
                                  View Products
                                </span>
                                <Ripple />
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/merchant/orders"
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-shopping-bag mr-2"></i>
                                <span className="font-medium">Orders</span>
                                <Ripple />
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/merchant/earnings"
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-wallet mr-2"></i>
                                <span className="font-medium">Earnings</span>
                                <Ripple />
                              </Link>
                            </li>
                          </ul>
                        </li>

                        {/* Customer Section */}
                        <li>
                          <StyleClass
                            nodeRef={customerRef}
                            selector="@next"
                            enterClassName="hidden"
                            enterActiveClassName="slidedown"
                            leaveToClassName="hidden"
                            leaveActiveClassName="slideup"
                          >
                            <button
                              ref={customerRef}
                              className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                            >
                              <i className="pi pi-users mr-2"></i>
                              <span className="font-medium">Customer</span>
                              <i className="pi pi-chevron-down ml-auto"></i>
                              <Ripple />
                            </button>
                          </StyleClass>

                          <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden">
                            <li>
                              <Link
                                href="/customer/orders"
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-shopping-bag mr-2"></i>
                                <span className="font-medium">View Orders</span>
                                <Ripple />
                              </Link>
                            </li>
                            <li>
                              <Link
                                href="/customer/earnings"
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-shopping-bag mr-2"></i>
                                <span className="font-medium">Rewards</span>
                                <Ripple />
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </ul>
                    </li>
                  </ul>
                </div>

                {/* User Profile Section */}
                <div className="mt-auto">
                  <hr className="mb-3 mx-3 border-top-1 border-none surface-border" />
                  <div className="grid p-3">
                    <div className="col-10">
                      <div className="flex align-items-center gap-2">
                        <Avatar
                          image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
                          shape="circle"
                        />
                        <span className="font-bold">{name}</span>
                      </div>
                    </div>
                    <div className="col-2">
                      <Button
                        type="button"
                        icon="pi pi-power-off"
                        rounded
                        outlined
                        className="h-2rem w-2rem"
                        tooltip="Logout"
                        tooltipOptions={{ position: "left" }}
                        onClick={handleLogout}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      />
    </div>
  );
}
