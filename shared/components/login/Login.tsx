"use client";
import React, {useState, useRef} from "react";
import {Card} from "primereact/card";
import {InputText} from "primereact/inputtext";
import {FloatLabel} from "primereact/floatlabel";
import {Password} from "primereact/password";
import {Button} from "primereact/button";
import {Toast} from "primereact/toast";
import {ProgressSpinner} from "primereact/progressspinner";
import {Dialog} from "primereact/dialog";
import {InputOtp} from "primereact/inputotp";
import {Checkbox} from "primereact/checkbox";
import validator from "validator";
import "./login.css";
import { Divider } from 'primereact/divider';
import {useAdminContext} from "@/context/AdminContext";

import axios from "axios";
import Link from "next/link";

interface LoginProps {
    type?: string
}

const Login = ({type}: LoginProps) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpGenerated, setIsOtpGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);
    const {setUserTyped} = useAdminContext()
    const userType = type.toLowerCase();
    const toast = useRef(null);

    const isValidEmail = (email) => {
        return validator.isEmail(email);
    };

    const handleGenerateOTP = async () => {
        if (!isValidEmail(email)) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please enter a valid email address.",
            });
            return;
        }

        setShowLoader(true);
        try{
            const response = await axios.get(`${process.env.NEXT_PUBLIC_CentralService_API_URL}profile/login/generateOtp/${type.toLowerCase()}`);
            const data = await response.data;
            console.log(data);
        }
        catch(error){
            console.log(error,"Error Generating OTP");
        }
        setTimeout(() => {
            setShowLoader(false);
            setIsOtpGenerated(true);
            setIsModalOpen(true); // Open the modal after OTP generation
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "OTP has been sent to your email.",
            });
        }, 2000);
    };

    const handleLogin = async () => {
        if (!termsAccepted) {
            toast.current.show({
                severity: "warn",
                summary: "Warning",
                detail: "You must accept the Privacy and PII terms to proceed.",
            });
            return;
        }

        if (!otp) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please enter the OTP.",
            });
            return;
        }

        if (!password) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please enter the password.",
            });
            return;
        }

        setIsLoading(true);
        const userType = type?.toLowerCase() ;
        
        try {
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_CentralService_API_URL}auth/native/login/${userType}`,
                {
                    email: email,
                    emailAddress: email,
                    otp: otp,
                    password: password
                },
                { withCredentials: true }
            );
            
            if (response.data.status === 'success') {
                toast.current.show({
                    severity: "success",
                    summary: "Success",
                    detail: "Login successful!",
                });
                
                // Redirect to the provided URI if success
                if (response.data.redirect_uri) {
                    window.location.href = response.data.redirect_uri;
                }
                
                setIsModalOpen(false);
            } else {
                toast.current.show({
                    severity: "error",
                    summary: "Error",
                    detail: "Invalid Email OTP or Password. Try again or sign in with Google.",
                });
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Invalid Email OTP or Password. Try again or sign in with Google.",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendOTP = () => {
        setOtp("");
        toast.current.show({
            severity: "info",
            summary: "Info",
            detail: "OTP has been reset. Please generate a new one.",
        });
    };

    const handleGoogleSignIn = async () => {
        const userType = type.toLowerCase();

           try {
             const response = await axios.get(
               `${process.env.NEXT_PUBLIC_CentralService_API_URL}auth/google/login/${userType}`,
                 { withCredentials: true }
             );

             console.log(response,"RESPONESE GOOGLE");
             if (response.status == 302) {
                const location = await response.data;
                window.location.href  = location;
               toast.current.show({
                 severity: "success",
                 summary: "Success",
                 detail: "Login Successful",
                 life: 3000,
               });
setUserTyped(type);

             }
           } catch (error) {
               console.log(error,"Error");
               const location  = error.response.data;
               setUserTyped(type);
                window.location.href = location;
             toast.current.show({
               status: "error",
               message: "Error submitting OTP. Please try again later.",
             });

           }
    };

    const footerContent = (
        <div className="flex justify-content-between">
            <Button
                label="Resend OTP"
                icon="pi pi-refresh"
                onClick={handleResendOTP}
                className="p-button-text"
            />
            <Button
                label="Login"
                icon="pi pi-check"
                onClick={handleLogin}
                disabled={!otp || !password || !termsAccepted}
            />
        </div>
    );

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

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Card title={type+" Login"} className="w-full md:w-30rem shadow-2">
                <Toast ref={toast}/>
                <div className="grid">
                    <div className="col-12">
                        <FloatLabel>
                            <InputText
                                id="username"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full"
                            />
                            <label htmlFor="username">Email ID</label>
                        </FloatLabel>
                    </div>
                    <div className="col-12 mt-4">
                        <Button
                            label="Sign In with Password & OTP"
                            className="w-full p-button-outlined"
                            onClick={handleGenerateOTP}
                            disabled={!email}
                        />
                        {showLoader && (
                            <div className="flex justify-content-center mt-3">
                                <ProgressSpinner style={{width: "50px", height: "50px"}}/>
                            </div>
                        )}
                    </div>
                    <Divider/>
                    <div className="col-12 mt-4">
                        <Button
                            label="Sign In with Google"
                            icon="pi pi-google"
                            className="w-full p-button-outlined p-button-secondary"
                            onClick={handleGoogleSignIn}
                        />

                    </div>
                    <Divider/>
                    <div className="col-12 mt-4 text-center">

                        <Link href={`/${userType}/register`}>Click here to register.</Link>
                    </div>

                </div>

                <Dialog
                    header="Login"
                    draggable={false}
                    dismissableMask={true}
                    resizable={false}
                    visible={isModalOpen}
                    onHide={() => setIsModalOpen(false)}
                    footer={footerContent}
                    style={{width: "30vw", height: "auto"}}
                >
                    <div className="flex flex-column gap-3">
                        <div className="col-12 mt-3">
                            <FloatLabel>
                                <Password
                                    inputId="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    toggleMask
                                    feedback={false}
                                    className="w-full"
                                />
                                <label htmlFor="password">Password</label>
                            </FloatLabel>
                        </div>
                        <div className={"col-12 mt-3 mx-3"}>
                            <div className="field">
                                <label htmlFor="otp">OTP</label>
                                <InputOtp
                                    value={otp}
                                    onChange={(e) => setOtp(e.value.toString())}
                                    length={6}
                                    className="w-full"
                                    mask={true}
                                />
                            </div>
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
                                        style={{color: "blue", cursor: "pointer", textDecoration: "underline"}}
                                        onClick={() => setIsPolicyDialogOpen(true)}
                                    >
                                        Privacy and PII Policy
                                    </span>
                                    .
                                </label>
                            </div>
                        </div>
                        {isLoading && (
                            <div className="flex justify-content-center mt-3">
                                <ProgressSpinner style={{width: "50px", height: "50px"}}/>
                            </div>
                        )}
                    </div>
                </Dialog>

                <Dialog
                    header="Privacy and PII Policy"
                    visible={isPolicyDialogOpen}
                    onHide={() => setIsPolicyDialogOpen(false)}
                    closeIcon={false}
                    style={{width: "50vw"}}
                >
                    {policyDialogContent}
                </Dialog>
            </Card>
        </div>
    );
};

export default Login;