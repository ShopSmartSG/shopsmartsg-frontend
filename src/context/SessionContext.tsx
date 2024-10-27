"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface SessionContextProps {
  session: string | null;
}

const SessionContext = createContext<SessionContextProps | undefined>(
  undefined
);

export const SessionProvider = ({
  children,
  session,
}: {
  children: ReactNode;
  session: string | null;
}) => {
  return (
    <SessionContext.Provider value={{ session }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
};
