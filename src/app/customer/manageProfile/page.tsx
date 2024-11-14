"use client";
import React, { useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { useRouter } from "next/navigation";
import "./merchant.css";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";

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

  const router = useRouter();

  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    pincode: "",
  });

  const [errors, setErrors] = useState<Errors>({});
  const [editDetailsEnable, setEditDetailsEnable] = useState<boolean>(false);

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

  const userType = localStorage.getItem('userType');
  const userId = localStorage.getItem('userId');

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
    const phonePattern = /^[0-9]{10}$/;

    switch (field) {
      case "email":
        if (!formData.email) return "Email is required.";
        if (!emailPattern.test(formData.email)) return "Invalid email format.";
        break;
      case "phone":
        if (!formData.phone) return "Phone number is required.";
        if (!phonePattern.test(formData.phone)) return "Invalid phone number.";
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

  const accept = () => {
    toast.current?.show({
      severity: "success",
      summary: "Confirmed",
      detail: "You have accepted",
      life: 3000,
    });
    // Add any additional logic here, e.g., form submission
    setEditDetailsEnable(false); // Disable edit after confirmation
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


  // useEffect(() => {
  //   const getUserDetails = async () => {
  //     try {
  //       const response = await fetch(`/api/customers/${userId}`);
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch user details");
  //       }
  //       const data = await response.json();
  //       setFormData(data);
  //     } catch (error) {
  //       console.error("Error fetching user details:", error);
  //     }
  //   }
  // })
 if(userType && userType == 'CUSTOMER' && userId)
 {
    return (
      <fieldset>
        <legend>Customer</legend>
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
              <label htmlFor="id">Customer ID</label>
              <p>{userId}</p>
              <div className="form-grid grid">
                <div className="field col-12">
                  <label htmlFor="email">Email ID</label>
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
 else {
    router.push('customer/login')
  }
 
};

export default Page;
