"use client";
import React, {useEffect, useRef, useState} from "react";
import Link from "next/link";
import { Steps } from "primereact/steps";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import { useRouter } from "next/navigation";
import {Toast} from "primereact/toast";
import { Card } from "primereact/card";
import axios from "axios";
import ForbiddenPage from "../../../../shared/components/ForbiddenPage/ForbiddenPage";

const getActiveIndex = (status) => {
  switch (status) {
    case "CREATED":
      return 0;
    case "READY":
      return 1;
    case "COMPLETED":
      return 2;
    case "CANCELLED":
      return 3;
    default:
      return 0;
  }
};

const getActiveIndexForDelivery = (status) => {
  switch (status) {
    case "CREATED":
      return 0;
    case "READY":
      return 1;
    case "COMPLETED":
      return 3;
    case "CANCELLED":
      return 4;
    case "DELIVERY_ACCEPTED":
      return 1;
    case "DELIVERY_PICKED_UP":
      return 2;
    default:
      return 0;
  }
};

// Dummy user ID and type for testing
// const userId = "12345";
// const userType = "CUSTOMER";

const OrderCard = ({ order, isDelivery }) => {
  const [merchantDetails, setMerchantDetails] = useState(null);

  useEffect(() => {
    const fetchMerchantDetails = async () => {
      try {
        const response = await axios.get(

            `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getMerchantByUUID/${order.merchantId}`,
            { withCredentials: true }

        );
        if (response.status === 200) {
          setMerchantDetails(response.data);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchMerchantDetails();
  }, [order.merchantId]);

  const activeIndex = isDelivery
      ? getActiveIndexForDelivery(order.status)
      : getActiveIndex(order.status);

  const itemRenderer = (item, itemIndex) => {
    const isActiveItem = activeIndex === itemIndex;
    const backgroundColor = isActiveItem
        ? "var(--primary-color)"
        : "var(--surface-b)";
    const textColor = isActiveItem
        ? "var(--surface-b)"
        : "var(--text-color-secondary)";


    return (
        <div
            className="flex flex-column align-items-center"
            style={{ marginTop: "20px" }}
        >
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

  const pickupOrderSteps = [
    {
      label: "Order Placed",
      icon: "pi pi-shopping-cart",
      template: (item) => itemRenderer(item, 0),
    },
    {
      label: "Ready",
      icon: "pi pi-box",
      template: (item) => itemRenderer(item, 1),
    },
    {
      label: "Order Picked Up",
      icon: "pi pi-check",
      template: (item) => itemRenderer(item, 2),
    },
    {
      label: "Order Cancelled",
      icon: "pi pi-times",
      template: (item) => itemRenderer(item, 3),
    },
  ];

  const deliveryOrderSteps = [
    {
      label: "Order Placed",
      icon: "pi pi-shopping-cart",
      template: (item) => itemRenderer(item, 0),
    },
    {
      label: "Ready",
      icon: "pi pi-box",
      template: (item) => itemRenderer(item, 1),
    },
    {
      label: "Order Picked Up",
      icon: "pi pi-check",
      template: (item) => itemRenderer(item, 2),
    },
    {
      label: "Order Delivered",
      icon: "pi pi-check-circle",
      template: (item) => itemRenderer(item, 3),
    },
    {
      label: "Order Cancelled",
      icon: "pi pi-times",
      template: (item) => itemRenderer(item, 4),
    },
  ];

  const handleDirections = (lat, long) => {
    window.open(
        `https://www.google.com/maps?q=@${lat},${long}`,
        "_blank",
        "noopener,noreferrer"
    );
  };

  return (
      <Card title={`Order ID: ${order.orderId}`} className="mb-3">
        <div className="flex flex-column md:flex-row justify-content-between align-items-center">
          <div className="flex-grow-1 mr-3 w-full" style={{ marginTop: "-50px" }}>
            <Steps
                model={isDelivery ? deliveryOrderSteps : pickupOrderSteps}
                activeIndex={activeIndex}
                readOnly={true}
                className="m-2 pt-4"
            />
            <p className="mt-3 mb-2">Total Price: ${order.totalPrice}</p>
            <p className="mb-2">
              Date: {new Date(order.createdDate).toLocaleDateString()}
            </p>
            <p className="mb-2">Merchant: {merchantDetails?merchantDetails?.name:''}</p>
            <p className="mb-2">
              Delivery Type: {isDelivery ? "Partner Assisted" : "Self Pickup"}
            </p>
            <div>
              <Link
                  href={`/customer/orders/${order.orderId}`}
                  className="p-button p-button-text"
              >
                View Order Details
              </Link>
              <Tooltip
                  target=".navigate-tooltip"
                  content="Click to navigate."
                  position="bottom"
              ></Tooltip>
            </div>
            {isDelivery ? (
                <div></div>
            ) : (
                <div className="flex">
                  <div
                      className="mr-2 mt-2 navigate-tooltip"
                      onClick={() =>
                          handleDirections(
                              merchantDetails?.latitude,
                              merchantDetails?.longitude
                          )
                      }
                  >
                    <i className="pi pi-arrow-circle-right block mt-2 navigate-tooltip cursor-pointer"></i>
                  </div>
                  <div>
                    <Message severity="info" text="Click To Navigate." />
                  </div>
                </div>
            )}
          </div>
        </div>
      </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([
    // {
    //   orderId: "12345",
    //   status: "CREATED",
    //   totalPrice: 50.0,
    //   createdDate: "2023-10-01",
    //   useDelivery: false,
    //   merchantId: "1",
    // },
    // {
    //   orderId: "67890",
    //   status: "READY",
    //   totalPrice: 75.0,
    //   createdDate: "2023-10-02",
    //   useDelivery: true,
    //   merchantId: "2",
    // },
    // {
    //   orderId: "11223",
    //   status: "COMPLETED",
    //   totalPrice: 100.0,
    //   createdDate: "2023-10-03",
    //   useDelivery: false,
    //   merchantId: "3",
    // },
    // {
    //   orderId: "44556",
    //   status: "CANCELLED",
    //   totalPrice: 25.0,
    //   createdDate: "2023-10-04",
    //   useDelivery: true,
    //   merchantId: "4",
    // },
  ]);
  const [isValidSession,setValidSession] = useState(null);
  const toast = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userType,setUserType] = useState(null);
  const router = useRouter();

  // Handle session validation
  useEffect(() => {
    const validator = async () => {
      try {
        const response = await axios.get(`https://central-hub.shopsmartsg.com/auth/validate-token`, {
          withCredentials: true
        });
        const data = response.data;
        console.log('API Response:', data); // Debug the response
        if (data.status && data.status.toLowerCase() !== 'failure') {
          setValidSession(true);
          setUserType(data.profileType);
        } else {
          setValidSession(false);
          toast.current.show({ severity: "error", detail: "You are logged out!! Please Login Again", summary: 'Error' });
        }
      } catch (error) {
        console.error('Validation Error:', error); // Log the error
        setValidSession(false);
      } finally {
        setIsLoading(false);
      }
    };
    validator();
  }, []); // No dependencies to prevent loops

  // Fetch orders only when session is valid
  useEffect(() => {
    const fetchOrders = async () => {
      if (isValidSession) {
        try {
          setIsLoading(true);
          const response = await axios.get(

            `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getOrdersListForProfile/ALL/profiles/customer/id`,
            { withCredentials: true }

          );
          if (response.status === 200) {
            setOrders(response.data);
          }
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchOrders();
  }, [isValidSession]); // Only re-run when session validation changes
  const ongoingPickupOrders = orders.filter(
      (order) =>
          (order.status !== "COMPLETED" &&
              order.status !== "CANCELLED" &&
              !order.useDelivery) ||
          order.status === "READY"
  );
  const ongoingDeliveryOrders = orders.filter(
      (order) =>
          order.useDelivery &&
          (order.status === "CREATED" ||
              order.status === "DELIVERY_ACCEPTED" ||
              order.status === "DELIVERY_PICKED_UP")
  );
  const pastPickupOrders = orders.filter(
      (order) =>
          (order.status === "COMPLETED" || order.status === "CANCELLED") &&
          !order.useDelivery
  );
  const pastDeliveryOrders = orders.filter(
      (order) => order.useDelivery && order.status === "COMPLETED"
  );

 // Show loading state until everything is ready
 if (isLoading) {
  return <div>Loading...</div>;
}

 if(userType&& userType != 'customer'){
  return <ForbiddenPage/>

 }

if(isValidSession){
  return (
      <div className="p-4">
        <h2 className="mb-3">Ongoing Orders</h2>
        <div className="grid">
          {ongoingPickupOrders.map((order) => (
              <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
                <OrderCard order={order} isDelivery={false} />
              </div>
          ))}
        </div>

        <h2 className="mb-3">Ongoing Delivery Orders</h2>
        <div className="grid">
          {ongoingDeliveryOrders.map((order) => (
              <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
                <OrderCard order={order} isDelivery={true} />
              </div>
          ))}
        </div>

        <h2 className="mb-3 mt-5">Past Orders</h2>
        <div className="grid">
          {pastPickupOrders.map((order) => (
              <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
                <OrderCard order={order} isDelivery={false} />
              </div>
          ))}
        </div>
        <h2 className="mb-3 mt-5">Past Delivery Orders</h2>
        <div className="grid">
          {pastDeliveryOrders.map((order) => (
              <div key={order.orderId} className="col-12 md:col-6 lg:col-4">
                <OrderCard order={order} isDelivery={true} />
              </div>
          ))}
          <Toast ref={toast} />
        </div>
      </div>
  );

}
 else {
  router.push("/customer/login");
  return null;
}
};

export default Orders;