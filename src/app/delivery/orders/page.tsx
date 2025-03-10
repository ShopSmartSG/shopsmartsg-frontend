"use client";
import React, {useEffect, useRef, useState} from "react";
// import Link from "next/link";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import axios from "axios";
import { Message } from "primereact/message";
import { Tooltip } from "primereact/tooltip";
import {useRouter} from "next/navigation";
import {Toast} from "primereact/toast";
import ForbiddenPage from "../../../../shared/components/ForbiddenPage/ForbiddenPage";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [isValidSession, setValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [userType, setUserType] = useState(null);
  const router = useRouter();
  const toast= useRef(null);

  useEffect(() => {
    const validator = async () => {
      try {
        const response = await axios.get(`https://central-hub.shopsmartsg.com/auth/validate-token`, {
          withCredentials: true
        });
        const data = response.data;
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
  }, []);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Fetch orders from both endpoints independently
        const [profileResponse, activeResponse] = await Promise.allSettled([
          axios.get(

            `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getOrdersListForProfile/ALL/profiles/deliveryPartner/id/`,
            { withCredentials: true }
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getActiveOrdersForDeliveries`,
            { withCredentials: true }

          ),
        ]);

        // Handle responses, using empty arrays for failed requests
        const profileOrders =
          profileResponse.status === "fulfilled"
            ? profileResponse.value.data
            : [];
        const activeOrders =
          activeResponse.status === "fulfilled"
            ? activeResponse.value.data
            : [];

        // Combine orders from both successful responses
        const allOrders = [...profileOrders, ...activeOrders];

        // Fetch additional details for each order
        const ordersWithDetails = await Promise.all(
          allOrders.map(async (order) => {
            try {
              // Fetch merchant and customer details independently
              const [merchantResponse, customerResponse] =
                await Promise.allSettled([
                  getMerchantDetails(order.merchantId),
                  getCustomerDetails(order.customerId),
                ]);

              // Use default values if detail fetching fails
              const merchantDetails =
                merchantResponse.status === "fulfilled"
                  ? merchantResponse.value
                  : { latitude: null, longitude: null };

              const customerDetails =
                customerResponse.status === "fulfilled"
                  ? customerResponse.value
                  : { latitude: null, longitude: null };

              return {
                ...order,
                merchantDetails,
                merchantLatitude: merchantDetails.latitude,
                merchantLongitude: merchantDetails.longitude,
                customerLatitude: customerDetails.latitude,
                customerLongitude: customerDetails.longitude,
                customerDetails,
              };
            } catch (error) {
              // If detail fetching fails, return order with default values
              console.error(
                `Error fetching details for order ${order.id}:`,
                error
              );
              return {
                ...order,
                merchantDetails: {},
                merchantLatitude: null,
                merchantLongitude: null,
                customerLatitude: null,
                customerLongitude: null,
                customerDetails: {},
              };
            }
          })
        );

        setOrders(ordersWithDetails);
      } catch (error) {
        console.error("Error in order fetching process:", error);
        // Even if there's an error, ensure orders state is at least an empty array
        setOrders([]);
      }
    };

    fetchOrders();
  }, [/*userId*/]); // Added userId to dependency array

  const handleDirections = (lat, long) => {
    window.open(
      `https://www.google.com/maps?q=@${lat},${long}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      await axios.put(

        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/updateOrderStatus/${orderId}/${status}`,

        {
          deliveryPartnerId: 'userId',
        },
        { withCredentials: true }
      );

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.orderId === orderId ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  const ongoingOrders = orders.filter(
    (order) =>
      order.status === "READY" ||
      order.status === "DELIVERY_ACCEPTED" ||
      order.status === "DELIVERY_PICKED_UP"
  );
  const pastOrders = orders.filter((order) => order.status === "COMPLETED");

  const getMerchantDetails = async (merchantId) => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getMerchantByUUID/${merchantId}`,
        { withCredentials: true }

      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getCustomerDetails = async (customerId) => {
    try {
      const response = await axios.get(

        `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getCustomerByUUID/${customerId}`,
        { withCredentials: true }

      );
      return response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const renderButtons = (orderId, status) => {
    switch (status) {
      case "READY":
        return (
          <div className="flex flex-column align-items-end">
            <Button
              label="Accept Order"
              className="p-button-success m-3"
              onClick={() => updateOrderStatus(orderId, "DELIVERY_ACCEPTED")}
            />
          </div>
        );
      case "DELIVERY_ACCEPTED":
        return (
          <Button
            label="Order Picked Up"
            className="p-button-success m-3"
            onClick={() => updateOrderStatus(orderId, "DELIVERY_PICKED_UP")}
          />
        );
      case "DELIVERY_PICKED_UP":
        return (
          <Button
            label="Order Completed"
            className="p-button-success m-3"
            onClick={() => updateOrderStatus(orderId, "COMPLETED")}
          />
        );
      case "COMPLETED":
        return (
          <Button
            label="Order Completed"
            className="p-button-secondary"
            disabled
          />
        );
      default:
        return null;
    }
  };

  const footer = (order) => (
    <div>
      <Tooltip
        target=".navigate-tooltip"
        content="Click to navigate to merchant."
        position="bottom"
      ></Tooltip>
      <div className="flex ">
        <div
          className="mr-2 mt-2 navigate-tooltip "
          onClick={() =>
            handleDirections(order?.merchantLatitude, order?.merchantLongitude)
          }
        >
          <i className="pi pi-arrow-circle-right block mt-2 navigate-tooltip cursor-pointer"></i>
        </div>
        <div>
          <Message severity="info" text="Click To Navigate Merchant." />
        </div>
      </div>
      <Tooltip
        target=".navigate-tooltip"
        content="Click to navigate to Customer."
        position="bottom"
      ></Tooltip>
      <div className="flex ">
        <div
          className="mr-2 mt-2 navigate-tooltip "
          onClick={() =>
            handleDirections(order?.customerLatitude, order?.customerLongitude)
          }
        >
          <i className="pi pi-arrow-circle-right block mt -2 navigate-tooltip cursor-pointer"></i>
        </div>
        <div>
          <Message severity="info" text="Click To Navigate Customer." />
        </div>
      </div>
    </div>
  );

  if(isLoading){
    return <div>Loading...</div>;
  }
    if(userType && userType != 'delivery'){
        return <ForbiddenPage/>
    }
  if (isValidSession) {
    return (
      <div>
        <h2>Ongoing Orders</h2>
        <div className="p-grid">
          {ongoingOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-4">
              <Card title={`Order ID: ${order.orderId}`} footer={footer(order)}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p>Status: {order.status}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>
                      Date: {new Date(order.createdDate).toLocaleDateString()}
                    </p>
                    <p>Customer: {order.customerDetails?.name}</p>
                    <p>Merchant: {order.merchantDetails?.name}</p>
                  </div>
                  {renderButtons(order.orderId, order.status)}
                </div>
              </Card>
            </div>
          ))}
        </div>

        <h2>Past Orders</h2>
        <div className="p-grid">
          {pastOrders.map((order) => (
            <div key={order.orderId} className="col-12 md:col-4">
              <Card title={`Order ID: ${order.orderId}`} footer={footer(order)}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <p>Status: {order.status}</p>
                    <p>Total Price: ${order.totalPrice}</p>
                    <p>
                      Date: {new Date(order.createdDate).toLocaleDateString()}
                    </p>
                    <p>Customer: {order.customerDetails?.name}</p>
                    <p>Merchant: {order.merchantDetails?.name}</p>
                  </div>
                  {renderButtons(order.orderId, order.status)}
                </div>
              </Card>
            </div>
          ))}
        </div>
        <Toast ref = {toast} position={"top-right"}/>
      </div>
    );
  } else {
    router.push('/delivery/login');
    return null;
  }
};

export default Orders;
