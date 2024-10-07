/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState } from "react";
import { Card } from "primereact/card";
import { Panel } from "primereact/panel";
import { Divider } from "primereact/divider";

import Image from "next/image";
import GasStve from "@/../shared/assets/images/205.jpg";
import PhoneImage from "@/../shared/assets/images/phone_14_01.jpg";
import "./page.css";
const ProductCatalog = () => {
  // Dummy data for categories and products
  const [categories, setCategories] = useState([
    {
      name: "Electronics",
      products: [
        {
          id: 1,
          name: "Smartphone",
          price: "$499",
          image: GasStve,
        },
        { id: 2, name: "Laptop", price: "$999", image: GasStve },
      ],
    },
    {
      name: "Clothing",
      products: [
        { id: 3, name: "T-Shirt", price: "$19", image: GasStve },
        { id: 4, name: "Jeans", price: "$49", image: GasStve },
      ],
    },
    {
      name: "Home Appliances",
      products: [
        {
          id: 5,
          name: "Refrigerator",
          price: "$799",
          image: GasStve,
        },
        {
          id: 6,
          name: "Microwave",
          price: "$199",
          image: PhoneImage,
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
                        This is a brief description of {product.name}.
                      </p>
                    </Card>
                  </div>
                ))}
              </div>
            </Panel>
            <Divider />
          </div>
        ))}
      </div>
    </fieldset>
  );
};

export default ProductCatalog;
