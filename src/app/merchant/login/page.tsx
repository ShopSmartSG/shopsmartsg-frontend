/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import "./login.css";



import Login from "../../../../shared/components/login/Login";

const EmailOtpForm = () => {
 //  const [email, setEmail] = useState("");
 //  const [otp, setOtp] = useState("");
 //  const [otpError, setOtpError] = useState(false);
 //  const [showOtpDialog, setShowOtpDialog] = useState(false);
 //  const [emailError, setEmailError] = useState("");
 //  const [otpCount, setOtpCount] = useState(0);
 //  const [resendDisabled, setResendDisabled] = useState(true);
 //  const [timer, setTimer] = useState(30); //
 //  const disabledCondition: boolean = otpCount >= 3;
 //
 //  const [userTyped, setUserType] = useState("");
 //  const toast = useRef(null);
 //  const { setAdminData, setUserTyped } = useAdminContext();
 //
 //
 //  useEffect(() => {
 //    let interval;
 //    if (resendDisabled) {
 //      interval = setInterval(() => {
 //        setTimer((prevTimer) => {
 //          if (prevTimer > 0) {
 //            return prevTimer - 1;
 //          } else {
 //            setResendDisabled(false);
 //            clearInterval(interval);
 //            return 30;
 //          }
 //        });
 //      }, 1000);
 //    }
 //
 //    return () => clearInterval(interval);
 //  }, [resendDisabled]);
 //
 //  const router = useRouter();
 //
 //  const handleEmailSubmit = (e) => {
 //    e.preventDefault();
 //    setEmailError("");
 //
 //    if (!validator.isEmail(email)) {
 //      setEmailError("Please enter a valid email address.");
 //      return;
 //    }
 //
 //    setShowOtpDialog(true);
 //    setResendDisabled(true);
 //  };
 // let userType, userId;
 //  try {
 //    userType = localStorage.getItem('userType');
 //    userId = localStorage.getItem('userId');
 //  } catch (error) {
 //    console.error("Error accessing localStorage: ", error);
 //  }
 //  const blurHandler = (value: string) => {
 //    if (validator.isEmail(value)) {
 //      setEmailError("");
 //    } else {
 //      setEmailError("Please enter a valid email address.");
 //    }
 //  };
 //
 //  const handleOtpSubmit = async () => {
 //    try {
 //      const response = await axios.post(
 //        `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/login/verifyOtp/merchant`,
 //        {
 //          email: email,
 //          emailAddress: email,
 //          otp: otp,
 //        },
 //        { withCredentials: true }
 //      );
 //
 //      if (response.status) {
 //        const { userId } = await response.data
 //        localStorage.setItem('userType', 'MERCHANT');
 //        localStorage.setItem('userId', userId);
 //        setAdminData(userId);
 //        setUserTyped("merchant");
 //
 //        toast.current.show({
 //          severity: "success",
 //          summary: "Success",
 //          detail: "Login Successful",
 //          life: 3000,
 //        });
 //        setShowOtpDialog(false);
 //
 //      }
 //    } catch (error) {
 //      toast.current.show({
 //        status: "error",
 //        message: "Error submitting OTP. Please try again later.",
 //      });
 //      setShowOtpDialog(false);
 //    }
 //  };
 //
 //  // const otpValidator = (value: string) => {
 //  //   const result = validator.isNumeric(value);
 //  //   if (result) {
 //  //     setOtpError(false);
 //  //     setOtp(value);
 //  //   } else {
 //  //     setOtpError(true);
 //  //   }
 //  // };
 //
 //  const handleResendOtp = () => {
 //    setResendDisabled(true);
 //    setTimer(30);
 //    toast.current.show({
 //      severity: "info",
 //      summary: "OTP Resent",
 //      detail: "OTP has been resent to your email.",
 //      life: 3000,
 //    });
 //  };
 //  const handleEmail = async () => {
 //    setShowOtpDialog(true);
 //    setResendDisabled(true);
 //
 //    try {
 //      const response = await axios.post(
 //        `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/login/generateOtp/merchant`,
 //        {
 //          email,
 //        },
 //        {
 //          withCredentials: true, // Include credentials with the request
 //        }
 //      );
 //    } catch (error) {
 //      console.error("Error sending email: ", error);
 //      toast.current.show({
 //        severity: "error",
 //        summary: "Error",
 //        detail: "Failed to send email. Please try again later.",
 //        life: 3000,
 //      });
 //    }
 //  };
 //  if (userType && userType === "MERCHANT" && userId) {
 //    router.push(`/merchant/manage/view`);
 //  }
 //  else {
     return (
       //
         <Login type = {"Merchant"}/>
     );
  // }
  
  
};

export default EmailOtpForm;
