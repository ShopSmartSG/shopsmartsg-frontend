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
import { Grid, Row, Col } from "primereact/grid";
import "./login.css";
import axios from "axios";
import { useRouter } from "next/navigation";

const EmailOtpForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setname] = useState("");
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

  const router = useRouter();

  const blurHandler = (value: string) => {
    if (validator.isEmail(value)) {
      setEmailError("");
    } else {
      setEmailError("Please enter a valid email address.");
    }
  };

  const generateOtp = async () => {
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/register/generateOtp/customer`,
          {
            email: email,
          },
          {
            withCredentials: true,
          }
      );
      if (response.status == 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP has been sent to your registered email address.",
          life: 3000,
        });
        setOtpCount(otpCount + 1);
        setTimer(30);
      }
    } catch (error) {
      toast.current.show({});
    }
  };

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/register/verifyOtp/customer`,
          {
            email: email,
            emailAddress: email,
            otp: otp,
          },
          { withCredentials: true }
      );

      if (response.status) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Login Successful",
          life: 3000,
        });
        setShowOtpDialog(false);
        setTimeout(() => {
          router.push("/merchant/manage/view");
        }, 3000);
      }
    } catch (error) {
      toast.current.show({
        status: "error",
        message: "Error submitting OTP. Please try again later.",
      });
      setShowOtpDialog(false);
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

  const customerRegister = async () => {
    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/register/customer`,
          {
            email,
            name,
            addressLine1,
            addressLine2,
            phoneNumber,
            pinCode,
          },
          {
            withCredentials: true,
          }
      );

      if (response.status == 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Registration Successful",
          life: 3000,
        });
        setShowOtpDialog(true);
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to register. Please try again later.",
        life: 3000,
      });
      setShowOtpDialog(false);
    }
  };

  const handleEmail = async () => {
    setShowOtpDialog(true);
    setResendDisabled(true);

    try {
      const response = await axios.post(
          `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/register/verifyOtp/customer`,
          {
            email,
            otp,
          },
          {
            withCredentials: true,
          }
      );
      if (response.status == 200) {
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "OTP Validated Successfully",
          life: 3000,
        });
        customerRegister();
      }
    } catch (error) {
      console.error("Error sending email: ", error);
      toast.current.show({
        severity: "error",
        summary: "Error",
        detail: "Failed to send email. Please try again later.",
        life: 3000,
      });
    }
  };

  return (
      <div className="p-grid p-justify-center p-align-center" style={{ height: "100vh" }}>
        <div className="p-col-12 p-md-8 p-lg-6">
          <Card>
            <p className="p-card-title text-center">Register Page</p>
            <div className="p-fluid">
              <form onSubmit={handleEmailSubmit}>
                <div className="p-field p-grid mt-2">
                  <label htmlFor="email" className="p-col-12 p-md-3">
                    Email
                  </label>
                  <div className="p-col-12 p-md-9">
                    <InputText
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={(e) => blurHandler(e.target.value)}
                        invalid={emailError == "" ? false : true}
                        placeholder="Please Enter your Valid Email"
                    />
                    {emailError && <small className="p-error">{emailError}</small>}
                  </div>
                </div>
                <div className="p-field p-grid mt-2">
                  <label htmlFor="name" className="p-col-12 p-md-3">
                    Name
                  </label>
                  <div className="p-col-12 p-md-9 mt-2">
                    <InputText
                        id="name"
                        placeholder="Enter Your Name"
                        value={name}
                        onChange={(e) => setname(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-field p-grid mt-2">
                  <label htmlFor="pincode" className="p-col-12 p-md-3">
                    PinCode
                  </label>
                  <div className="p-col-12 p-md-9 mt-2">
                    <InputText
                        id="pincode"
                        placeholder="Enter Your PinCode"
                        value={pinCode}
                        onChange={(e) => setPinCode(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-field p-grid mt-2">
                  <label htmlFor="addressLine1" className="p-col-12 p-md-3">
                    Address Line 1
                  </label>
                  <div className="p-col-12 p-md-9 mt-2">
                    <InputText
                        id="addressLine1"
                        placeholder="Enter Your Address Line 1"
                        onChange={(e) => setAddressLine1(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-field p-grid mt-2">
                  <label htmlFor="addressLine2" className="p-col-12 p-md-3">
                    Address Line 2
                  </label>
                  <div className="p-col-12 p-md-9">
                    <InputText
                        id="addressLine2"
                        placeholder="Enter Your Address Line 2"
                        onChange={(e) => setAddressLine2(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-field p-grid mt-2">
                  <label htmlFor="phoneNumber" className="p-col-12 p-md-3">
                    Phone Number
                  </label>
                  <div className="p-col-12 p-md-9 mt-2">
                    <InputText
                        id="phoneNumber"
                        placeholder="Enter Your Phone Number"
                        onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="p-field p-grid">
                  <div className="mt-2">
                    <Button
                        label="Next"
                        type="submit"
                        disabled={emailError == "" ? false : true}
                        onClick={generateOtp}
                    />
                  </div>
                </div>
              </form>
            </div>
          </Card>
        </div>

        <Dialog
            header="Enter OTP"
            visible={showOtpDialog}
            onHide={() => setShowOtpDialog(false)}
            resizable={false}
            draggable={false}
            modal={true}
        >
          <div className="p-field p-grid">
            <label htmlFor="otp" className="p-col-12 p-md-3">
              OTP
            </label>
            <div className="p-col-12 p-md-9">
              <InputOtp
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.value.toString())}
                  length={6}
                  disabled={disabledCondition}
              />
              {otpCount >= 3 && (
                  <Message
                      severity="error"
                      text="Maximum Exhaust reached Please try again later"
                  />
              )}
            </div>
          </div>
          <div >
            <div>
              <Button
                  label="Submit"
                  onClick={handleEmail}
                  disabled={disabledCondition}
              />
            </div>
            <div className="p-col-12 p-md-6">
              <Button
                  label={`Resend OTP ${resendDisabled ? `(${timer}s)` : ""}`}
                  onClick={handleResendOtp}
                  severity="secondary"
                  disabled={resendDisabled || disabledCondition}
              />
            </div>
          </div>
          {!disabledCondition && (
              <div className="p-grid">
                <div className="p-col-12">
                  <Message severity="info" text="OTP will expire in 30 seconds" />
                </div>
              </div>
          )}
        </Dialog>
        <Toast ref={toast} />
      </div>
  );
};

export default EmailOtpForm;