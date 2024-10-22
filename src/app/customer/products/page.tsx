'use client';
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useRef, useState, useEffect } from 'react'
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Image } from 'primereact/image';
import { Paginator } from "primereact/paginator";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Knob } from "primereact/knob";
import { ProgressSpinner } from "primereact/progressspinner";
import axios from 'axios';
import { useSearchParams } from 'next/navigation'

const Page = () => {
  const searchParams = useSearchParams();
  const categoryId  = searchParams.get('categoryId');
  const maxPrice = searchParams.get('maxPrice');
  const minPrice = searchParams.get('minPrice');
  const pincode = searchParams.get('pincode');
  const searchText = searchParams.get('searchText');

  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(`${process.env.NEXT_PUBLIC_API_PRODUCTS_URL}/api/products/filter`, {
          categoryId,
          maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
          minPrice: minPrice ? parseFloat(minPrice) : undefined,
          pincode,
          searchText
        });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();  
  }, [categoryId, maxPrice, minPrice, pincode, searchText]);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
  });
  const [value, setValue] = useState(0);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
const onMapLoad = (map: google.maps.Map) => {
  mapRef.current = map;
};

    const header = (imageUrl: string): JSX.Element => (
      <Image
        alt="Card"
        src={imageUrl}
      />
    );
  const containerStyle = {
    width: "400px",
    height: "400px",
  };
  const center = {
    lat: 1.3221003410646806,
    lng: 103.93893630081222,
  };
  const mapRef = useRef<google.maps.Map | null>(null);
  const panToLocation = (lat: number, lng: number) => {
    if (mapRef.current) {
      mapRef.current.panTo({ lat, lng });
      mapRef.current.setZoom(15); // Adjust zoom level if necessary
    }
  };
  const positions = [
   { id: 1, name: "Marina Bay Sands", lat: 1.2834, lng: 103.8607 },
  { id: 2, name: "Gardens by the Bay", lat: 1.2816, lng: 103.8636 },
  { id: 3, name: "Sentosa Island", lat: 1.2494, lng: 103.8303 },
  { id: 4, name: "Changi Airport", lat: 1.3644, lng: 103.9915 },]

    const footer = (
      <div className="flex">
        <div className='mt-7'>
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
  const [first, setFirst] = useState(0);
  const [rows, setRows] = useState(10);

  const onPageChange = (event) => {
    setFirst(event.first);
    setRows(event.rows);
  };
  return (
    <div className="grid">
      <div className="col-6">
        <div className="grid">
        {products.map(product => (
          <div className="col-6">
            <Card header={header(product.imageUrl)} footer={footer}>
              {" "}
              <h2>{product.productName}</h2>
              <p className="m-0">
                {product.productDescription}
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
                  mapContainerStyle={containerStyle}
                  onLoad={onMapLoad}
                  options={{
                    streetViewControl: false,
                    fullscreenControl: false,
                    disableDefaultUI: true,
                    zoomControl: true,
                    mapTypeControl: false,
                    scaleControl: false,
                  }}
                >
                  {positions.map((position) => (
                    <Marker
                      key={position.id}
                      position={{ lat: position.lat, lng: position.lng }}
                      onClick={() => setSelectedMarker(position.id)}
                    />
                  ))}
                  {positions.map((location) =>
                    selectedMarker === location.id ? (
                      <InfoWindow
                        key={location.id}
                        position={{ lat: location.lat, lng: location.lng }}
                      >
                        <div>
                          <small>{location.name}</small>
                          <br />
                          <a
                            href={`https://www.google.com/maps?q=@${location.lat},${location.lng}`}
                            target="_blank"
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
                className="col-4 mt-2 overflow-scroll	"
                style={{
                  border: "1px solid ",
                  height: "400px",
                  marginLeft: "5px",
                }}
              >
                <ul>
                  {positions.map((position) => (
                    <li
                      key={position.id}
                      onClick={() => panToLocation(position.lat, position.lng)}
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
        <Paginator
          first={first}
          rows={rows}
          totalRecords={products.length}
          onPageChange={onPageChange}
        />
      </div>
    </div>
  );
}

export default Page;