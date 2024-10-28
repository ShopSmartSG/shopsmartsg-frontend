import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import axios from "axios";
import { setCookie } from "nookies";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [

    CredentialsProvider({
      
      name: "OTP Login",
      credentials: {
        email: { label: "Email", type: "email" },
        otp: { label: "OTP", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_CentralServiceLogin_API_URL}/profile/login/verifyOtp/merchant`,
            {
              email: credentials.email,
              emailAddress:credentials.email,
              otp: credentials.otp,
            },
            { withCredentials: true }
          );

          if (response.status === 200) {
            const cookies = response.headers["set-cookie"];
            if (cookies) {
              cookies.forEach((cookie) => {
                const [nameValue, ...cookieAttributes] = cookie.split(";");
                const [name, value] = nameValue.split("=");

                setCookie({ res: req }, name.trim(), value.trim(), {
                  path: "/",
                  httpOnly: cookieAttributes.some((attr) =>
                    attr.toLowerCase().includes("httponly")
                  ),
                  secure: cookieAttributes.some((attr) =>
                    attr.toLowerCase().includes("secure")
                  ),
                  sameSite: cookieAttributes.some((attr) =>
                    attr.toLowerCase().includes("samesite=lax")
                  )
                    ? "lax"
                    : "none",
                  maxAge: parseInt(
                    cookieAttributes
                      .find((attr) => attr.toLowerCase().includes("max-age"))
                      ?.split("=")[1] || "0"
                  ),
                  domain: cookieAttributes
                    .find((attr) => attr.toLowerCase().includes("domain"))
                    ?.split("=")[1]
                    ?.trim() || undefined,
                });
              });
            }
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
    strategy: "jwt", // Or "database"
  },
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: process.env.NODE_ENV === "production",
      },
    },
  },
  pages: {
    signIn: "/merchant/login",
  }

});
