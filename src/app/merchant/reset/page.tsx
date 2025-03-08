'use client'
import React, {useEffect, useRef, useState} from "react";
import ResetPass from "../../../../shared/components/resetPassword/ResetPass";
import {useRouter} from "next/navigation";
import axios from "axios";
import ForbiddenPage from "../../../../shared/components/ForbiddenPage/ForbiddenPage";

const Page = () => {
    const [isValidSession, setValidSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const router = useRouter();
    const [userType, setUserType] = useState(null);
    const toast = useRef(null);



    useEffect(() => {
        const validator = async () => {
            try {
                const response = await axios.get(`https://central-hub.shopsmartsg.com/auth/validate-token`, {
                    withCredentials: true
                });
                const data = response.data;
                console.log('API Response:', data); // Debug the response
                if (data.status && data.status.toLowerCase() !== 'failure') {
                    setValidSession(true);
                    setUserType(data.profileType);
                } else {
                    setValidSession(false);
                    toast.current.show({ severity: "error", detail: "You are logged out!! Please Login Again", summary: 'Error' });
                }
            } catch (error) {
                console.error('Validation Error:', error); // Log the error
                setValidSession(false);
            } finally {
                setIsLoading(false);
            }
        };
        validator();
    }, []); // Empty dependency array
    if (isLoading) {
        return <div>Loading...</div>;
    }

    if(userType && userType != 'merchant'){
        return <ForbiddenPage/>
    }
    if(isValidSession){
        return (
            <ResetPass/>
        )
    }
    else{
        router.push('/merchant/login');
        return null;
    }

}


export default Page;