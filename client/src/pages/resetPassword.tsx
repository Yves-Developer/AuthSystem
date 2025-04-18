import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/DataLayer";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [email, setEmail] = useState<string>("");
  const [newpassword, setNewpassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { auth } = useAppContext();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast("All input must be filled!");
      return;
    }
    if (!newpassword) {
      toast("All input must be filled!");
      return;
    }
    if (!email && !newpassword) {
      toast("All input must be filled!");
      return;
    }
    //send payload to an api endpoint
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/reset-password", {
        email,
        token,
        newpassword,
      });
      const data = res.data;
      console.log("Data:", data);
      toast(data.message);
      if (res.status === 200) {
        auth ? navigate(`/dashboard`) : navigate("/login");
      }
    } catch (error: any) {
      console.log("error:", error?.response?.data?.message || error);
      toast(error?.response?.data?.message || "Server error");
    } finally {
      setEmail("");
      setNewpassword("");
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <Card className="p-5 w-92">
        <CardHeader>
          <h2>Reset New Password</h2>
        </CardHeader>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Input
            type="password"
            value={newpassword}
            onChange={(e) => setNewpassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Reset Password
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;
