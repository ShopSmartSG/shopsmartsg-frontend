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
    const toast = useRef(null);
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const maxPrice = searchParams.get("maxPrice");
    const minPrice = searchParams.get("minPrice");
    const pincode = searchParams.get("pincode");
    const searchText = searchParams.get("searchText");

    const [merchants, setMerchants] = useState([]);
    const [products, setProducts] = useState([]);
    const [productQuantities, setProductQuantities] = useState({});
    const [coordinates, setCoordinates] = useState([]);
    const [first, setFirst] = useState(0);
    const [rows] = useState(4);
    const [selectedMarker, setSelectedMarker] = useState(null);

    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const dummyProducts = [
                    {
                        productId: "1",
                        productName: "Dummy Product 1",
                        productDescription: "Description for Dummy Product 1",
                        imageUrl: "https://via.placeholder.com/150",
                        merchantId: "merchant1",
                        originalPrice: "20.00",
                        listingPrice: "15.00",
                    },
                    {
                        productId: "2",
                        productName: "Dummy Product 2",
                        productDescription: "Description for Dummy Product 2",
                        imageUrl: "https://via.placeholder.com/150",
                        merchantId: "merchant2",
                        originalPrice: "30.00",
                        listingPrice: "25.00",
                    },
                    {
                        productId: "3",
                        productName: "Dummy Product 3",
                        productDescription: "Description for Dummy Product 3",
                        imageUrl: "https://via.placeholder.com/150",
                        merchantId: "merchant3",
                        originalPrice: "40.00",
                        listingPrice: "35.00",
                    },
                ];
                setProducts(dummyProducts);
                const merchantIds = dummyProducts.map((product) => product.merchantId);
                const uniqueMerchantIds = Array.from(new Set(merchantIds));
                setMerchants(uniqueMerchantIds);

                const initialQuantities = {};
                dummyProducts.forEach((product) => {
                    initialQuantities[product.productId] = 0;
                });
                setProductQuantities(initialQuantities);
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        };

        fetchProducts();
    }, [categoryId, maxPrice, minPrice, pincode, searchText]);

    const handleQuantityChange = (productId, newValue) => {
        setProductQuantities((prev) => ({
            ...prev,
            [productId]: newValue,
        }));
    };

    const addToCart = async (product) => {
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

        try {
            const response = await axios.put(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}/addToCart/${userId}/merchant/${product.merchantId}`,
                {
                    productId: product.productId,
                    quantity,
                    price: product.listingPrice,
                }
            );
            if (response.status === 200) {
                toast.current?.show({
                    severity: "success",
                    summary: "Success",
                    detail: `Added ${quantity} ${product.productName} to cart`,
                    life: 3000,
                });
                handleQuantityChange(product.productId, 0);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const onPageChange = (event) => {
        setFirst(event.first);
    };

    const getCurrentPageProducts = () => {
        return products.slice(first, first + rows);
    };

    // Map-related logic
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    });

    const mapRef = useRef(null);
    const center = {
        lat: 1.31901,
        lng: 103.884983,
    };

    const panToLocation = (lat, lng) => {
        if (mapRef.current) {
            mapRef.current.panTo({ lat, lng });
            mapRef.current.setZoom(15);
        }
    };

    const handleMarkerClick = (id) => {
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
                setCoordinates(validCoords);
            }
        };

        getMerchantCoordinates();
    }, [merchants]);

    return (
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            {/* Main Content */}
            <div className="grid flex-grow-1">
                {/* Left Section: Products */}
                <div className="col-12 md:col-8">
                    <Toast ref={toast} />
                    <div className="grid">
                        {getCurrentPageProducts().map((product, id) => (
                            <div key={id} className="col-12 md:col-6 lg:col-3">
                                <Card>
                                    <Image src={product.imageUrl} alt={product.productName} width="100%" />
                                    <h3>{product.productName}</h3>
                                    <p>{product.productDescription}</p>
                                    <p>SGD {product.listingPrice}</p>
                                    <Knob
                                        value={productQuantities[product.productId] || 0}
                                        onChange={(e) =>
                                            handleQuantityChange(product.productId, e.value)
                                        }
                                        min={0}
                                        max={100}
                                        size={100}
                                    />
                                    <Button
                                        label="Add to Cart"
                                        onClick={() => addToCart(product)}
                                    />
                                </Card>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right Section: Map */}
                <div className="col-12 md:col-4">
                    {!isLoaded ? (
                        <ProgressSpinner />
                    ) : (
                        <GoogleMap
                            mapContainerStyle={{ height: "400px", width: "100%" }}
                            center={center}
                            zoom={12}
                            onLoad={(map) => (mapRef.current = map)}
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
                                coordinates
                                    .filter((location) => location.id === selectedMarker)
                                    .map((location) => (
                                        <InfoWindow
                                            key={location.id}
                                            position={{ lat: location.lat, lng: location.lng }}
                                            onCloseClick={() => setSelectedMarker(null)}
                                        >
                                            <div>
                                                <h4>{location.name}</h4>
                                                <p>View Directions on Google Maps</p>
                                            </div>
                                        </InfoWindow>
                                    ))}
                        </GoogleMap>
                    )}
                </div>
            </div>

            {/* Paginator at the Bottom */}
            <div
                className="flex justify-content-center align-items-center"
                style={{
                    padding: "1rem",
                    background: "#fff",
                    boxShadow: "0 -2px 5px rgba(0,0,0,0.1)",
                    position: "sticky",
                    bottom: "0",
                    zIndex: 10,
                }}
            >
                <Paginator
                    first={first}
                    rows={rows}
                    totalRecords={products.length}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    );
};

export default Page;