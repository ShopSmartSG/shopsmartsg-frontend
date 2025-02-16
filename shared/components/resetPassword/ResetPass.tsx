'use client'
import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "primeicons/primeicons.css";
import { Password } from "primereact/password";

const ResetPasswordPage = () => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [updatedPassword, setUpdatedPassword] = useState("");
    const [confirmUpdatedPassword, setConfirmUpdatedPassword] = useState("");
    const [isConfirmPasswordTouched, setIsConfirmPasswordTouched] = useState(false);
    const [isUpdatedPasswordTouched, setIsUpdatedPasswordTouched] = useState(false);
    const toast = useRef(null);

    const databasePassword = "password123";

    const isFormValid = () => {
        return (
            currentPassword.trim() &&
            updatedPassword.trim() &&
            confirmUpdatedPassword.trim() &&
            updatedPassword === confirmUpdatedPassword
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentPassword.trim() || !updatedPassword.trim() || !confirmUpdatedPassword.trim()) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "All fields are required.",
            });
            return;
        }

        if (currentPassword !== databasePassword) {
            toast.current.show({
                severity: "warn",
                summary: "Error",
                detail: "Incorrect current password.",
            });
            return;
        }

        if (updatedPassword !== confirmUpdatedPassword) {
            toast.current.show({
                severity: "warn",
                summary: "Validation Error",
                detail: "Updated passwords do not match.",
            });
            return;
        }

        toast.current.show({
            severity: "success",
            summary: "Success",
            detail: "Password has been updated successfully.",
        });

        // Reset form fields
        setCurrentPassword("");
        setUpdatedPassword("");
        setConfirmUpdatedPassword("");
        setIsConfirmPasswordTouched(false);
        setIsUpdatedPasswordTouched(false);
    };

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
            <div className="p-card" style={{ width: "400px", padding: "20px" }}>
                <h2 className="text-center">Reset Password</h2>
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <form onSubmit={handleSubmit} style={{ width: "100%" }}>
                        <div className="field">
                            <label htmlFor="currentPassword" className={"w-full"}>Current Password</label>
                            <Password
                                id="currentPassword"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                type="password"
                                className="w-full"
                                placeholder="Enter current password"
                                feedback={false}
                                toggleMask={true}
                                required
                            />
                        </div>

                        <div className="field my-2 w-full">
                            <label htmlFor="updatedPassword" className={"w-full"}>Updated Password</label>
                            <Password
                                id="updatedPassword"
                                value={updatedPassword}
                                onChange={(e) => setUpdatedPassword(e.target.value)}
                                onBlur={() => setIsUpdatedPasswordTouched(true)}
                                type="password"
                                className="w-full"
                                placeholder="Enter updated password"
                                required
                                feedback={false}
                                toggleMask={true}
                            />
                            {isUpdatedPasswordTouched && updatedPassword.length < 8 && (
                                <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                                    Password must be at least 8 characters long.
                                </p>
                            )}
                        </div>

                        <div className="field my-2 w-full">
                            <label htmlFor="confirmUpdatedPassword">Confirm Updated Password</label>
                            <Password
                                id="confirmUpdatedPassword"
                                value={confirmUpdatedPassword}
                                onChange={(e) => setConfirmUpdatedPassword(e.target.value)}
                                onBlur={() => setIsConfirmPasswordTouched(true)}
                                type="password"
                                className="w-full"
                                placeholder="Confirm updated password"
                                required
                                feedback={false}
                                toggleMask={true}
                            />
                            {isConfirmPasswordTouched && updatedPassword !== confirmUpdatedPassword && (
                                <p style={{ color: "red", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                                    Confirm Password does not match Updated Password.
                                </p>
                            )}
                        </div>

                        <Button
                            label="Reset Password"
                            className="p-button-primary text-center"
                            type="submit"
                            style={{ width: "100%", marginTop: "1rem" }}
                            disabled={!isFormValid()} // Disable button if form is not valid
                        />
                    </form>
                </div>
            </div>

            <Toast ref={toast} />
        </div>
    );
};

export default ResetPasswordPage;