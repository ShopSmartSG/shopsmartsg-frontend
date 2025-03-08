/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import RegisterForm from "../../../../shared/components/register/page";
import {useState, useRef, useEffect} from "react";
import {useRouter} from "next/navigation";
import axios from "axios";

const EmailOtpForm = () => {

  const [isValidSession, setValidSession] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const router = useRouter();
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
    if (isLoading){
        return <div>Loading...</div>;
    }
    if(isValidSession){
      return (
          <RegisterForm type={"Merchant"}/>
      );
    }
    else{
        router.push('/merchant/login');
        return null;
    }
};

export default EmailOtpForm;
