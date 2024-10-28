'use server'
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function logout() {
    // Destroy the session
    cookies().set("session", "", { expires: new Date(0) });
}

export async function getSession() {
    const session = cookies().get("userId")?.value;
    if (!session) return null;
    const sessvalue = await session;

    // Set localStorage values
    if (typeof window !== 'undefined') {
        localStorage.setItem('userId', sessvalue);
        localStorage.setItem('USER_TYPE', 'merchant');
    }

    return sessvalue;
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire
    cookies().set("session", session, { maxAge: 3600 }); // Example: extend session by 1 hour

    return session;
}
