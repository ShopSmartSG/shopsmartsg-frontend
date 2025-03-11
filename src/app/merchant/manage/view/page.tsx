/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useEffect, useRef } from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useRouter } from "next/navigation";
import "./page.css";
import axios from "axios";
import { Toast } from "primereact/toast";
import { Message } from "primereact/message";
import { InputNumber } from "primereact/inputnumber";
import ForbiddenPage from "../../../../../shared/components/ForbiddenPage/ForbiddenPage";
import {Image} from "primereact/image";

const ProductCatalog = () => {
  const [products, setProducts] = useState({});
  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    originalPrice: 0,
    description: "",
    quantity: 0,
    listingPrice: 0,
    pincode: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const toast = useRef(null);
  const [isValidSession, setValidSession] = useState(false);
  const [userType, setUserType] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const router = useRouter();

  // Handlers for delete and update
  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      ...product,
      originalPrice: product.price,
    });
    setUpdateVisible(true);
  };

  const handleUpdateSubmit = async () => {
    const updatedProductData = {
      productId: formData.id,
      productName: formData.name,
      categoryId: selectedProduct.categoryId,
      imageUrl: selectedProduct.image,
      productDescription: formData.description,
      originalPrice: formData.originalPrice,
      listingPrice: formData.listingPrice,
      availableStock: formData.quantity,
      pincode: formData.pincode,
      merchantId: selectedProduct.merchantId,
    };
    try {
      await axios.put(

          `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getMerchantByProductId/${updatedProductData.productId}`,
          updatedProductData,
          { withCredentials: true }
      );
      setProducts((prevProducts) => {
        const updatedProducts = { ...prevProducts };
        for (const category in updatedProducts) {
          updatedProducts[category] = updatedProducts[category].map((product) =>
              product.id === updatedProductData.productId
                  ? { ...product, ...updatedProductData }
                  : product
          );
        }
        return updatedProducts;
      });
      setUpdateVisible(false);
      toast.current.show({
        severity: "success",
        summary: "Product Updated",
        detail: "Product updated successfully!",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast.current.show({
        severity: "error",
        summary: "Update Failed",
        detail: "Failed to update product. Please try again.",
      });
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const response = await axios.delete(

          `${process.env.NEXT_PUBLIC_CentralService_API_URL}api/deleteProduct/${selectedProduct.id}`,
          { withCredentials: true }

      );
      if (response.status === 200) {
        toast.current.show({
          severity: "success",
          summary: "Product Deleted",
          detail: "Product deleted successfully",
          life: 3000,
        });
        setVisible(false);
        setSelectedProduct(null);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Product Deletion Failed",
        detail: "Please Try Again!!",
      });
      console.log("error", error);
    }
  };

  useEffect(() => {
    const fetchProducts = async() => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getProductCatalog`, {
          withCredentials: true
        });
        const data = response.data;

        // Transform the flat product array into categories
        const categorizedProducts = {};

        data.forEach(product => {
          const categoryName = product.category.categoryName;

          // Initialize category array if it doesn't exist
          if (!categorizedProducts[categoryName]) {
            categorizedProducts[categoryName] = [];
          }

          // Add the product to its category, with structure matching your component
          categorizedProducts[categoryName].push({
            id: product.productId,
            name: product.productName,
            price: product.listingPrice,
            originalPrice: product.originalPrice,
            description: product.productDescription,
            image: product.imageUrl,
            quantity: product.availableStock,
            categoryId: product.category.categoryId,
            merchantId: product.merchantId,
            pincode: product.pincode
          });
        });

        setProducts(categorizedProducts);
      } catch(error) {
        console.log(error, "Error Fetching Data");
        toast.current.show({
          severity: "error",
          summary: "Error Fetching Data",
          detail: "Please Try Again!!"
        });
      }
    }
    fetchProducts();

  }, []);

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


    if (isLoading) {
        return <div>Loading...</div>;
    }
    if(userType && userType != 'merchant'){
      return <ForbiddenPage/>
    }
    if(isValidSession){
      return (
          <div className="p-grid p-p-4">
            <Toast ref={toast} />
            <h1 className="p-col-12">Product Catalog</h1>
            {Object.keys(products).length > 0 ? (
                Object.keys(products).map((categoryName) => (
                    <Panel
                        key={categoryName}
                        header={categoryName}
                        className="p-col-12 p-mb-4"
                    >
                      <div className="p-grid">
                        {products[categoryName].map((product) => (
                            <div
                                key={product.id}
                                className="p-col-12 p-md-6 p-lg-4 p-p-3 mt-2"
                            >
                              <Card
                                  header={<Image alt={product.name} src={product.image}  className={"h-20rem w-20rem"} />}
                                  title={product.name}
                                  subTitle={`Price: $${product.price}`}
                                  style={{ padding: "1rem" }}
                              >
                                <p>Quantity: {product.quantity}</p>
                                <p>{product.description}</p>
                                <div className="grid ">
                                  <div>
                                    <Button
                                        label="Update"
                                        className="p-button-success"
                                        onClick={() => handleUpdateClick(product)}
                                    />
                                  </div>
                                  <div >
                                    <Button
                                        label="Delete"
                                        className="p-button-danger"
                                        onClick={() => handleDeleteClick(product)}
                                    />
                                  </div>


                                </div>
                              </Card>
                            </div>
                        ))}
                      </div>
                    </Panel>
                ))
            ) : (
                <Message severity="info" text="No products available." />
            )}

            {/* Update Dialog */}
            <Dialog
                visible={updateVisible}
                header="Update Product"
                onHide={() => setUpdateVisible(false)}
                style={{ width: "50vw" }}
            >
              <div className="p-fluid p-grid p-p-3">
                <div className="p-field p-col-12">
                  <label htmlFor="name">Name</label>
                  <InputText
                      id="name"
                      value={formData.name}
                      onChange={(event) =>
                          setFormData({ ...formData, name: event.target.value })
                      }
                  />
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="originalPrice">Original Price</label>
                  <InputNumber
                      id="originalPrice"
                      value={formData.originalPrice}
                      onValueChange={(e) =>
                          setFormData({ ...formData, originalPrice: e.value })
                      }
                  />
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="listingPrice">Listing Price</label>
                  <InputNumber
                      id="listingPrice"
                      value={formData.listingPrice}
                      onValueChange={(e) =>
                          setFormData({ ...formData, listingPrice: e.value })
                      }
                  />
                </div>
                <div className="p-field p-col-12">
                  <label htmlFor="description">Description</label>
                  <InputText
                      id="description"
                      value={formData.description}
                      onChange={(event) =>
                          setFormData({ ...formData, description: event.target.value })
                      }
                  />
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="quantity">Quantity</label>
                  <InputNumber
                      id="quantity"
                      value={formData.quantity}
                      onValueChange={(e) =>
                          setFormData({ ...formData, quantity: e.value })
                      }
                  />
                </div>
                <div className="p-field p-col-12 p-md-6">
                  <label htmlFor="pincode">Pincode</label>
                  <InputText
                      id="pincode"
                      value={formData.pincode}
                      onChange={(event) =>
                          setFormData({ ...formData, pincode: event.target.value })
                      }
                  />
                </div>
                <div className="p-col-12 p-d-flex p-jc-end">
                  <Button
                      label="Cancel"
                      className="p-button-text"
                      onClick={() => setUpdateVisible(false)}
                  />
                  <Button
                      label="Save"
                      className="p-button-primary"
                      onClick={handleUpdateSubmit}
                  />
                </div>
              </div>
            </Dialog>
            <Dialog
                visible={visible}
                header="Confirm Deletion"
                onHide={() => setVisible(false)}
                style={{ width: "30vw" }}
            >
              <p>Are you sure you want to delete {selectedProduct?.name}?</p>
              <div className="p-d-flex p-jc-end">
                <Button
                    label="Cancel"
                    className="p-button-text"
                    onClick={() => setVisible(false)}
                />
                <Button
                    label="Delete"
                    className="p-button-danger"
                    onClick={handleDeleteSubmit}
                />
              </div>
            </Dialog>
          </div>
      );
    }
  else{
      router.push('/merchant/login');
      return null;
      }
};

export default ProductCatalog;