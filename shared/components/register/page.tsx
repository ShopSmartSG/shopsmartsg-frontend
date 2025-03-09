/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, {useState, useRef, useEffect} from "react";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {Dialog} from "primereact/dialog";
import validator from "validator";
import {Toast} from "primereact/toast";
import {Card} from "primereact/card";
import {Message} from "primereact/message";
import {InputOtp} from "primereact/inputotp";
import { Password } from 'primereact/password';
import axios from "axios";
import "./register.css";
import {Checkbox} from "primereact/checkbox";
import {useRouter} from "next/navigation";
interface RegisterFormProps {
    type?: string
}


interface  RegistrationResponse {
    status ?: string,
    redirect_uri ?: string
    message?: string
}

const RegisterForm = ({type}: RegisterFormProps) => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [name, setname] = useState("");
    const [password,setPassword] = useState("");
    const [addressLine1, setAddressLine1] = useState("");
    const [addressLine2, setAddressLine2] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
    const [otpError, setOtpError] = useState(false);
    const [pinCode, setPinCode] = useState("");
    const [showOtpDialog, setShowOtpDialog] = useState(false);
    const [emailError, setEmailError] = useState("");
    const [otpCount, setOtpCount] = useState(0);
    const [resendDisabled, setResendDisabled] = useState(true);
    const [timer, setTimer] = useState(30); //
    const disabledCondition: boolean = otpCount >= 3;
    const toast = useRef(null);
    const router = useRouter();

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
    const policyDialogContent = (
        <div className="policy-dialog-content">
            <p>
                This Privacy Policy outlines how we collect, use, and protect your personal information.
                By agreeing to these terms, you acknowledge that:
            </p>
            <ul>
                <li>We will only use your data for legitimate purposes.</li>
                <li>Your data will be stored securely and not shared with third parties.</li>
                <li>You have the right to request access, correction, or deletion of your data.</li>
            </ul>
            <p>
                For more details, please contact our support team at{" "}
                <a href="mailto:support@shopsmartsg.com">support@shopsmartsg.com</a>.
            </p>
        </div>
    );
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

    const handleOtpSubmit = async() => {
        const user = type.toLowerCase();

        try{
            const response = await axios.post(`https://central-hub.shopsmartsg.com/auth/native/signup/${user}`,{
                email: email,
                emailAddress: email,
                password: password,
                name: name,
                phoneNumber: phoneNumber,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                pincode: pinCode,
                otp: otp
            })
            if(response.status == 200) {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Registration Successful",
                    life: 3000,
                })
                const response_uri:RegistrationResponse = await response.data;
                setTimeout(() => {
                    router.push(response_uri.redirect_uri);
                }, 3000);
            }
            else{
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Registration Failed",
                    life: 3000,
                })
                setShowOtpDialog(false);
            }
        }
        catch(error){

        }
        if (parseInt(otp) == 123456) {
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Login Succcessful",
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


    const handleResendOtp = async() => {
        const user = type.toLowerCase();
        try{
            const response = await axios.get(`https://central-hub.shopsmartsg.com/auth/native/generate-otp/${user}/${email}`);
            if(response.status == 200){
                toast.current.show({
                    severity: "info",
                    summary: "OTP Resent",
                    detail: "OTP has been resent to your email.",
                    life: 3000,
                })
            }
        }

        catch (error){
        }
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
        <div
            className="flex-row justify-content-center flex-wrap "
            style={{height: "100vh"}}
        >
            <Card>
                <p className="p-card-title text-center">{type} Registration Page</p>
                <div className="flex align-items-center justify-content-center">
                    <form onSubmit={handleEmailSubmit} className="p-fluid">
                        <div className="field">
                            <label htmlFor="email">Email</label>
                            <InputText
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onBlur={(e) => blurHandler(e.target.value)}
                                invalid={emailError != ""}
                                placeholder="Please Enter your Valid Email"
                                style={{width: "476px", display: "block"}}
                            />
                            {emailError && <small className="p-error">{emailError}</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="">Name</label>
                            <InputText id="name" placeholder="Enter Your Name" value={name}
                                       onChange={(e) => setname(e.target.value)}/>
                        </div>
                        <div className="field">
                            <label htmlFor="">PinCode</label>
                            <InputText id="pincode" placeholder="Enter Your PinCode" value={pinCode}
                                       onChange={(e) => setPinCode(e.target.value)}/>
                        </div>
                        <div className="field">
                            <label htmlFor="">Address Line 1</label>
                            <InputText id="addressLine1" placeholder="Enter Your Address Line 1"
                                       onChange={(e) => setAddressLine1(e.target.value)}/>
                        </div>
                        <div className="field">
                            <label htmlFor="">Address Line 2</label>
                            <InputText id="addressLine2" placeholder="Enter Your Address Line 2"
                                       onChange={(e) => setAddressLine2(e.target.value)}/>
                        </div>
                        <div className="field">
                            <label htmlFor="">Phone Number</label>
                            <InputText id="phoneNumber" placeholder="Enter Your Phone Number"
                                       onChange={(e) => setPhoneNumber(e.target.value)}/>
                        </div>

                        <div className="p-card-footer min-w-4">
                            <Button
                                label="Next"

                                style={{width: "80px"}}
                                disabled={emailError != ""}
                                onClick={handleResendOtp}
                            />
                        </div>
                    </form>
                </div>
            </Card>

            <Dialog
                header={type+" Registration"}
                visible={showOtpDialog}
                onHide={() => setShowOtpDialog(false)}
                resizable={false}
                draggable={false}
                modal={true}
                className={"h-auto"}
            >
                <div className={"field"}>
                    <label className={"w-full"}>Create Password</label>
                    <Password className={"w-full"} value={password} onChange={(e) => setPassword(e.target.value)} toggleMask feedback={false}/>

                </div>
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
                <div className="col-12 mt-3">
                    <div className="flex align-items-center">
                        <Checkbox
                            inputId="terms"
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.checked)}
                        />
                        <label htmlFor="terms" className="ml-2">
                            I have read and agree to the{" "}
                            <span
                                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
                                onClick={() => setIsPolicyDialogOpen(true)}
                            >
                                        Privacy and PII Policy
                                    </span>
                            .
                        </label>
                    </div>
                </div>
                <div className="flex flex-row flex-wrap my-2">
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
                        <Message severity="info" text="OTP will expire in 30 seconds"/>
                    </div>
                )}
            </Dialog>
            <Dialog
                header="Privacy and PII Policy"
                visible={isPolicyDialogOpen}
                onHide={() => setIsPolicyDialogOpen(false)}
                closeIcon={false}
                style={{ width: "50vw" }}
            >
                {policyDialogContent}
            </Dialog>
            <Toast ref={toast}/>
        </div>
    );
};

export default RegisterForm;
