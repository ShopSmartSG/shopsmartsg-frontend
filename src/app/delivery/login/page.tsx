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
import axios from "axios";
import { useAdminContext } from "@/context/AdminContext";

import { useRouter } from "next/navigation";

const EmailOtpForm = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState(false);
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [otpCount, setOtpCount] = useState(0);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [timer, setTimer] = useState(30); //
  const disabledCondition: boolean = otpCount >= 3;

  const [userTyped, setUserType] = useState("");
  const toast = useRef(null);
  const { setAdminData, setUserTyped } = useAdminContext();


  const userId = localStorage.getItem("userId");
  const userType = localStorage.getItem("userType");

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

  const router = useRouter();

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

  const handleOtpSubmit = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/login/verifyOtp/delivery`,
        {
          email: email,
          emailAddress: email,
          otp: otp,
        },
        { withCredentials: true }
      );

      if (response.status) {
        localStorage.setItem('userType', 'DELIVERY');
        localStorage.setItem('userId',response.data.userId);
        toast.current.show({
          severity: "success",
          summary: "Success",
          detail: "Login Successful",
          life: 3000,
        });
        setShowOtpDialog(false);
       
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
  const handleEmail = async () => {
    setShowOtpDialog(true);
    setResendDisabled(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/login/generateOtp/delivery`,
        {
          email,
        },
        {
          withCredentials: true, // Include credentials with the request
        }
      );
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
  if (userType === 'DELIVERY' && (userId != null || userId != '')){
      router.push('/delivery/orders')
  }
  else {
    return (
      <div
        className="flex-row justify-content-center flex-wrap "
        style={{ height: "100vh" }}
      >
        <Card>
          <p className="p-card-title text-center">Delivery Sign In Page</p>
          <div className="flex align-items-center justify-content-center">
            <form onSubmit={handleEmailSubmit} className="p-fluid">
              <div className="field">
                <label htmlFor="email">Email</label>
                <InputText
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={(e) => blurHandler(e.target.value)}
                  invalid={emailError == "" ? false : true}
                  placeholder="Please Enter your Valid Email"
                  style={{ width: "476px", display: "block" }}
                />
                {emailError && <small className="p-error">{emailError}</small>}
              </div>
              <div className="p-card-footer min-w-4">
                <Button
                  label="Next"
                  type="submit"
                  style={{ width: "80px" }}
                  disabled={emailError == "" ? false : true}
                  onClick={handleEmail}
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
        >
          <div className="field">
            <label htmlFor="otp">OTP</label>
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
          <div className="flex flex-row flex-wrap">
            <div>
              <Button
                label="Submit"
                onClick={handleOtpSubmit}
                disabled={disabledCondition}
              />
            </div>
            <div className="ml-2">
              <Button
                label={`Resend OTP ${resendDisabled ? `(${timer}s)` : ""}`}
                onClick={handleResendOtp}
                severity="secondary"
                disabled={resendDisabled || disabledCondition}
              />
            </div>
          </div>
          {!disabledCondition && (
            <div className="text-right">
              <Message severity="info" text="OTP will expire in 30 seconds" />
            </div>
          )}
        </Dialog>
        <Toast ref={toast} />
      </div>
    );
  }
  
};

export default EmailOtpForm;
