import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAppContext } from "@/context/DataLayer";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { setAuth } = useAppContext();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast("All input must be filled!");
      return;
    }
    if (!password) {
      toast("All input must be filled!");
      return;
    }
    if (!email && !password) {
      toast("All input must be filled!");
      return;
    }
    //send payload to an api endpoint
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/login", {
        email,
        password,
      });
      const data = res.data;
      console.log("Data:", data);
      toast(data.message);
      if (res.status === 200) {
        setAuth(true);
        navigate(`/dashboard`);
      }
    } catch (error: any) {
      console.log("error:", error?.response?.data?.message || error);
      toast(error?.response?.data?.message || "Server error");
    } finally {
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <Card className="p-5 w-92">
        <CardHeader>
          <h2 className="text-2xl">Login to 3CodeVault</h2>
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Login
          </Button>
        </form>
        <CardFooter className="flex gap-3 items-center">
          <a href="/">
            <Button variant="link">Sign Up</Button>
          </a>

          <a href="/forgot-password">
            <Button variant="link">Forgot Password?</Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
