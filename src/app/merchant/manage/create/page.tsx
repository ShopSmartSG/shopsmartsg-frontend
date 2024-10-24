'use client'
import React, { useState,useRef ,useEffect} from "react";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";

import { Toast } from "primereact/toast";
import { FileUpload } from "primereact/fileupload";

import { Button } from "primereact/button";

import { Dropdown } from "primereact/dropdown";
        

import { ConfirmDialog } from "primereact/confirmdialog";
import axios from "axios";

const Page = () => {
  const [merchantDetails, setMerchantDetails] = useState({
    productName: "",
    category: {
      categoryName: "",
      categoryDescription: "",
    },
    imageUrl: "",
    productDescription: "",
    originalPrice: 0,
    listingPrice: 0,
    availableStock: 0,
    merchantId: "",
    pincode: "",
  });
    const [categories,setCategories] = useState([]);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [visible, setVisible] = useState<boolean>(false);
    const [productPrice, setProductPrice] = useState(0);
    const [listingPrice, setListingPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [imageurl, setImageUrl] = useState("");
  const [category,setCategory] = useState("");

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
   const onUpload = async (event) => {
     try {
       const file = event.files[0];
       const formData = new FormData();
       formData.append("file", file);
       const response = await axios.post(
         `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/images/upload`,
         formData,
         {
           headers: {
             "Content-Type": "multipart/form-data",
           },
         }
       );

       setImageUrl(response.data);
      toast.current.show({ severity: 'success', summary: 'Success', detail: 'Image Uploaded Successfully' });

     } catch (error) {
       toast.current.show({
         severity: "warn",
         summary: "Upload Failed",
         detail: "Image Uploaded Failed, Please Try Again",
       });
       console.log(error); // Might Be helpful for FE LOGGING

     }
   };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/categories`
          
          );
        setCategories(response.data);
      }
      catch (error) {
        console.error("Error fetching categories", error);
      }
      
    }
    fetchCategories();
    },[])

  useEffect(() => {
    const getMerchantDetails = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_PROFILEMGMT_API_URL}/merchants/9c723141-aba9-4653-8cf6-9e253d988fed`
        );
        setMerchantDetails(response.data);
      }
      catch (error) {
        console.log("Merchant deetails fetch failed", error); // error
        toast.current.show({severity:'warn',summary:'Merchant Details Failed',detail:'Merchant Details fetching Failed!! Please try again'})
      }
    }
    getMerchantDetails();
  }, [])
  

  const createProduct =  async() => {

    const dataObj = {
      productName: productName,
      category: {
        categoryName: categories.find((value) => value.categoryId === category)
          .categoryName,
        categoryDescription: categories.find(
          (value) => value.categoryId === category
        ).categoryDescription,
      },
      imageUrl: imageurl,
      productDescription: productDescription,
      originalPrice: productPrice,
      listingPrice: listingPrice,
      availableStock: quantity,
      merchantId: merchantDetails.merchantId,
      pincode: merchantDetails.pincode,
    };
   
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/products`, dataObj);
      toast.current.show({ severity: 'success', summary: 'Details updated successsfully', detail: response.status });
    }
    catch (error) {
      toast.current.show({ severity: 'warn', summary: 'Product Creation Failed', detail: 'Please Try Again!!' });
      console.log('error', error); // error 
    }
  }
    
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
                value={productPrice}
                onValueChange={(e) => setProductPrice(e.value)}
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
                value={listingPrice}
                onValueChange={(e) => setListingPrice(e.value)}
              />
            </div>
            <div className="field col-6">
              <label htmlFor="category" className="block">
                Category
              </label>
              <Dropdown
                optionLabel="categoryName"
                optionValue="categoryId" // Assuming each category has an 'id' field
                className="w-full"
                id="category"
                options={categories}
                placeholder="Select a Category"
                value={category} // Bind selected value to 'category' state
                onChange={(event) => {
                  setCategory(event.value); // Update category state with selected value
                  setMerchantDetails((prev) => ({
                    ...prev,
                    category:
                      categories.find((cat) => cat.id === event.value) || {}, // Set full category details
                  }));
                }}
              />
             
            </div>
            <div className="field col-6">
              <label htmlFor="productPrice">Quantity</label>
              <InputNumber
                id="productPrice"
                className="w-full"
                value={quantity}
                locale="en-SG"
                onValueChange={(e) => setQuantity(e.value)}
              />
            </div>
            <div className="col-6">
              <div className="field">
                <label htmlFor="">Upload Product Image</label>
                <Toast ref={toast}></Toast>
                <FileUpload
                  mode="advanced"
                  name="file"
                  url={`${process.env.NEXT_PUBLIC_PRODUCTMGMT_API_URL}/merchants/images/upload`}
                  accept="image/*"
                  maxFileSize={1000000}
                  onUpload={onUpload}
                  auto={true}
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
                  onClick={() => createProduct()}
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