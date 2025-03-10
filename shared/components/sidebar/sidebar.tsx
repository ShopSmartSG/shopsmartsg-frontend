"use client";
import React, {LegacyRef, useEffect, useRef, useState} from "react";
import {Sidebar} from "primereact/sidebar";
import {Button} from "primereact/button";
import {Avatar} from "primereact/avatar";
import {Ripple} from "primereact/ripple";
import {StyleClass} from "primereact/styleclass";
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
  const customerRef = useRef(null);
  const deliveryPartnerRef = useRef(null);
  const [userType, setUserType] = useState("");
  const [isValidSession, setValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState("");
  const toast = useRef(null);
  const [user,setUser] = useState("");
  const [isMerchant, setIsMerchant] = useState(true);
  const [isCustomer, setIsCustomer] = useState(true);
  const [isDeliveryPartner, setIsDeliveryPartner] = useState(true);


  useEffect(() => {
    const validator = async () => {
      try {
        const response = await axios.get(`https://central-hub.shopsmartsg.com/auth/validate-token`, {
          withCredentials: true
        });
        const data = response.data;
        if (data.status && data.status.toLowerCase() !== 'failure') {
          setValidSession(true);
          setUser(data.profileType);
          if(user == 'customer'){
            setIsCustomer(true);
            setIsMerchant(false);
            setIsDeliveryPartner(false);
          }
            else if(user == 'merchant'){
                setIsMerchant(true);
                setIsCustomer(false);
                setIsDeliveryPartner(false);
            }
            else if(user == 'delivery'){
                setIsDeliveryPartner(true);
                setIsCustomer(false);
                setIsMerchant(false);
            }
        } else {
          setValidSession(false);
          toast.current.show({ severity: "error", detail: "You are logged out!! Please Login Again", summary: 'Error' });
        }
      } catch (error) {
        console.log('Validation Error:', error);
        setValidSession(false);
      } finally {
        setIsLoading(false);
      }
    };
    validator();
  }, []);

  const handleLogout = async() => {
    try{
      const response = await axios.get(`${process.env.NEXT_PUBLIC_CentralService_API_URL}auth/logout/${user}`,{
        withCredentials:true
      });
      console.log("Logged Out Successfully", response);
      window.location.href = await response.data.redirect_uri;
      toast.current.show({ severity: "success", detail: "Logged Out Successfully", summary: 'Success' });

    }
    catch(error){
      console.error("Error logging out", error);
        toast.current.show({ severity: "error", detail: "Error Logging Out", summary: 'Error' });
    }
    finally {
      console.log("User logged out");
    }
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
                        {isMerchant && ( <li>
                          <StyleClass
                              nodeRef={merchantRef}
                              selector="@next"
                              enterFromClassName="hidden"
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
                            <li>
                              <Link
                                  href="/merchant/reset"
                                  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-key mr-2"></i>
                                <span className="font-medium">Reset Password</span>
                                <Ripple />
                              </Link>
                            </li>
                          </ul>
                        </li>)}



                        {/* Customer Section */}
                        {isCustomer && ( <li className={"mt-2"}>
                          <StyleClass
                              nodeRef={customerRef}
                              selector="@next"
                              enterFromClassName="hidden"
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
                            <li>
                              <Link
                                  href="/customer/reset"
                                  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-key
                                   mr-2"></i>
                                <span className="font-medium">Reset Password</span>
                                <Ripple />
                              </Link>
                            </li>
                          </ul>
                        </li>)}


                        {/* Delivery Partner section */}
                        {isDeliveryPartner && <li className={"mt-2"}>
                          <StyleClass
                              nodeRef={deliveryPartnerRef}
                              selector="@next"
                              enterFromClassName="hidden"
                              enterActiveClassName="slidedown"
                              leaveToClassName="hidden"
                              leaveActiveClassName="slideup"
                          >
                            <button
                                ref={deliveryPartnerRef}
                                className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                            >
                              <i className="pi pi-users mr-2"></i>
                              <span className="font-medium">Delivery</span>
                              <i className="pi pi-chevron-down ml-auto"></i>
                              <Ripple />
                            </button>
                          </StyleClass>

                          <ul className="list-none py-0 pl-3 pr-0 m-0 hidden overflow-y-hidden">
                            <li>
                              <Link
                                  href="/delivery/login"
                                  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-shopping-bag mr-2"></i>
                                <span className="font-medium">Delivery Partner Login</span>
                                <Ripple />
                              </Link>
                            </li>
                            <li>
                              <Link
                                  href="/delivery/orders"
                                  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-shopping-bag mr-2"></i>
                                <span className="font-medium">Orders</span>
                                <Ripple />
                              </Link>
                            </li>
                            <li>
                              <Link
                                  href="/customer/reset"
                                  className="p-ripple flex align-items-center cursor-pointer p-3 border-round text-700 hover:surface-100 transition-duration-150 transition-colors w-full"
                              >
                                <i className="pi pi-key
                                   mr-2"></i>
                                <span className="font-medium">Reset Password</span>
                                <Ripple />
                              </Link>
                            </li>
                          </ul>
                        </li>}

                      </ul>
                    </li>
                  </ul>
                </div>

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
