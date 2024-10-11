/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';



import Image from "next/image";
import { StaticImageData } from 'next/image';
import GasStve from "@/../shared/assets/images/205.jpg";
import PhoneImage from "@/../shared/assets/images/phone_14_01.jpg";
import "./page.css";


const ProductCatalog = () => {
  // Dummy data for categories and products

  const [visible, setVisible] = useState(false);
  const [updateVisible, setUpdateVisible] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', price: '', description: '', quantity: 0 });
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setVisible(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (formData) {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdateClick = (product) => {
    setFormData(product);
    setUpdateVisible(true);
  };

  const handleUpdateSubmit = () => {
    if (formData) {
      setCategories((prevCategories) =>
        prevCategories.map((category) => ({
          ...category,
          products: category.products.map((product) =>
            product.id === formData.id
              ? { ...product, name: formData.name, price: formData.price, description: formData.description, quantity: formData.quantity }
              : product
          ),
        }))
      );
      setUpdateVisible(false);
    }
  };

  const handleConfirmDelete = () => {
    // Add your delete logic here
    setCategories((prevCategories) =>
      prevCategories.map((category) => ({
        ...category,
        products: category.products.filter(
          (product) => product.id !== selectedProduct.id
        ),
      }))
    );
    setVisible(false);
  };
  const [categories, setCategories] = useState([
    {
      name: "Electronics",
      products: [
        {
          id: 1,
          name: "Smartphone",
          price: "$499",
          description: "This is a brief description of Smartphone.",
          quantity: 10,
          image: "https://via.placeholder.com/150",
        },
        { id: 2, name: "Laptop", price: "$999", description: "Electronic!!", quantity: 15, image: "https://via.placeholder.com/150" },
      ],
    },
    {
      name: "Clothing",
      products: [
        { id: 3, name: "T-Shirt", price: "$19", description: "This is jeans", quantity: 18, image: "https://via.placeholder.com/150" },
        { id: 4, name: "Jeans", price: "$49", description: "This is shirt", quantity: 11, image: "https://via.placeholder.com/150" },
      ],
    },
    {
      name: "Home Appliances",
      products: [
        {
          id: 5,
          name: "Refrigerator",
          price: "$799",
          description: "This is a brief description of Refrigerator.",
          quantity: 10,
          image: "https://via.placeholder.com/150",
        },
        {
          id: 6,
          name: "Microwave",
          price: "$199",
          description: "This is a brief description of Microwave.",
          quantity: 15,
          image: "https://via.placeholder.com/150",
        },
      ],
    },
  ]);

  return (
    <fieldset>
      <legend>Product Catalog</legend>
      <div className="p-grid p-dir-col p-2">
        {categories.map((category) => (
          <div key={category.name}>
            <Panel header={category.name}>
              <div className="grid">
                {category.products.map((product) => (
                  <div key={product.id} className="col-4 ">
                    <Card
                      title={product.name}
                      subTitle={product.price}
                      header={
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={100}
                          height={100}
                        />
                      }
                    >
                       <p className="p-m-0" style={{ lineHeight: "1.5" }}>
                        <span className="font-weight-bold">Quantity:</span> {product.quantity}
                       </p>
                      <p className="p-m-0" style={{ lineHeight: "1.5" }}>
                        
                        {product.description}
                      </p>
                      <div className="p-d-flex p-jc-between p-mt-2">
                        <Button label="Update" className="p-button-primary mr-2" onClick={() => handleUpdateClick(product)} />
                        <Button icon="pi pi-trash" className="p-button-danger ml-2" onClick={() => handleDeleteClick(product)} />
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
        header="Confirm Delete"
        visible={visible}
        style={{ width: '350px' }}
        footer={
          <div>
            <Button label="No" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Yes" icon="pi pi-check" onClick={handleConfirmDelete} autoFocus />
          </div>
        }
        onHide={() => setVisible(false)}
      >
        <p>Are you sure you want to delete {selectedProduct?.name}?</p>
      </Dialog>

      <Dialog
        header="Update Product"
        visible={updateVisible}
        style={{ width: '450px' }}
        footer={
          <div>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setUpdateVisible(false)} className="p-button-text" />
            <Button label="Save" icon="pi pi-check" onClick={handleUpdateSubmit} autoFocus />
          </div>
        }
        onHide={() => setUpdateVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field p-2">
            <label htmlFor="name">Name</label>
            <InputText id="name" name="name" value={formData.name} onChange={handleInputChange} />
          </div>
          <div className="p-field p-2">
            <label htmlFor="price">Price</label>
            <InputText id="price" name="price" value={formData.price} onChange={handleInputChange} />
          </div>
          <div className="p-field p-2">
            <label htmlFor="description">Description</label>
            <InputText id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>
          <div className="p-field p-2">
            <label htmlFor="quantity">Quantity</label>
            <InputText id="quantity" name="quantity" value={formData.quantity.toString()} onChange={handleInputChange} />
          </div>
        </div>
      </Dialog>
    </fieldset>
  );
};

export default ProductCatalog;
