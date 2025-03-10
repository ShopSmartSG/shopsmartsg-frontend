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
    const [basePrice, setBasePrice] = useState(0); // Track original price before discount
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
        {customerName ? `${customerName}'s Cart` : 'Your Cart'} <i className="pi pi-cart-plus"></i>
      </span>
        </div>
    );

    const fetchProductDetails = async (productId, merchantId) => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getProducts/${productId}`,
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
            // Handle empty cart case
            if (!items || items.length === 0) {
                return [];
            }

            // Extract product IDs from cart items
            const productIds = items.map(item => item.productId);

            // Create query string with array of product IDs
            const queryString = productIds.join(',');

            // Make a single API call with all product IDs
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getProducts?productIds=${queryString}`,
                { withCredentials: true }
            );

            // Map the response data to cart items
            const productDetailsMap = {};
            if (Array.isArray(response.data)) {
                response.data.forEach(product => {
                    if (product && product.productId) {
                        productDetailsMap[product.productId] = {
                            listingPrice: product.listingPrice,
                            productName: product.productName,
                            imageUrl: product.imageUrl
                        };
                    }
                });
            }

            // Merge product details with cart items
            const updatedItems = items.map(item => {
                return {
                    ...item,
                    ...(productDetailsMap[item.productId] || {
                        listingPrice: null,
                        productName: "Not available",
                        imageUrl: null
                    })
                };
            });

            return updatedItems;
        } catch (error) {
            console.error("Error fetching product details:", error);
            // Return original items with default values when API fails
            return items.map(item => ({
                ...item,
                listingPrice: 0,
                productName: "Product data unavailable",
                imageUrl: null
            }));
        }
    };

    const getCustomerDetails = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getCustomer/rewards`,
                { withCredentials: true }
            );
            if (response.status === 200 && response.data) {
                setRewardPoints(response.data.rewardPoints || 0);
                setCustomerName(response.data.customerName || "");
                // Also update discount amount if present in the same response
                if (response.data.rewardAmount) {
                    setDiscountedPrice(response.data.rewardAmount);
                }
            }
        } catch (error) {
            console.error("Error fetching customer details:", error);
            // Don't reset state values on error
        }
    };

    const getDiscountedPrice = async () => {
        try {
            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getCustomer/rewards`,
                { withCredentials: true }
            );
            if (response.status === 200 && response.data && response.data.rewardAmount) {
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
                }api/deleteFromCart`,
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

            toast.current.show({
                severity: "success",
                summary: "Item Removed",
                detail: "Item removed from cart successfully",
                life: 3000,
            });
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

    const clearCart = async () => {
        try {
            const response = await axios.delete(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/emptyCartItems`,
                { withCredentials: true }
            );
            setCartItems([]);
            setBasePrice(0);
            setTotalPrice(0);

            toast.current.show({
                severity: "success",
                summary: "Cart Cleared",
                detail: "Your cart has been cleared",
                life: 3000,
            });
        } catch (error) {
            console.error("Error clearing cart:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error clearing cart",
                life: 3000,
            });
        }
    };

    const placeOrder = async () => {
        setLoading(true);
        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/createOrder/rewards/${useRewardPoints}/delivery/${homeDelivered}`,
                {
                    data: "k",
                    useDelivery: homeDelivered,
                },
                { withCredentials: true }
            );
            if (response.status === 200) {
                toast.current.show({
                    severity: "success",
                    summary: "Order Placed",
                    detail: "Your order has been placed successfully",
                    life: 3000,
                });
                setCartVisibility(false);
                setCartItems([]);
                setBasePrice(0);
                setTotalPrice(0);

                // Use setTimeout to ensure the toast is visible before navigating
                setTimeout(() => {
                    router.push("/customer/orders");
                }, 2000);
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Error placing order. Please try again later.",
                life: 3000,
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

                if (data && data.status && data.status.toLowerCase() !== "failure") {
                    setValidSession(true);
                    if (data.userType) {
                        const userLowerCase = data.userType.toLowerCase();
                        setUserType(userLowerCase);
                    }
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
                    `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getCartItems`,
                    { withCredentials: true }
                );

                if (response.data && response.data.merchantId) {
                    setMerchantId(response.data.merchantId);
                }

                // Check if cartItems exists and is an array
                if (response.data && Array.isArray(response.data.cartItems)) {
                    const itemsWithDetails = await fetchAllProductDetails(
                        response.data.cartItems,
                        response.data.merchantId
                    );
                    setCartItems(itemsWithDetails);
                } else {
                    // Handle case when cartItems is not an array
                    setCartItems([]);
                }
            } catch (error) {
                console.error("Error fetching cart items:", error);
                setCartItems([]);
            }
        };

        fetchData();
    }, []);

    // Calculate base price whenever cart items change
    useEffect(() => {
        const total = cartItems.reduce((sum, item) => {
            return sum + (item.listingPrice || 0) * (item.quantity || 0);
        }, 0);
        setBasePrice(total);
    }, [cartItems]);

    // Update total price when base price, discount, or useRewardPoints changes
    useEffect(() => {
        if (useRewardPoints) {
            // Apply discount only if there are enough points
            const discountToApply = Math.min(discountedPrice, basePrice);
            setTotalPrice(Math.max(0, basePrice - discountToApply));
        } else {
            setTotalPrice(basePrice);
        }
    }, [basePrice, discountedPrice, useRewardPoints]);

    const footerContent = (
        <div className="p-2 flex justify-content-between align-items-center flex-wrap">
            <div className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</div>
            <div className="field flex align-items-center">
                <label className="mr-2 mt-2">Require Home Delivery</label>
                <Checkbox
                    inputId="delivery-checkbox"
                    onChange={(e) => setHomeDelivered(e.checked)}
                    checked={homeDelivered}
                />
            </div>
            <div className="field flex align-items-center">
                <label>Reward Points Available: {rewardPoints}</label>
            </div>
            <div className="field flex align-items-center">
                <label className="mr-2 mt-2">Use Reward Points</label>
                <Checkbox
                    inputId="rewards-checkbox"
                    onChange={(e) => setUseRewardPoints(e.checked)}
                    checked={useRewardPoints}
                    disabled={rewardPoints <= 0 || discountedPrice <= 0}
                />
            </div>
            <div>
                <Button
                    label="Checkout"
                    icon="pi pi-check"
                    className="p-button-success mr-2"
                    autoFocus
                    onClick={placeOrder}
                    disabled={loading || cartItems.length === 0}
                />
                <Button
                    label="Clear Cart"
                    icon="pi pi-trash"
                    className="p-button-danger"
                    onClick={clearCart}
                    disabled={loading || cartItems.length === 0}
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
                {cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                        <div
                            key={index}
                            className="grid align-items-center gap-3 mb-3"
                            style={{ padding: "10px", borderBottom: "1px solid #e0e0e0" }}
                        >
                            <div className="col-4">
                                <Image
                                    src={item.imageUrl || "https://storage.googleapis.com/shopsmart-product-images-bucket/placeholder.png"}
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
                                        <p>{item.productName || "Unknown Product"}</p>
                                        <p>{item.quantity || 0}</p>
                                        <p>${item.listingPrice?.toFixed(2) || "0.00"}</p>
                                        <p>${((item.listingPrice || 0) * (item.quantity || 0)).toFixed(2)}</p>
                                        <i
                                            className="pi pi-trash cursor-pointer"
                                            style={{ color: "red" }}
                                            onClick={() => deleteCartItem(item)}
                                        ></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center p-5">
                        <i className="pi pi-shopping-cart text-6xl mb-3" style={{ color: "#ccc" }}></i>
                        <h3>Your cart is empty</h3>
                        <p>Browse our products and add items to your cart</p>
                    </div>
                )}
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