'use client';
import React, {useEffect, useRef, useState} from "react";
import ResetPass from "../../../../shared/components/resetPassword/ResetPass";
import {Toast} from "primereact/toast";
import axios from "axios";
import {useRouter} from "next/navigation";

const Page = () => {
    const [isValidSession,setValidSession] = useState(false);
    const router = useRouter();
    const toast = useRef(null);
    useEffect(()=>{
        const validator = async() => {
            try{
                const response  = await axios.get(`https://central-hub.shopsmartsg.com/auth/validate-token`,{
                    withCredentials:true
                })

                const data = (await response.data);
                if(data.status.toLowerCase() != 'failure'){
                    setValidSession(true);
                }
                else{
                    setValidSession(false);
                    toast.current.show({severity: "error", detail: "You are logged out!! Please Login Again",summary:'Error'});
                }

            }
            catch(error){
                setValidSession(false);
            }
        }
        validator();
    },[])
    if(isValidSession){
        return (
            <div>
                <ResetPass/>
                <Toast ref={toast} position="top-right"/>
            </div>

        )
    }
    else{
        router.push('/customer/login');
    }

}


export default Page;