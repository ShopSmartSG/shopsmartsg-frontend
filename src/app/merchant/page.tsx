"use client";
import React, { useRef, useState,useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { useSession } from "@/context/SessionContext";
import "../merchant/merchant.css";

import { useRouter } from "next/navigation";
import axios from "axios";

interface FormData {
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string; // Optional field
  pincode: string;
}

interface Errors {
  email?: string;
  phone?: string;
  addressLine1?: string;
  addressLine2?: string;
  pincode?: string;
}



const Page: React.FC = () => {
  const toast = useRef<Toast>(null);
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
  });
  const { session } = useSession();
  const [merchantName, setMerchantName] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [editDetailsEnable, setEditDetailsEnable] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;

    setFormData({
      ...formData,
      [id]: value,
    });
  };

  const enableDetails = () => {
    setEditDetailsEnable(true);
  };


  
  const confirm1 = () => {
    confirmDialog({
      message: "Are you sure you want to proceed?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
      accept,
      reject,
    });
  };
  const validateField = (field: keyof FormData): string | undefined => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    switch (field) {
      case "email":
        if (!formData.email) return "Email is required.";
        if (!emailPattern.test(formData.email)) return "Invalid email format.";
        break;
      case "phone":
        if (!formData.phone) return "Phone number is required.";
        
        break;
      case "addressLine1":
        if (!formData.addressLine1) return "Address Line 1 is required.";
        break;
      case "pincode":
        if (!formData.pincode) return "Pincode is required.";
        break;
      default:
        break;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Errors = {};


    Object.keys(formData).forEach((key) => {
      const error = validateField(key as keyof FormData);
      if (error) newErrors[key as keyof FormData] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { id } = e.target;
    const error = validateField(id as keyof FormData);


    if (error) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: error,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [id]: undefined,
      }));
    }
  };

  const userId = localStorage.getItem('userId');


  const accept = async () => {
   const data = {
     name: merchantName,
     merchantId: "de2e56fa-b127-4bf4-bd01-163b23ef2db0",
     addressLine1: formData.addressLine1,
     addressLine2: formData.addressLine2,
     pincode: formData.pincode,
     emailAddress: formData.email,
     phoneNumber: formData.phone,
   };
    try {
       const response = await axios.put(
         `${process.env.NEXT_PUBLIC_PROFILEMGMT_API_URL}/merchants/${userId}

`,
         data
       );
      if (response.status === 200) {
        toast.current?.show({
          severity: "success",
          summary: "Updated",
          detail: "Your Details have been updated successfully",
          life: 3000,
        });
        setEditDetailsEnable(false); 
      }
      
    }
    catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 3000,
      });
    }
    
   
  };

  const reject = () => {
    toast.current?.show({
      severity: "warn",
      summary: "Rejected",
      detail: "You have rejected",
      life: 3000,
    });
  };

  const confirmUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); 
    if (validateForm()) {
      confirmDialog({
        message: "Are you sure you want to proceed?",
        header: "Confirmation",
        icon: "pi pi-exclamation-triangle",
        defaultFocus: "accept",
        accept: () => accept(),
        reject: () => reject(),
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      
      try {
        // Make the API call
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_GETALLMERCHANT_API_URL}/${userId}`
        );

        // Set the fetched data to state
        setFormData({
          ...response.data,
          email: response.data.emailAddress,
          phone: response.data.phoneNumber,
          
        });
        setMerchantName(response.data.name);
      } catch (error) {
        // Handle errors
        console.error(error);
       
      } 
    };

    // Call the fetch function
    fetchData();
  }, []); 
  const [usetType, SetUserType] = useState('');

  useEffect(() => {
    const userType = localStorage.getItem("USER_TYPE");
    SetUserType(userType);
  }, []);

  if (session == '' || session == null || session == undefined) {
    router.push('/merchant/login');
  }
  else  {
     return (
       <fieldset>
         <legend>Merchant</legend>
         <div className="p-2">
           <div className="grid">
             <div className="col-6">
               <h1 style={{ color: "#007A7C" }}>Manage Profile</h1>
             </div>
             <div
               className="col-6 flex justify-content-end"
               style={{ paddingTop: "27px" }}
             >
               <Button
                 label="Edit Details"
                 severity="info"
                 raised
                 onClick={enableDetails}
               />
             </div>
           </div>
           <form onSubmit={confirmUpdate}>
             <div className="flex flex-column gap-2">
               <label htmlFor="id">Merchant ID</label>
               <p>{userId}</p>
               <div className="form-grid grid">
                 <div className="field col-12">
                   <label htmlFor="email">Email ID { usetType}</label>
                   <InputText
                     id="email"
                     aria-describedby="email-help"
                     placeholder="Please Enter your Valid Email ID"
                     className={`text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full ${
                       errors.email ? "p-invalid" : ""
                     }`}
                     value={formData.email}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     disabled={!editDetailsEnable}
                   />
                   {errors.email && (
                     <small className="p-error">{errors.email}</small>
                   )}
                 </div>
                 <div className="field col-12">
                   <label htmlFor="phone">Phone Number</label>
                   <InputText
                     id="phone"
                     aria-describedby="phone-help"
                     placeholder="Please Enter your Valid Phone Number"
                     className={`text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full ${
                       errors.phone ? "p-invalid" : ""
                     }`}
                     value={formData.phone}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     disabled={!editDetailsEnable}
                   />
                   {errors.phone && (
                     <small className="p-error">{errors.phone}</small>
                   )}
                 </div>
                 <div className="field col-6">
                   <label htmlFor="addressLine1">Address Line 1</label>
                   <InputText
                     id="addressLine1"
                     aria-describedby="address-help"
                     placeholder="Address Line 1"
                     className={`text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full ${
                       errors.addressLine1 ? "p-invalid" : ""
                     }`}
                     value={formData.addressLine1}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     disabled={!editDetailsEnable}
                   />
                   {errors.addressLine1 && (
                     <small className="p-error">{errors.addressLine1}</small>
                   )}
                 </div>
                 <div className="field col-6">
                   <label htmlFor="addressLine2">Address Line 2</label>
                   <InputText
                     id="addressLine2"
                     aria-describedby="address-help"
                     placeholder="Address Line 2"
                     className="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"
                     value={formData.addressLine2}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     disabled={!editDetailsEnable}
                   />
                 </div>
                 <div className="field col-6">
                   <label htmlFor="pincode">Pincode</label>
                   <InputText
                     id="pincode"
                     aria-describedby="address-help"
                     placeholder="Pincode"
                     className={`text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full ${
                       errors.pincode ? "p-invalid" : ""
                     }`}
                     value={formData.pincode}
                     onChange={handleChange}
                     onBlur={handleBlur}
                     disabled={!editDetailsEnable}
                   />
                   {errors.pincode && (
                     <small className="p-error">{errors.pincode}</small>
                   )}
                 </div>
                 <div className="field col-12">
                   <Button
                     onClick={confirm1}
                     icon="pi pi-check"
                     label="Confirm"
                     className="mr-2"
                     disabled={!editDetailsEnable}
                   ></Button>
                   <ConfirmDialog />
                   <Toast ref={toast} />
                 </div>
               </div>
             </div>
           </form>
         </div>
       </fieldset>
     );
  }

 
};

export default Page;
