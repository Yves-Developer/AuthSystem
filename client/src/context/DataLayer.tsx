import { axiosInstance } from "@/lib/AxiosInstance";
import {
  useContext,
  createContext,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useEffect,
} from "react";

// Define the shape of the context
type AppContextType = {
  userName: string;
  setUserName: Dispatch<SetStateAction<string>>;
  userEmail: string;
  setUserEmail: Dispatch<SetStateAction<string>>;
  auth: boolean;
  setAuth: Dispatch<SetStateAction<boolean>>;
  isVerified: boolean;
  setIsVerified: Dispatch<SetStateAction<boolean>>;
  authEmail: string;
  setAuthEmail: Dispatch<SetStateAction<string>>;
};

// Create the context with an initial `undefined` value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Type for children prop
type DataLayerProps = {
  children: ReactNode;
};

const DataLayer = ({ children }: DataLayerProps) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [auth, setAuth] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    checkAuth();
  });

  const checkAuth = async () => {
    try {
      const res = await axiosInstance.get("/auth/check-user-loggedin");
      const data = res.data;
      console.log(data);
      if (res.status === 200) {
        setAuth(true);
        setAuthEmail(data.email);
      }
    } catch (error) {}
  };
  return (
    <AppContext.Provider
      value={{
        userName,
        isVerified,
        setIsVerified,
        auth,
        setAuth,
        setUserName,
        userEmail,
        setUserEmail,
        authEmail,
        setAuthEmail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default DataLayer;

// Custom hook for easier consumption
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within a DataLayer");
  }
  return context;
};
