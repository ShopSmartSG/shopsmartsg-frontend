"use client";
import React, { useEffect, useState, useRef } from "react";
import { Menubar } from "primereact/menubar";
import { MenuItem } from "primereact/menuitem";
import { Badge } from "primereact/badge";
import { Avatar } from "primereact/avatar";
import "./navbar.css";
import Link from "next/link";
import HeadlessDemo from "../sidebar/sidebar";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Checkbox } from "primereact/checkbox";
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
  const [customerName, setCustomerName] = useState("");
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(false);
  const [homeDelivered, setHomeDelivered] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [discountedPrice, setDiscountedPrice] = useState(0);
  const [validSession, setValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const toast = useRef(null);

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
        image="https://storage.googleapis.com/shopsmart-product-images-bucket/Screenshot%202025-03-09%20at%206.53.29%E2%80%AFPM.png"
        shape="circle"
      />
      <span className="font-bold white-space-nowrap">
        {customerName}'s Cart <i className="pi pi-cart-plus"></i>
      </span>
    </div>
  );

  const fetchProductDetails = async (productId, merchantId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getProduct/${merchantId}/products/${productId}`,
        { withCredentials: true }
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

  const getCustomerDetails = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getCustomerByUUID/rewards`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setRewardPoints(response.data.rewardPoints);
        setCustomerName(response.data.customerName);
      }
    } catch (error) {
      console.error("Error fetching customer details:", error);
    }
  };

  const getDiscountedPrice = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getCustomerByUUID/rewards`,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setDiscountedPrice(response.data.rewardAmount);
      }
    } catch (error) {
      console.error("Error fetching discount price:", error);
    }
  };

  const deleteCartItem = async (item) => {
    try {
      const response = await axios.put(
        `${
          process.env.NEXT_PUBLIC_CentralService_API_URL
        }api/deleteFromCart/${"userId"}`,
        {
          productId: item.productId,
          quantity: item.quantity,
        },
        { withCredentials: true }
      );
      // Update cart items after deletion
      setCartItems(
        cartItems.filter((cartItem) => cartItem.productId !== item.productId)
      );
    } catch (err) {
      console.error("Error deleting cart item:", err);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error deleting item from cart",
        life: 3000,
      });
    }
  };

  const clearCart = async (customerId) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/emptyCartItems/${customerId}`,
        { withCredentials: true }
      );
      setCartItems([]);
      setTotalPrice(0);
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error clearing cart",
        life: 3000,
      });
    }
  };

  const placeOrder = async (customerId) => {
    setLoading(true);
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/createOrder/${customerId}/rewards/${useRewardPoints}/delivery/${homeDelivered}`,
        {
          data: "k",
          useDelivery: homeDelivered,
        },
        { withCredentials: true }
      );
      if (response.status === 200) {
        setTimeout(() => {
          toast.current.show({
            severity: "success",
            summary: "Order Placed",
            detail: "Your order has been placed successfully",
            life: 3000,
          });
          setCartVisibility(false);
          setCartItems([]);
        }, 3000);
        router.push("/customer/orders");
      }
    } catch (error) {
      console.log(error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Error placing order. Please try again later.",
        life: 300,
      });
    } finally {
      setLoading(false);
    }
  };

  // Validate session on component mount
  useEffect(() => {
    const validator = async () => {
      try {
        const response = await axios.get(
          `https://central-hub.shopsmartsg.com/auth/validate-token`,
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        console.log("API Response:", data);
        if (data.status && data.status.toLowerCase() !== "failure") {

          const userLowerCase = await data.userType.toLowerCase();
            setUserType(userLowerCase);

        } else {
          setValidSession(false);
        }
      } catch (error) {
        console.error("Validation Error:", error);
        setValidSession(false);
      } finally {
        setIsLoading(false);
      }
    };

    validator();
    getCustomerDetails();
  }, []);

  // Fetch cart items
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getCartItems/`,
          { withCredentials: true }
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

  // Calculate total price whenever cart items change
  useEffect(() => {
    const total = cartItems.reduce((sum, item) => {
      return sum + item.listingPrice * item.quantity;
    }, 0);
    setTotalPrice(total);
  }, [cartItems]);

  // Handle reward points
  useEffect(() => {
    getDiscountedPrice();
    if (useRewardPoints) {
      const disPrice = totalPrice - discountedPrice;
      setTotalPrice(disPrice);
    } else {
      setTotalPrice(totalPrice + discountedPrice);
    }
  }, [useRewardPoints, discountedPrice, totalPrice]);

  const footerContent = (
    <div className="p-2 flex justify-content-between align-items-center">
      <div className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</div>
      <div className="field flex align-items-center">
        <label className="mr-2 mt-2">Require Home Delivery</label>
        <Checkbox
          inputId="binary"
          onChange={(e) => setHomeDelivered(e.checked)}
          checked={homeDelivered}
        />
      </div>
      <div className="field flex align-items-center">
        <label>Reward Points Available : {rewardPoints}</label>
      </div>
      <div className="field flex align-items-center">
        <label className="mr-2 mt-2">Use Reward Points</label>
        <Checkbox
          inputId="binary"
          onChange={(e) => setUseRewardPoints(e.checked)}
          checked={useRewardPoints}
        />
      </div>
      <div>
        <Button
          label="Checkout"
          icon="pi pi-check"
          className="p-button-success mr-2"
          autoFocus
          onClick={() => placeOrder("userId")}
          disabled={loading}
        />
        <Button
          label="Clear Cart"
          icon="pi pi-trash"
          className="p-button-danger"
          onClick={() => clearCart("userId")}
          disabled={loading}
        />
      </div>
      {loading && (
        <div className="spinner-container">
          <ProgressSpinner />
        </div>
      )}
    </div>
  );

  const items = [
    {
      label: "Merchant",
      icon: "pi pi-users",
      url: "/merchant",
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
        <Badge value={cartItems.length} />
      </i>

      <Avatar
        image="https://storage.googleapis.com/shopsmart-product-images-bucket/Screenshot%202025-03-09%20at%206.53.29%E2%80%AFPM.png"
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
                  <p>Subtotal</p>
                </div>
                <div className="col-7 text-right">
                  <p>{item.productName}</p>
                  <p>{item.quantity}</p>
                  <p>${item.listingPrice}</p>
                  <p>${(item.listingPrice * item.quantity).toFixed(2)}</p>
                  <i
                    className="pi pi-trash cursor-pointer"
                    style={{ color: "red" }}
                    onClick={() => deleteCartItem(item)}
                  ></i>
                </div>
              </div>
            </div>
          </div>
        ))}
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
