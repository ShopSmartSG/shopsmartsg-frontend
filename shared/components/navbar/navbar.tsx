"use client";
import React, { useEffect, useState } from "react";
import { Menubar } from "primereact/menubar";
import { useRef } from "react";
import { MenuItem } from "primereact/menuitem";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import "./navbar.css";
import Link from "next/link";
import HeadlessDemo from "../sidebar/sidebar";
import { Button } from "primereact/button";
import data from "../../assets/dummyData/cart";
import { useRouter } from "next/navigation";
import { Dialog } from "primereact/dialog";
import { Image } from "primereact/image";
import axios from "axios";
import { Toast } from "primereact/toast";

export default function Navbar() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [cartVisibility, setCartVisibility] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [merchantId, setMerchantId] = useState("");
  const router = useRouter();

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

  const toast = useRef(null);

  // Order Placement
  const placeOrder = async (customerId: string) => {
    try {
       const response = await axios.put(
         `${process.env.NEXT_PUBLIC_CentralService_API_URL}/createOrder/${customerId}`, {
           data:'k'
         }
       );
       if (response.status == 200) {
         setTimeout(() => {
           toast.current.show({
             severity: "success",
             summary: "Order Placed",
             detail: "Your order has been placed successfully",
             life: 3000,
           });

           setCartItems([]);
         }, 3000);
         router.push("/customer/orders");
       }
    } catch (error) {
     console.log(error);
    }
  };

  // Fetch Individuval Product Details
  const fetchProductDetails = async (productId, merchantId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getProduct/${merchantId}/products/${productId}`
      );

      return {
        listingPrice: response.data.listingPrice,
        productName: response.data.productName,
        imageUrl: response.data.imageUrl,
      };
    } catch (error) {
      console.error(`Error fetching details for product ${productId}:`, error);
      return {
        listingPrice: null,
        productName: "Not available",
        imageUrl: null,
      };
    }
  };

  const fetchAllProductDetails = async (items, merchantId) => {
    try {
      const updatedItems = await Promise.all(
        items.map(async (item) => {
          const productDetails = await fetchProductDetails(
            item.productId,
            merchantId
          );
          return {
            ...item,
            ...productDetails,
          };
        })
      );
      return updatedItems;
    } catch (error) {
      throw new Error("Error fetching product details");
    }
  };
  // Get Cart Items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getCartItems/4c699c23-81bf-4a25-9dee-7fb7c37f7f60`
        );

        setMerchantId(response.data.merchantId);

        const itemsWithDetails = await fetchAllProductDetails(
          response.data.cartItems,
          response.data.merchantId
        );

        setCartItems(itemsWithDetails);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const footerContent = (
    <div className="p-2">
      <Button
        label="Checkout"
        icon="pi pi-check"
        className="p-button-success"
        autoFocus
        onClick={()=> placeOrder("4c699c23-81bf-4a25-9dee-7fb7c37f7f60")}
      />
      <Button
        label="Clear Cart"
        icon="pi pi-trash"
        className="p-button-danger"
        onClick={() => clearCart("4c699c23-81bf-4a25-9dee-7fb7c37f7f60")}
      />
    </div>
  );

  const items: MenuItem[] = [
    // {
    //   label: "Dashboard",
    //   icon: "pi pi-home",
    //   url: "/customer/dashboard",
    //   template: itemRenderer,
    // },
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
      label: "Orders",
      icon: "pi pi-gift",
      url: "/customer/orders",
      template: itemRenderer,
    },
    {
      label: "Customer Products",
      icon: "pi pi-barcode",
      url: "/customer/products",
      template: itemRenderer,
    },
  ];

  const endItems: MenuItem[] = [];

  const start = (
    <Link href="/" className="navbar-title">
      ShopSmart
    </Link>
  );

  const deleteCartItem = async (item) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/deleteFromCart/4c699c23-81bf-4a25-9dee-7fb7c37f7f60`,
        {
          productId: item.productId,
          quantity: item.quantity,
        }
      );
    } catch (err) {
      console.error("Error deleting cart item:", err);
    }
  };
  const clearCart = async (customerId: string) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/emptyCartItems/${customerId}`
      );
    } catch (error) {}
  };
  const end = (
    <div className="flex align-items-center gap-2">
      <i
        className="pi pi-shopping-cart p-overlay-badge mr-3 cursor-pointer"
        style={{ fontSize: "24px" }}
        onClick={() => setCartVisibility(true)}
      >
        <Badge value={cartItems.length} />
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
        {cartItems.map((item, index) => (
          <div
            key={index}
            className="grid align-items-center gap-3 mb-3"
            style={{ padding: "10px", borderBottom: "1px solid #e0e0e0" }}
          >
            <div className="col-4">
              <Image
                src={`${item.imageUrl}`}
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

                  <p>Price</p>
                </div>
                <div className="col-7 text-right">
                  <p>{item.productName}</p>
                  <p>{item.quantity}</p>

                  <p>${item.price}</p>
                  <i
                    className="pi pi-trash"
                    style={{ color: "red" }}
                    onClick={() => deleteCartItem(item)}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="text-right">
          <h3 className="mr-6">
            Total Price:<small>$</small>
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
      <Toast ref={toast} />
    </div>
  );
}
