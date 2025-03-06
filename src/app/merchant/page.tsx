/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import validator from "validator";
import { Toast } from "primereact/toast";
import { Card } from "primereact/card";
import { Message } from "primereact/message";
import { InputOtp } from "primereact/inputotp";
import "./login.css";

const EmailOtpForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpCount, setOtpCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30);
  const disabledCondition: boolean = otpCount >= 3;
  const toast = useRef(null);

  useEffect(() => {
    let interval;
    if (resendDisabled) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          if (prevTimer > 0) {
            return prevTimer - 1;
          } else {
            setResendDisabled(false);
            clearInterval(interval);
            return 30;
          }
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [resendDisabled]);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    setEmailError("");

    if (!validator.isEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }

    setShowOtpDialog(true);
    setResendDisabled(true);
  };

  const blurHandler = (value: string) => {
    if (validator.isEmail(value)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const handleOtpSubmit = () => {
    if (parseInt(otp) == 123456) {
      toast.current.show({
        severity: "success",
        summary: "Success",
        detail: "Login Successful",
        life: 3000,
      });
      setShowOtpDialog(false);
      setOtp("");
      setOtpCount(0);
    } else {
      setOtpError(true);
      setOtp("");
      setOtpCount(otpCount + 1);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Invalid OTP",
        life: 3000,
      });
    }
  };

  const handleResendOtp = () => {
    setResendDisabled(true);
    setTimer(30);
    toast.current.show({
      severity: "info",
      summary: "OTP Resent",
      detail: "OTP has been resent to your email.",
      life: 3000,
    });
  };

  return (
      <div className="flex justify-content-center align-items-center min-h-screen p-3">
        <Card className="w-full max-w-md">
          <p className="p-card-title text-center">Register Page</p>
          <div className="flex align-items-center justify-content-center">
            <form onSubmit={handleEmailSubmit} className="w-full">
              <div className="field mb-4">
                <label htmlFor="email">Email</label>
                <InputText
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => blurHandler(e.target.value)}
                    invalid={emailError !== ""}
                    placeholder="Please Enter your Valid Email"
                    className="w-full"
                />
                {emailError && <small className="p-error">{emailError}</small>}
              </div>
              <div className="field mb-4">
                <label htmlFor="name">Name</label>
                <InputText
                    id="name"
                    placeholder="Enter Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full"
                />
              </div>
              <div className="field mb-4">
                <label htmlFor="pincode">PinCode</label>
                <InputText
                    id="pincode"
                    placeholder="Enter Your PinCode"
                    value={pinCode}
                    onChange={(e) => setPinCode(e.target.value)}
                    className="w-full"
                />
              </div>
              <div className="field mb-4">
                <label htmlFor="addressLine1">Address Line 1</label>
                <InputText
                    id="addressLine1"
                    placeholder="Enter Your Address Line 1"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    className="w-full"
                />
              </div>
              <div className="field mb-4">
                <label htmlFor="addressLine2">Address Line 2</label>
                <InputText
                    id="addressLine2"
                    placeholder="Enter Your Address Line 2"
                    value={addressLine2}
                    onChange={(e) => setAddressLine2(e.target.value)}
                    className="w-full"
                />
              </div>
              <div className="field mb-4">
                <label htmlFor="phoneNumber">Phone Number</label>
                <InputText
                    id="phoneNumber"
                    placeholder="Enter Your Phone Number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full"
                />
              </div>
              <div className="p-card-footer flex justify-content-center">
                <Button
                    label="Next"
                    type="submit"
                    className="w-full md:w-auto"
                    disabled={emailError !== ""}
                />
              </div>
            </form>
          </div>
        </Card>

        <Dialog
            header="Enter OTP"
            visible={showOtpDialog}
            onHide={() => setShowOtpDialog(false)}
            resizable={false}
            draggable={false}
            modal={true}
            className="w-full max-w-sm"
        >
          <div className="field mb-4">
            <label htmlFor="otp">OTP</label>
            <InputOtp
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.value.toString())}
                length={6}
                disabled={disabledCondition}
                className="w-full"
            />
            {otpCount >= 3 && (
                <Message
                    severity="error"
                    text="Maximum attempts reached. Please try again later."
                />
            )}
          </div>
          <div className="flex flex-column md:flex-row gap-2">
            <Button
                label="Submit"
                onClick={handleOtpSubmit}
                disabled={disabledCondition}
                className="w-full md:w-auto"
            />
            <Button
                label={`Resend OTP ${resendDisabled ? `(${timer}s)` : ""}`}
                onClick={handleResendOtp}
                severity="secondary"
                disabled={resendDisabled || disabledCondition}
                className="w-full md:w-auto"
            />
          </div>
          {!disabledCondition && (
              <div className="text-right mt-2">
                <Message severity="info" text="OTP will expire in 30 seconds" />
              </div>
          )}
        </Dialog>
        <Toast ref={toast} />
      </div>
  );
};

export default EmailOtpForm;