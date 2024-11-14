'use client'
import axios from 'axios';
import React, { useEffect,useState } from 'react'

const Page = () => {

    const userId = localStorage.getItem("userId");
    const [merchantDetails, setMerchantDetails] = useState(null);

    useEffect(() => {
        const getMerchantDetails = async () => {
            try {   
                const response = await axios.get(`${process.env.NEXT_PUBLIC_CentralService_API_URL}/getMerchant/${userId}`);
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
  return (
    <div>
      Merchant Earnings
      {merchantDetails && <p>Welcome, {merchantDetails.name}</p>}
      {merchantDetails && <p>Total Earnings: ${merchantDetails.earnings}</p>}
    </div>
  );
}

export default Page