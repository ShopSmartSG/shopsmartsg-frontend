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
  const toast = useRef(null);
  const { adminData, userType } = useAdminContext();
  const userId = localStorage.getItem("userId");
  const userTyped = localStorage.getItem("userType");
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
          `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/${updatedProductData.merchantId}/products/${updatedProductData.productId}`,
          updatedProductData
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
      console.log("error", error);
    }
  };

  useEffect(() => {
    // Simulate fetching data with dummy data
    const dummyProducts = {
      Electronics: [
        {
          id: 1,
          name: "Smartphone X",
          price: 699,
          listingPrice: 599,
          description: "A high-end smartphone with advanced features.",
          quantity: 50,
          image: "https://via.placeholder.com/150",
          merchantId: "merchant1",
          pincode: "12345",
          categoryId: "electronics",
        },
        {
          id: 2,
          name: "Wireless Earbuds",
          price: 99,
          listingPrice: 89,
          description: "Noise-cancelling wireless earbuds.",
          quantity: 200,
          image: "https://via.placeholder.com/150",
          merchantId: "merchant1",
          pincode: "12345",
          categoryId: "electronics",
        },
      ],
      Clothing: [
        {
          id: 3,
          name: "Men's Jacket",
          price: 120,
          listingPrice: 100,
          description: "Waterproof jacket for outdoor activities.",
          quantity: 30,
          image: "https://via.placeholder.com/150",
          merchantId: "merchant2",
          pincode: "67890",
          categoryId: "clothing",
        },
        {
          id: 4,
          name: "Women's Dress",
          price: 80,
          listingPrice: 70,
          description: "Elegant summer dress.",
          quantity: 100,
          image: "https://via.placeholder.com/150",
          merchantId: "merchant2",
          pincode: "67890",
          categoryId: "clothing",
        },
      ],
    };
    setProducts(dummyProducts);
  }, []);


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
                              header={<img alt={product.name} src={product.image} style={{ width: "100%", height: "150px", objectFit: "cover" }} />}
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

        {/* Delete Confirmation Dialog */}
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

};

export default ProductCatalog;