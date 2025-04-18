import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { useAppContext } from "@/context/DataLayer";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2, Verified } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Dashboard = () => {
  const {
    userName,
    userEmail,
    setIsVerified,
    isVerified,
    setAuth,
    setUserName,
    setUserEmail,
  } = useAppContext();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    getUserDetails();
  }, []);
  const getUserDetails = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`auth/user`);
      const data = res.data;
      console.log(data);
      setUserEmail(data.sentData.email);
      setUserName(data.sentData.name);
      setIsVerified(data.sentData.isVerified);
    } catch (error: any) {
      console.log("Error:", error?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center">
        <Card className="p-3 w-96 justify-center items-center">
          <Loader2 className="animate-spin" />
        </Card>
      </div>
    );
  }

  //Handle Logout
  const handleLogout = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/auth/logout");
      const data = res.data;
      toast(data.message);
      setAuth(false);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center">
      <Card className="p-3 w-96">
        <CardHeader className="flex justify-between">
          {isVerified ? (
            <h2 className="flex gap-3">
              <Verified className="text-primary" />
              Verifed User
            </h2>
          ) : (
            <h2>
              <Verified className="bg-destructive" />
              Unverifed User
            </h2>
          )}
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </CardHeader>
        <CardContent>
          <h2>Name: {userName}</h2>
          <h2>Email: {userEmail}</h2>
        </CardContent>
        <CardFooter className="w-full justify-center">
          <Button onClick={handleLogout}>Logout</Button>
          <a href="/forgot-password">
            <Button variant="link">Reset Password</Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Dashboard;
