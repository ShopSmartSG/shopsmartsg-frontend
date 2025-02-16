"use client";

import React, { useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import "./login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [isOtpGenerated, setIsOtpGenerated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const toast = React.useRef(null);

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
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

        if (!password) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Password cannot be empty.",
            });
            return;
        }

        // Simulate OTP generation with a loader
        setShowLoader(true);
        setTimeout(() => {
            setShowLoader(false);
            setIsOtpGenerated(true);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "OTP has been sent to your email.",
            });
        }, 2000);
    };

    const handleLogin = () => {
        if (!otp) {
            toast.current.show({
                severity: "error",
                summary: "Error",
                detail: "Please enter the OTP.",
            });
            return;
        }

        // Simulate login processing with a loader
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            toast.current.show({
                severity: "success",
                summary: "Success",
                detail: "Login successful!",
            });
        }, 2000);
    };

    return (
        <div className="flex justify-content-center align-items-center min-h-screen">
            <Card title="Login" className="w-full md:w-30rem shadow-2">
                <Toast ref={toast} />
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
                    <div className="col-12 mt-4">
                        <Button
                            label="Generate OTP"
                            className="w-full p-button-outlined"
                            onClick={handleGenerateOTP}
                            disabled={!email || !password}
                        />
                        {showLoader && (
                            <div className="flex justify-content-center mt-3">
                                <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                            </div>
                        )}
                    </div>
                    {isOtpGenerated && (
                        <>
                            <div className="col-12 mt-4">
                                <FloatLabel>
                                    <InputText
                                        id="otp"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        className="w-full"
                                    />
                                    <label htmlFor="otp">Enter OTP</label>
                                </FloatLabel>
                            </div>
                            <div className="col-12 mt-4">
                                <Button
                                    label="Login"
                                    className="w-full"
                                    onClick={handleLogin}
                                    disabled={!otp}
                                />
                                {isLoading && (
                                    <div className="flex justify-content-center mt-3">
                                        <ProgressSpinner style={{ width: "50px", height: "50px" }} />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default Login;