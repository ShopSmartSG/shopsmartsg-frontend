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
    return await session;
}

export async function updateSession(request: NextRequest) {
    const session = request.cookies.get("session")?.value;
    if (!session) return;

    // Refresh the session so it doesn't expire



    return session;
}
