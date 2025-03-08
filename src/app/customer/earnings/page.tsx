'use client'
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react'
import {useRouter} from "next/navigation";
import ForbiddenPage from "../../../../shared/components/ForbiddenPage/ForbiddenPage";

const Page = () => {
    const [isValidSession, setValidSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const router = useRouter();
    const toast = useRef(null);
    const [merchantDetails, setMerchantDetails] = useState(null);
    const [userType,setUserType] = useState(null);
    useEffect(() => {
        const validator = async () => {
            try {
                const response = await axios.get(`https://central-hub.shopsmartsg.com/auth/validate-token`, {
                    withCredentials: true
                });
                const data = response.data;
                // Debug the response
                if (data.status && data.status.toLowerCase() !== 'failure') {
                    setUserType(data.profileType);
                    setValidSession(true);
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
    useEffect(() => {
        const getMerchantDetails = async () => {
            try {   
                const response = await axios.get(`${process.env.NEXT_PUBLIC_CentralService_API_URL}/getCustomer`);
                if(response.status === 200){
                    setMerchantDetails(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
            
        }
        getMerchantDetails();
    },[])
    if (isLoading){
        return <div>Loading...</div>;
    }
    if(isValidSession){
        return (
            <div className="text-center">
                <h4> Rewards</h4>
                {merchantDetails && <p>Welcome, {merchantDetails.name}</p>}
                {merchantDetails && (
                    <p>Total Reward points: {merchantDetails.rewardPoints} points</p>
                )}
            </div>
        );
    }
    if(userType != 'customer'){
        <ForbiddenPage/>
    }

    else {
        router.push('/customer/login');
        return null;
    }

}

export default Page