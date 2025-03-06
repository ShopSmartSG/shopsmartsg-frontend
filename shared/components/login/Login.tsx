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
import axios from "axios";

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

    const toast = useRef(null);

    const isValidEmail = (email) => {
        return validator.isEmail(email);
    };

    const handleGenerateOTP = () => {
        if (!isValidEmail(email)) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please enter a valid email address.",
            });
            return;
        }

        setShowLoader(true);
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

    const handleLogin = () => {
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
        setTimeout(() => {
            setIsLoading(false);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Login successful!",
            });
            setIsModalOpen(false);
        }, 2000);
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
        const userType = type === "Customer" ? "customer" : "merchant";
           try {
             const response = await axios.get(
               `${process.env.NEXT_PUBLIC_CentralService_API_URL}auth/google/login/${userType}/`,
               { withCredentials: true }
             );

             if (response.status) {
              console.log(response,"RESPONSE Google");

               toast.current.show({
                 severity: "success",
                 summary: "Success",
                 detail: "Login Successful",
                 life: 3000,
               });


             }
           } catch (error) {
               console.log(error,"Error");
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
                            label="Sign In with Google"
                            icon="pi pi-google"
                            className="w-full p-button-outlined p-button-secondary"
                            onClick={handleGoogleSignIn}
                        />
                    </div>
                    <div className="col-12 mt-4">
                        <Button
                            label="Generate OTP"
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