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
import { getCookie } from "cookies-next";

import { Message } from "primereact/message";
import { InputNumber } from "primereact/inputnumber";
import { useAdminContext } from "@/context/AdminContext";

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
  const toast = useRef<Toast>(null);
  const { adminData, userType } = useAdminContext();

  const handleDeleteClick =  (product) => {
    
    
    setSelectedProduct(product);
    setVisible(true);
  
  };

  const userId = localStorage.getItem("userId");
  const userTyped = localStorage.getItem("userType");

  const router = useRouter();
  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      ...product,
      originalPrice: product.price,
    });
    setUpdateVisible(true);
  };
  const [merchantId, setMerchantId] = useState("");
 

  const myCookies = getCookie('userId', {
    
  })


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
        `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/${updatedProductData.merchantId}/products/${updatedProductData.productId}`,
        {
          ...updatedProductData
        }
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

  useEffect(() => {
    const getMerchantProducts = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/${userId}/products`
        );

        const groupByCategory = response.data.reduce((acc, product) => {
          const categoryName = product.category.categoryName;
          if (!acc[categoryName]) acc[categoryName] = [];
          acc[categoryName].push({
            id: product.productId,
            name: product.productName,
            price: product.originalPrice,
            listingPrice: product.listingPrice,
            description: product.productDescription,
            quantity: product.availableStock,
            image: product.imageUrl,
            merchantId: product.merchantId,
            pincode: product.pincode,
            categoryId: product.category.categoryId,
          });
          return acc;
        }, {});

        setProducts(groupByCategory);
      } catch (error) {
        console.error("Error fetching merchant products:", error);
      }
    };

    getMerchantProducts();
  }, []);

  const handleDeleteSumit = async () => {
     try {
       const response = await axios.delete(
         `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/${selectedProduct.merchantId}/products/${selectedProduct.id}`
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
       console.log("error", error); // error
     }
  }

  if (userTyped === "MERCHANT" && (userId != null || userId != "")) {
    return (
      <fieldset style={{ height: "100vh" }}>
        <legend>Product Catalog</legend>
        {Object.keys(products).length > 0 ? (
          Object.keys(products).map((categoryName) => (
            <div key={categoryName}>
              <div className="p-grid p-dir-col p-2">
                {Object.keys(products).map((categoryName) => (
                  <div key={categoryName}>
                    <Panel header={categoryName}>
                      <div className="grid">
                        {products[categoryName].map((product) => (
                          <div key={product.id} className="col-4">
                            <Card
                              title={product.name}
                              subTitle={`$${product.listingPrice}`}
                              header={
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  width={100}
                                  height={100}
                                />
                              }
                            >
                              <p
                                className="p-m-0"
                                style={{ lineHeight: "1.5" }}
                              >
                                <span className="font-weight-bold">
                                  Quantity:
                                </span>{" "}
                                {product.quantity}
                              </p>
                              <p
                                className="p-m-0"
                                style={{ lineHeight: "1.5" }}
                              >
                                {product.description}
                              </p>
                              <div className="p-d-flex p-jc-between p-mt-2">
                                <Button
                                  label="Update"
                                  className="p-button-primary mr-2"
                                  onClick={() => handleUpdateClick(product)}
                                />
                                <Button
                                  icon="pi pi-trash"
                                  className="p-button-danger ml-2"
                                  onClick={() => handleDeleteClick(product)}
                                />
                              </div>
                            </Card>
                          </div>
                        ))}
                      </div>
                    </Panel>
                    <Divider />
                  </div>
                ))}
              </div>

              <Dialog
                header="Update Product"
                visible={updateVisible}
                style={{ width: "450px" }}
                footer={
                  <div>
                    <Button
                      label="Cancel"
                      icon="pi pi-times"
                      onClick={() => setUpdateVisible(false)}
                      className="p-button-text"
                    />
                    <Button
                      label="Save"
                      icon="pi pi-check"
                      onClick={handleUpdateSubmit}
                      autoFocus
                    />
                  </div>
                }
                onHide={() => setUpdateVisible(false)}
              >
                <div className="p-fluid">
                  <div className="p-field p-2">
                    <label htmlFor="name">Name</label>
                    <InputText
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          name: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="p-field p-2">
                    <label htmlFor="originalPrice">Original Price</label>
                    <InputNumber
                      id="originalPrice"
                      name="originalPrice"
                      value={formData.originalPrice}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          originalPrice: event.value,
                        })
                      }
                    />
                  </div>
                  <div className="p-field p-2">
                    <label htmlFor="listingPrice">Listing Price</label>
                    <InputNumber
                      id="listingPrice"
                      name="listingPrice"
                      value={formData.listingPrice}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          listingPrice: event.value,
                        })
                      }
                    />
                  </div>
                  <div className="p-field p-2">
                    <label htmlFor="description">Description</label>
                    <InputText
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          description: event.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="p-field p-2">
                    <label htmlFor="quantity">Quantity</label>
                    <InputNumber
                      id="quantity"
                      name="quantity"
                      value={formData.quantity}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          quantity: event.value,
                        })
                      }
                    />
                  </div>
                  <div className="p-field p-2">
                    <label htmlFor="pincode">Pincode</label>
                    <InputText
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={(event) =>
                        setFormData({
                          ...formData,
                          pincode: event.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </Dialog>

              <Dialog
                header="Confirm Delete"
                visible={visible}
                style={{ width: "350px" }}
                footer={
                  <div>
                    <Button
                      label="No"
                      icon="pi pi-times"
                      onClick={() => setVisible(false)}
                      className="p-button-text"
                    />
                    <Button
                      label="Yes"
                      icon="pi pi-check"
                      autoFocus
                      onClick={handleDeleteSumit}
                    />
                  </div>
                }
                onHide={() => setVisible(false)}
              >
                <p>Are you sure you want to delete {selectedProduct?.name}?</p>
              </Dialog>
            </div>
          ))
        ) : (
          <div
            className="flex flex-column flex-wrap"
            style={{ paddingTop: "42vh" }}
          >
            <div className="flex align-items-center justify-content-center">
              <Message text="No Products Till Now Please Add Products To view." />
            </div>
          </div>
        )}

        <Toast position="top-right" ref={toast} />
      </fieldset>
    );
  } else {
    router.push("/merchant/login");
  }
 
};

export default ProductCatalog;
