'use client'
//    / src / context / AdminContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

interface AdminContextType {
  adminData: string;
  setAdminData: (data: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [adminData, setAdminData] = useState<string>(null);

  return (
    <AdminContext.Provider value={{ adminData, setAdminData }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdminContext = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdminContext must be used within an AdminProvider");
  }
  return context;
};
