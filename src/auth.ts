import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
          name: "OTP Login",
          credentials: {
            email: { label: "email", type: "email" },
            emailAddress: { label: "emailAddress", type: "email" },
            otp: { label: "otp", type: "password" },
          },
          async authorize(credentials) {
            try {
              // Verify OTP with Spring Boot
            //   const response = await axios.post("http://localhost:8080/auth/verify-otp", {
            //     email: credentials.email,
            //     otp: credentials.password,
            //   }, { withCredentials: true }); // Ensure cookies are included
              const response = await axios.post(`${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/login/verifyOtp/merchant`,{
                email: credentials.email,
                emailAddress:credentials.email,
                otp: credentials.otp
              },
              {
                  withCredentials: true, // Include credentials with the request
                })
                console.log(response.headers,"RESPONSE HEADERS")
              if (response.status === 200) {
                // Return user data from Spring Boot response to establish session
                return response.data || null;
              }
            } catch (error) {
              console.error("Error during authorization:", error);
            }
            return null;
          },
        }),
      ],
      session: {
        strategy: undefined, // Use Spring Boot’s session instead of JWT
      },
     
      pages: {
        signIn: "/merchant/login",
      }
})