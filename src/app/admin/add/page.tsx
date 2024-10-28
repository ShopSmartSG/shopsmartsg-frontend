"use client";

import React, { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { InputMask } from "primereact/inputmask";
import { useFormik } from "formik";
import * as Yup from "yup";
import { classNames } from "primereact/utils";
import axios from "axios";

export default function CreateMerchantForm() {
  const [showDialog, setShowDialog] = useState(false);
  const toast = useRef(null);

  const formik = useFormik({
    initialValues: {
      email: "",
      phone: "",
      address1: "",
      address2: "",
      merchantName: "",
      pincode: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      address1: Yup.string().required("Address Line 1 is required"),
      address2: Yup.string().required("Address Line 2 is required"),
      merchantName: Yup.string().required("Merchant Name is required"),
      pincode: Yup.string().required("Pincode is required"),
    }),
    onSubmit: () => {
      setShowDialog(true);
    },
  });

  const handleConfirm = async () => {
    const data = {
      name: formik.values.merchantName,
      emailAddress: formik.values.email,
      addressLine1: formik.values.address1,
      addressLine2: formik.values.address2,
      phoneNumber: formik.values.phone,
      
      pincode: formik.values.pincode,
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_CentralService_API_URL}/createMerchant`,
        data,
        {
          withCredentials: true, // Include credentials with the request
        }
      );
      if (response.status === 201) {
        setShowDialog(false);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Merchant created successfully",
          life: 3000,
        });
        formik.resetForm();
      }
    } catch (error) {
      setShowDialog(false);
      if (error.response && error.response.status === 500) {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "Please check the data you entered and try again.",
          life: 3000,
        });
      } else {
        toast.current.show({
          severity: "error",
          summary: "Error",
          detail: "An unexpected error occurred. Please try again later.",
          life: 3000,
        });
      }
    }
  };

  return (
    <fieldset>
      <legend>Admin</legend>
      <h1 style={{ color: "#007A7C" }}>Create Merchant</h1>
      <div className="p-fluid">
        <Toast ref={toast} />
        <form onSubmit={formik.handleSubmit} className="grid formgrid">
          <div className="field col-12 md:col-6">
            <label htmlFor="email">Email ID</label>
            <InputText
              id="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
                "p-invalid": formik.touched.email && formik.errors.email,
              })}
            />
            {formik.touched.email && formik.errors.email && (
              <small className="p-error">{formik.errors.email}</small>
            )}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="phone">Phone Number</label>
            <InputMask
              id="phone"
              value={formik.values.phone}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              mask="999-999-9999"
              className={classNames({
                "p-invalid": formik.touched.phone && formik.errors.phone,
              })}
            />
            {formik.touched.phone && formik.errors.phone && (
              <small className="p-error">{formik.errors.phone}</small>
            )}
          </div>

          <div className="field col-12">
            <label htmlFor="address1">Address Line 1</label>
            <InputText
              id="address1"
              value={formik.values.address1}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
                "p-invalid": formik.touched.address1 && formik.errors.address1,
              })}
            />
            {formik.touched.address1 && formik.errors.address1 && (
              <small className="p-error">{formik.errors.address1}</small>
            )}
          </div>

          <div className="field col-12">
            <label htmlFor="address2">Address Line 2</label>
            <InputText
              id="address2"
              value={formik.values.address2}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
                "p-invalid": formik.touched.address2 && formik.errors.address2,
              })}
            />
            {formik.touched.address2 && formik.errors.address2 && (
              <small className="p-error">{formik.errors.address2}</small>
            )}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="merchantName">Merchant Name</label>
            <InputText
              id="merchantName"
              value={formik.values.merchantName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={classNames({
                "p-invalid":
                  formik.touched.merchantName && formik.errors.merchantName,
              })}
            />
            {formik.touched.merchantName && formik.errors.merchantName && (
              <small className="p-error">{formik.errors.merchantName}</small>
            )}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="pincode">Pincode</label>
            <InputMask
              id="pincode"
              value={formik.values.pincode}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              mask="999999"
              className={classNames({
                "p-invalid": formik.touched.pincode && formik.errors.pincode,
              })}
            />
            {formik.touched.pincode && formik.errors.pincode && (
              <small className="p-error">{formik.errors.pincode}</small>
            )}
          </div>

          <div className="field col-2 mt-3">
            <Button
              type="submit"
              label="Create Merchant"
              className="mt-2"
              onClick={() => setShowDialog(true)}
              disabled={!(formik.dirty && formik.isValid)}
            />
          </div>
        </form>

        <Dialog
          header="Confirm"
          visible={showDialog}
          onHide={() => setShowDialog(false)}
          footer={
            <div>
              <Button
                label="No"
                icon="pi pi-times"
                onClick={() => setShowDialog(false)}
              />
              <Button label="Yes" icon="pi pi-check" onClick={handleConfirm} />
            </div>
          }
        >
          <p>Are you sure you want to create this merchant?</p>
        </Dialog>
      </div>
    </fieldset>
  );
}
