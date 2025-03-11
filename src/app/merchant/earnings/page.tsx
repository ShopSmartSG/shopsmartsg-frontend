'use client'
import axios from 'axios';
import React, {useEffect, useRef, useState} from 'react'
import { Toast } from 'primereact/toast';
import {useRouter} from 'next/navigation';
import ForbiddenPage from "../../../../shared/components/ForbiddenPage/ForbiddenPage";

const Page = () => {
    const [isValidSession, setValidSession] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const toast  = useRef(null);
    const [userType, setUserType] = useState(null);
    const router = useRouter();
    const [merchantDetails, setMerchantDetails] = useState(null);
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
    }, []);

    useEffect(() => {
        const getMerchantDetails = async () => {
            try {   

                const response = await axios.get(`${process.env.NEXT_PUBLIC_CentralService_API_URL}api/getMerchant/rewards`,
                    { withCredentials: true });
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


    if(isLoading){
        return <div>Loading...</div>
    }
    if(userType && userType != 'merchant'){
        return <ForbiddenPage/>
    }
    if(isValidSession){
        return (
            <div>
                Merchant Earnings
                {merchantDetails && <p>Welcome !!!</p>}
                {merchantDetails && <p>Total Earnings: ${merchantDetails.earnings}</p>}
                <Toast ref={toast} />
            </div>
        );
    }
    else{
        router.push('/merchant/login');
        return null;
    }

}

export default Page