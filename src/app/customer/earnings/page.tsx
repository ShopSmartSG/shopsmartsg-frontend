'use client'
import axios from 'axios';
import React, { useEffect,useState } from 'react'

const Page = () => {

    const userId = localStorage.getItem("userId");
    const [merchantDetails, setMerchantDetails] = useState(null);

    useEffect(() => {
        const getMerchantDetails = async () => {
            try {   
                const response = await axios.get(`${process.env.NEXT_PUBLIC_CentralService_API_URL}/getCustomer/${userId}`);
                if(response.status === 200){
                    setMerchantDetails(response.data);
                }
            }
            catch (error) {
                console.log(error);
            }
            
        }
        getMerchantDetails();
    },[userId])
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

export default Page