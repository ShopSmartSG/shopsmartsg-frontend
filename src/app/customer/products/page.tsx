"use client";
import React, { useRef, useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Paginator } from "primereact/paginator";
import { Toast } from "primereact/toast";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { Knob } from "primereact/knob";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import FilterSearch from "../../../../shared/components/filter/filterSearch";

const Page = () => {
  const toast = useRef<Toast>(null);
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");
  const maxPrice = searchParams.get("maxPrice");
  const minPrice = searchParams.get("minPrice");
  const pincode = searchParams.get("pincode");
  const searchText = searchParams.get("searchText");
  const [merchants, setMerchants] = useState<string[]>([]);

  interface Product {
    productId: string;
    productName: string;
    productDescription: string;
    imageUrl: string;
    merchantId: string;
    originalPrice: string;
    listingPrice: string;
  }
  const userId = localStorage.getItem("userId");
  // const userType = localStorage.getItem("userType");
  interface ProductQuantity {
    [key: string]: number;
  }

  const [products, setProducts] = useState<Product[]>([]);
  const [productQuantities, setProductQuantities] = useState<ProductQuantity>(
    {}
  );

  interface Coordinate {
    id: string;
    name: string;
    lat: number;
    lng: number;
  }

  const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
  const [first, setFirst] = useState(0);
  const [rows] = useState(4);
  // const getCurrentPageProducts = () => {
  //   return products.slice(first, first + rows);
  // };
  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_CentralService_API_URL}/searchProducts`,
          {
            categoryId,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            pincode,
            searchText,
          }
        );

        const merchantIds = response.data.map(
          (product: Product) => product.merchantId
        );
        const uniqueMerchantIds: string[] = Array.from(new Set(merchantIds));
        setMerchants(Array.from(new Set(uniqueMerchantIds)));
        setProducts(Array.from(new Set(response.data)));

        // Initialize quantities for all products
        const initialQuantities: ProductQuantity = {};
        response.data.forEach((product: Product) => {
          initialQuantities[product.productId] = 0;
        });
        setProductQuantities(initialQuantities);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryId, maxPrice, minPrice, pincode, searchText]);

  const handleQuantityChange = (productId: string, newValue: number) => {
    setProductQuantities((prev) => ({
      ...prev,
      [productId]: newValue,
    }));
  };

  const addToCart = async (product: Product) => {
    const quantity = productQuantities[product.productId];

    if (quantity <= 0) {
      toast.current?.show({
        severity: "warn",
        summary: "Warning",
        detail: "Please select a quantity greater than 0",
        life: 3000,
      });
      return;
    }
    console.log(product)

    try {
const response = await axios.put(
  `${process.env.NEXT_PUBLIC_CentralService_API_URL}/addToCart/${userId}/merchant/${product.merchantId}`,
  {
    productId: product.productId,
    quantity,
    price: product.listingPrice,
  }
);
      if (response.status == 200) {
        toast.current?.show({
          severity: "success",
          summary: "Success",
          detail: `Added ${quantity} ${product.productName} to cart`,
          life: 3000,
        });
        // Reset quantity after successful addition
        handleQuantityChange(product.productId, 0);
      }
    }
    catch (error) {
      console.log(error)
    }
    // try {
    //   // Assuming you have an API endpoint for adding to cart
    //   await axios.post(`${process.env.NEXT_PUBLIC_CART_API_URL}/cart/add`, {
    //     productId: product.productId,
    //     quantity: quantity,
    //   });

    //   toast.current?.show({
    //     severity: "success",
    //     summary: "Success",
    //     detail: `Added ${quantity} ${product.productName} to cart`,
    //     life: 3000,
    //   });

    //   // Reset quantity after successful addition
    //   handleQuantityChange(product.productId, 0);
    // } catch (error) {
    //   console.error("Error adding to cart:", error);
    //   toast.current?.show({
    //     severity: "error",
    //     summary: "Error",
    //     detail: "Failed to add item to cart",
    //     life: 3000,
    //   });
    // }
  };

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });

  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const center = {
    lat: 1.31901,
    lng: 103.884983,
  };

  const panToLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15);
    }
  };

  const handleMarkerClick = (id: string) => {
    setSelectedMarker(id);
    panToLocation(
      coordinates.find((coord) => coord.id === id)?.lat || center.lat,
      coordinates.find((coord) => coord.id === id)?.lng || center.lng
    );
  };

  useEffect(() => {
    const getMerchantCoordinates = async () => {
      if (merchants.length > 0) {
        const coords = await Promise.all(
          merchants.map(async (merchant) => {
            try {
              const response = await axios.get(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}/getMerchant/${merchant}`
              );
              const data = response.data;
              return {
                id: data.merchantId,
                name: data.name,
                lat: data.latitude,
                lng: data.longitude,
              };
            } catch (error) {
              console.error("Error fetching merchant coordinates:", error);
              return null;
            }
          })
        );

        const validCoords = coords.filter((coord) => coord !== null);
        setCoordinates((prevCoords) => [...prevCoords, ...validCoords]);
      }
    };

    getMerchantCoordinates();
  }, [merchants]);

  const header = (imageUrl: string): JSX.Element => (
    <Image alt="Card" src={imageUrl} />
  );

  const footer = (product: Product): JSX.Element => (
    <div className="flex">
      <div className="mt-7">
        <Button
          label="Add To Cart"
          icon="pi pi-shopping-cart"
          onClick={() => addToCart(product)}
        />
      </div>
      <div className="ml-2">
        <Knob
          value={productQuantities[product.productId]}
          size={60}
          className="ml-4"
          onChange={(e) => handleQuantityChange(product.productId, e.value)}
        />
        <div className="flex gap-2">
          <Button
            icon="pi pi-plus"
            onClick={() =>
              handleQuantityChange(
                product.productId,
                Math.min(productQuantities[product.productId] + 1, 100)
              )
            }
            disabled={productQuantities[product.productId] === 100}
          />
          <Button
            icon="pi pi-minus"
            onClick={() =>
              handleQuantityChange(
                product.productId,
                Math.max(productQuantities[product.productId] - 1, 0)
              )
            }
            disabled={productQuantities[product.productId] === 0}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <FilterSearch />
      <div className="grid">
        <div className="col-6">
          <div className="grid">
            {products.map((product, id) => (
              <div className="col-6" key={id}>
                <Card
                  header={header(product.imageUrl)}
                  footer={footer(product)}
                >
                  <h2>{product.productName}</h2>
                  <p className="m-0">{product.productDescription}</p>
                  <p className="mt-4">
                    <b>SGD {product.listingPrice}</b>
                  </p>
                </Card>
              </div>
            ))}
          </div>
          <div className="card">
            <Paginator
              first={first}
              rows={rows}
              totalRecords={products.length}
              onPageChange={onPageChange}
              template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            />
          </div>
        </div>
        <div className="col-6">
          <Card style={{ height: "124.5vh" }}>
            {!isLoaded ? (
              <ProgressSpinner
                style={{ width: "50px", height: "50px" }}
                strokeWidth="8"
                fill="var(--surface-ground)"
                animationDuration=".5s"
              />
            ) : (
              <div className="grid" style={{ marginTop: "20vh" }}>
                <div className="col-7">
                  <GoogleMap
                    zoom={15}
                    center={center}
                    mapContainerStyle={{ width: "400px", height: "400px" }}
                    onLoad={(map) => {
                      mapRef.current = map;
                    }}
                    options={{
                      streetViewControl: false,
                      fullscreenControl: false,
                      disableDefaultUI: true,
                      zoomControl: true,
                      mapTypeControl: false,
                      scaleControl: false,
                    }}
                  >
                    {coordinates.map((position) => (
                      <Marker
                        key={position.id}
                        position={{ lat: position.lat, lng: position.lng }}
                        onClick={() => handleMarkerClick(position.id)}
                      />
                    ))}

                    {selectedMarker &&
                      coordinates.map((location) =>
                        selectedMarker === location.id ? (
                          <InfoWindow
                            key={location.id}
                            position={{ lat: location.lat, lng: location.lng }}
                            onCloseClick={() => setSelectedMarker(null)}
                          >
                            <div>
                              <small>{location.name}</small>
                              <br />
                              <a
                                href={`https://www.google.com/maps?q=@${location.lat},${location.lng}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View Directions on Google Maps
                              </a>
                            </div>
                          </InfoWindow>
                        ) : null
                      )}
                  </GoogleMap>
                </div>
                <div
                  className="col-4 mt-2 overflow-scroll"
                  style={{
                    border: "1px solid",
                    height: "400px",
                    marginLeft: "5px",
                  }}
                >
                  <ul>
                    {coordinates.map((position) => (
                      <li
                        key={position.id}
                        onClick={() =>
                          panToLocation(position.lat, position.lng)
                        }
                        className="cursor-pointer"
                      >
                        {position.name}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Page;
