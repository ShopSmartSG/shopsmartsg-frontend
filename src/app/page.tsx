'use client'
import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Carousel } from "primereact/carousel";
import { Tag } from "primereact/tag";
import { Card } from 'primereact/card'
import { ProductService } from "./ProductService";


import { Divider } from "primereact/divider";

import { InputText } from "primereact/inputtext";
import { PrimeIcons } from "primereact/api";
import Link from "next/link";
import FilterSearch from "../../shared/components/filter/filterSearch";
import { useRouter } from "next/navigation";
import { Image } from "primereact/image";

const Page = () => {
  
  


const router = useRouter();

 
  const [products, setProducts] = useState([]);
  const responsiveOptions = [
    {
      breakpoint: "1400px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "1199px",
      numVisible: 3,
      numScroll: 1,
    },
    {
      breakpoint: "767px",
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: "575px",
      numVisible: 1,
      numScroll: 1,
    },
  ];
  const getSeverity = (product) => {
    switch (product.inventoryStatus) {
      case "INSTOCK":
        return "success";

      case "LOWSTOCK":
        return "warning";

      case "OUTOFSTOCK":
        return "danger";

      default:
        return null;
    }
  };
  const Footer = () => {
    return (

      <footer className="p-p-4 p-mt-4 p-2" style={{ backgroundColor: "#f5f5f5", color: "#333" }}>
        <div className="grid justify-between">

          <div className="col-3">
            <h3>Contact Us</h3>
            <p><i className="pi pi-map-marker" /> 123 Heng Mui Keng Terrace, Singapore, SG</p>
            <p><i className="pi pi-phone" /> (123) 456-7890</p>
            <p><i className="pi pi-envelope" /> support@shopsmart.com</p>
          </div>


          <div className="col-3">
            <h3>Customer Service</h3>
            <ul className="p-reset">
              <li><Link href="/help" className="p-mt-1">Help Center</Link></li>
              
              <li><Link href="/faq" className="p-mt-1">FAQs</Link></li>
            </ul>
          </div>


          <div className="col-3">
            <h3>Quick Links</h3>
            <ul className="p-reset">
              <li><a href="/shop" className="p-mt-1">Shop</a></li>
              <li><a href="/about" className="p-mt-1">About Us</a></li>
              <li><a href="/contact" className="p-mt-1">Contact</a></li>
            
            </ul>
          </div>


          <div className="col-3 p-md-3">
            <h3>Subscribe to Our Newsletter</h3>
            <div className="p-inputgroup">
              <InputText placeholder="Your email" />
              <Button icon="pi pi-envelope" label="Subscribe" />
            </div>
            <div className="p-mt-3">
              <Button icon={PrimeIcons.FACEBOOK} className="p-button-rounded p-button-text p-mr-1" />
              <Button icon={PrimeIcons.TWITTER} className="p-button-rounded p-button-text p-mr-1" />
              <Button icon={PrimeIcons.INSTAGRAM} className="p-button-rounded p-button-text p-mr-1" />
              <Button icon={PrimeIcons.LINKEDIN} className="p-button-rounded p-button-text" />
            </div>
          </div>
        </div>
        <Divider />
        <p className="p-text-center p-mt-2">© 2024 ShopSmart. All Rights Reserved.</p>
      </footer>
    );
  };

  const productTemplate = (product) => {
    return (
      <div className="border-1 surface-border border-round m-2 text-center py-5 px-3">
        <div className="mb-3">
          <img
            src={`https://primefaces.org/cdn/primereact/images/product/${product.image}`}
            alt={product.name}
            className="w-6 shadow-2"
          />
        </div>
        <div>
          <h4 className="mb-1">{product.name}</h4>
          <h6 className="mt-0 mb-3">${product.price}</h6>
          <Tag
            value={product.inventoryStatus}
            severity={getSeverity(product)}
          ></Tag>
          <div className="mt-5 flex flex-wrap gap-2 justify-content-center">
            <Button icon="pi pi-search" className="p-button p-button-rounded" />
            <Button
              icon="pi pi-star-fill"
              className="p-button-success p-button-rounded"
            />
          </div>
        </div>
      </div>
    );
  };
  useEffect(() => {
    ProductService.getProductsSmall().then((data) =>
      setProducts(data.slice(0, 9))
    );
  }, []);

  const footer = (value:string) => {
    return (
      <div className="text-center">
        {value}
      </div>
    );
  }

  return (
    <div>
      <FilterSearch />
      <Card>
        <div>
          <div className="grid text-center">
            <div
              className="col-3 cursor-pointer"
              onClick={() =>
                router.push(
                  "/customer/products?categoryId=302ef7d8-de49-4126-a211-163d94f48634"
                )
              }
            >
              <Card footer={footer("Groceries")}>
                <Image
                  src="https://img.freepik.com/free-psd/hand-drawn-shopping-cart-isolated_23-2151551324.jpg"
                  height="122px"
                  alt="Cart"
                />
              </Card>
            </div>
            <div
              className="col-3 cursor-pointer"
              onClick={() =>
                router.push(
                  "/customer/products?categoryId=b625dcbf-ee91-4861-a5cb-b3bf9f863389"
                )
              }
            >
              <Card footer={footer("Electronics")}>
                <Image
                  src="https://img.freepik.com/free-vector/gaming-item-sticker-icons-hand-drawn-coloring-vector_528110-163.jpg"
                  height="122px"
                />
              </Card>
            </div>
            <div
              className="col-3 cursor-pointer"
              onClick={() =>
                router.push(
                  "/customer/products?categoryId=f2670d9e-10e0-4317-9d6d-afec4e8ee8c8"
                )
              }
            >
              <Card footer={footer("Clothing")}>
                <Image
                  src="https://img.freepik.com/free-vector/set-different-cloth-white-background_1308-97958.jpg"
                  height="122px"
                />
              </Card>
            </div>
            <div
              className="col-3 cursor-pointer"
              onClick={() =>
                router.push(
                  "/customer/products?categoryId=426243e1-5e6e-42ef-bb12-85072e941802"
                )
              }
            >
              <Card footer={footer("Books")}>
                <Image
                  src="https://img.freepik.com/free-vector/isolated-bundle-books_1308-46573.jpg"
                  height="122px"
                />
              </Card>
            </div>
          </div>
        </div>
      </Card>
      <br />
      {/* <Card header={header}>
        <div className="grid text-center">
          <div
            className="col-3 cursor-pointer"
            onClick={() => router.push("/")}
          >
            <Card>
              <p>Amul Taja Milk</p>
              <small>
                <b>Shop Now!</b>
              </small>
            </Card>
          </div>
          <div className="col-3 cursor-pointer">
            <Card>
              <p>Rice</p>
              <small>
                <b>Shop Now!</b>
              </small>
            </Card>
          </div>
          <div className="col-3 cursor-pointer">
            <Card>
              <p>Noodles</p>
              <small>
                <b>Shop Now!</b>
              </small>
            </Card>
          </div>
          <div className="col-3 cursor-pointer">
            <Card>
              <p>Smart Watches</p>
              <small>
                <b>Shop Now !</b>
              </small>
            </Card>
          </div>
        </div>
      </Card> */}
      <br />
      <br />
      <div className="grid">
        {/* <div className="col-6">
          <Card>
            <div className="grid text-center">
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
            </div>
          </Card>
        </div>
        <div className="col-6">
          <Card>
            <div className="grid text-center">
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
              <div className="col-6 cursor-pointer">
                <Card>
                  <p>Mobiles</p>
                  <small>Min 50 % Off</small>
                </Card>
              </div>
            </div>
          </Card>
        </div> */}
        <br />
        <br />
        <div className="grid">
          <div className="col-12">
            <Card>
              <Carousel
                value={products}
                numScroll={1}
                numVisible={6}
                responsiveOptions={responsiveOptions}
                itemTemplate={productTemplate}
              />
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page