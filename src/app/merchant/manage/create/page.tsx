'use client'
import React, { useState,useRef } from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";

import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

import { Button } from "primereact/button";


import { ConfirmDialog } from "primereact/confirmdialog";

const Page = () => {

    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [visible, setVisible] = useState<boolean>(false);
    const [productPrice, setProductPrice] = useState("");
    const [listingPrice, setListingPrice] = useState("");
    const [quantity, setQuantity] = useState("");

    const toast = useRef<Toast>(null);
     const accept = () => {
       toast.current?.show({
         severity: "info",
         summary: "Confirmed",
         detail: "You have accepted",
         life: 3000,
       });
     };

     const reject = () => {
       toast.current?.show({
         severity: "warn",
         summary: "Rejected",
         detail: "You have rejected",
         life: 3000,
       });
     };
    const onUpload = () => {
      toast.current.show({
        severity: "info",
        summary: "Success",
        detail: "File Uploaded",
      });
    };
   

    
    return (
      <fieldset className="h-screen">
        <legend>Create Product</legend>
        <div className="p-2">
          <div className="field">
            <label htmlFor="firstname1">Product Name</label>
            <input
              id="firstname1"
              type="text"
              className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="lastname1">Product Description</label>
            <InputTextarea
              id="lastname1"
              className="w-full"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <div className="formgrid grid">
            <div className="field col-6">
              <label htmlFor="productPrice">Product Price</label>
              <InputNumber
                id="productPrice"
                className="w-full"
                mode="currency"
                currency="SGD"
                locale="en-SG"
                value={parseInt(productPrice)}
                onValueChange={(e) => setProductPrice((e.value.toString()))}
              />
            </div>
            <div className="field col-6">
              <label htmlFor="productPrice">Listing Price</label>
              <InputNumber
                id="productPrice"
                className="w-full"
                mode="currency"
                currency="SGD"
                locale="en-SG"
                value={parseInt(listingPrice)}
                onValueChange={(e) => setListingPrice((e.value.toString()))}
              />
            </div>
            <div className="field col-6">
              <label htmlFor="productPrice">Quantity</label>
              <InputNumber
                id="productPrice"
                className="w-full"
               
               value={parseInt(quantity)}
                locale="en-SG"
              
                onValueChange={(e) => setQuantity((e.value.toString()))}
              />
            </div>
            <div className="col-6">
              <div className="field">
                <label htmlFor="">Upload Product Image</label>
                <Toast ref={toast}></Toast>
                <FileUpload
                  mode="advanced"
                  name="demo[]"
                  url="/api/upload"
                  accept="image/*"
                  maxFileSize={1000000}
                  onUpload={onUpload}
                  auto
                  chooseLabel="Browse"
                />
              </div>
            </div>
            <div className="col-12 mt-2">
              <Toast ref={toast} />
              <ConfirmDialog
                group="declarative"
                visible={visible}
                onHide={() => setVisible(false)}
                message="Are you sure you want to proceed?"
                header="Confirmation"
                icon="pi pi-exclamation-triangle"
                accept={accept}
                reject={reject}
                style={{ width: "50vw" }}
                breakpoints={{ "1100px": "75vw", "960px": "100vw" }}
              />
              <div className="card">
                <Button
                  onClick={() => setVisible(true)}
                  icon="pi pi-check"
                  label="Create Product"
                />
              </div>
            </div>
          </div>
        </div>
      </fieldset>
    );
}

export default Page