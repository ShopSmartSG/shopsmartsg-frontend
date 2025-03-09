"use client";
import React, { useRef, useState, useEffect, Suspense } from "react";
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
import { useRouter } from "next/navigation";
import ForbiddenPage from "../../../../shared/components/ForbiddenPage/ForbiddenPage";

// Create a separate component that uses useSearchParams
const ProductsContent = () => {
    const searchParams = useSearchParams();
    const categoryId = searchParams.get("categoryId");
    const maxPrice = searchParams.get("maxPrice");
    const minPrice = searchParams.get("minPrice");
    const pincode = searchParams.get("pincode");
    const searchText = searchParams.get("searchText");

    const [merchants, setMerchants] = useState<string[]>([]);
    const [isValidSession, setValidSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const toast = useRef(null);

    interface Product {
        productId: string;
        productName: string;
        productDescription: string;
        imageUrl: string;
        merchantId: string;
        originalPrice: string;
        listingPrice: string;
    }

    let userId: string | null = null;
    try {
        userId = localStorage.getItem("userId");
    } catch (error) {
        console.error("Error accessing localStorage:", error);
    }

    interface ProductQuantity {
        [key: string]: number;
    }

    const [products, setProducts] = useState<Product[]>([]);
    const [productQuantities, setProductQuantities] = useState<ProductQuantity>({});

    interface Coordinate {
        id: string;
        name: string;
        lat: number;
        lng: number;
    }

    const [coordinates, setCoordinates] = useState<Coordinate[]>([]);
    const [userType, setUserType] = useState("");
    const [first, setFirst] = useState(0);
    const [rows] = useState(4);

    const onPageChange = (event: { first: number; rows: number }) => {
        setFirst(event.first);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.post(

                    `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/searchProducts`,

                    {
                        categoryId,
                        maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
                        minPrice: minPrice ? parseFloat(minPrice) : undefined,
                        pincode,
                        searchText,
                    },
                    { withCredentials: true }
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
        console.log(product);

        try {
            const response = await axios.put(

                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/addToCart/${userId}/merchant/${product.merchantId}`,

                {
                    productId: product.productId,
                    quantity,
                    price: product.listingPrice,
                },
                { withCredentials: true }
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
            console.log(error);
        }
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

    const router = useRouter();

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
    }, []);

    useEffect(() => {
        const getMerchantCoordinates = async () => {
            if (merchants.length > 0) {
                const coords = await Promise.all(
                    merchants.map(async (merchant) => {
                        try {
                            const response = await axios.get(

                                `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getMerchantByUUID/${merchant}`,
                                { withCredentials: true }

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

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (userType && userType != 'customer') {
        return <ForbiddenPage />;
    }

    if (isValidSession) {
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
    }
    else {
        router.push("/customer/login");
        return null;
    }
};

const Page = () => {
    return (
        <Suspense fallback={<div>Loading products...</div>}>
            <ProductsContent />
        </Suspense>
    );
};

export default Page;