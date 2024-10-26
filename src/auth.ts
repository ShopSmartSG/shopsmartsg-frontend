import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import email from "next-auth/providers/email";
export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        CredentialsProvider({
          name: "OTP Login",
          credentials: {
            email: { label: "email", type: "email" },
            password: { label: "password", type: "text" },
          },
          async authorize(credentials) {
            try {
              // Verify OTP with Spring Boot
            //   const response = await axios.post("http://localhost:8080/auth/verify-otp", {
            //     email: credentials.email,
            //     otp: credentials.password,
            //   }, { withCredentials: true }); // Ensure cookies are included
            const response = await axios.post("http://localhost:8084/profile/login/verifyOtp/merchant",{
              email: credentials.email,
              otp: credentials.password
            })
    
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
        strategy: 'jwt', // Use Spring Boot’s session instead of JWT
      },
     
      pages: {
        signIn: "/customer/login",
      }
})