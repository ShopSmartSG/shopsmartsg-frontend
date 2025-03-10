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
            {/* Add conditional rendering for merchantDetails */}
            <p className="mb-2">
              Merchant: {merchantDetails ? merchantDetails.name : "Loading..."}
            </p>
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
                  {/* Also add conditional check here before using merchantDetails */}
                  {merchantDetails && (
                      <div
                          className="mr-2 mt-2 navigate-tooltip"
                          onClick={() =>
                              handleDirections(
                                  merchantDetails.latitude,
                                  merchantDetails.longitude
                              )
                          }
                      >
                        <i className="pi pi-arrow-circle-right block mt-2 navigate-tooltip cursor-pointer"></i>
                      </div>
                  )}
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