'use client'
import React, { useRef, useState, useEffect } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { Paginator } from "primereact/paginator";
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

  const [products, setProducts] = useState<Product[]>([]);
  interface Coordinate {
    id: string;
    name: string;
    lat: number;
    lng: number;
  }

  const [coordinates, setCoordinates] = useState<Coordinate[]>([]); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/products/filter`,
          {
            categoryId,
            maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
            minPrice: minPrice ? parseFloat(minPrice) : undefined,
            pincode,
            searchText,
          }
        );

        const merchantIds = response.data.map((product) => product.merchantId);
        const uniqueMerchantIds: string[] = Array.from(new Set(merchantIds));
        console.log("uniqueMerchantIds:", uniqueMerchantIds);
        setMerchants(uniqueMerchantIds);
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, [categoryId, maxPrice, minPrice, pincode, searchText]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [value, setValue] = useState(0);
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
               `${process.env.NEXT_PUBLIC_PROFILEMGMT_API_URL}/merchants/${merchant}`
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
             return null; // Handle error gracefully by returning null.
           }
         })
       );

       // Filter out any null values from failed requests.
       const validCoords = coords.filter((coord) => coord !== null);

       // Append new coordinates to the existing ones.
       setCoordinates((prevCoords) => [...prevCoords, ...validCoords]);
     }
   };


    getMerchantCoordinates();
  }, [merchants]);

  const header = (imageUrl: string): JSX.Element => (
    <Image alt="Card" src={imageUrl} />

  );

  const footer = (
    <div className="flex">
      <div className="mt-7">
        <Button label="Add To Cart" icon="pi pi-check" />
      </div>
      <div className="ml-2">
        <Knob value={value} size={60} className="ml-4" />
        <div className="flex gap-2">
          <Button
            icon="pi pi-plus"
            onClick={() => setValue(value + 1)}
            disabled={value === 100}
          />
          <Button
            icon="pi pi-minus"
            onClick={() => setValue(value - 1)}
            disabled={value === 0}
          />
        </div>
      </div>
    </div>
  );
  return (
    <div>
      <FilterSearch/>
      <div className="grid">
        <div className="col-6">
          <div className="grid">
            {products.map((product, id) => (
              <div className="col-6" key={id}>
                <Card header={header(product.imageUrl)} footer={footer}>
                  <h2>{product.productName}</h2>
                  <p className="m-0">{product.productDescription}</p>
                  <p className="mt-4\">
                    <b>SGD {product.listingPrice}</b>
                  </p>
                </Card>
              </div>
            ))}
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
        <div className="card col-12">
          <Paginator first={0} rows={10} totalRecords={products.length} />
        </div>
      </div>
    </div>
  );
};

export default Page;
