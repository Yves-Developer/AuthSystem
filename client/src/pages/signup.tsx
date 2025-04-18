import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!name) {
      toast("All input must be filled!");
      return;
    }
    if (!email) {
      toast("All input must be filled!");
      return;
    }
    if (!password) {
      toast("All input must be filled!");
      return;
    }
    if (!name && !email && !password) {
      toast("All input must be filled!");
      return;
    }
    //send payload to an api endpoint
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/signup", {
        name,
        email,
        password,
      });
      const data = res.data;
      console.log("Data:", data);
      toast(data.message);
      if (res.status === 201) {
        navigate("/verify");
      }
    } catch (error: any) {
      console.log("error:", error?.response?.data?.message);
      toast(error.response.data.message);
    } finally {
      setName("");
      setEmail("");
      setPassword("");
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <Card className="p-5 w-92">
        <CardHeader>
          <h2 className="text-2xl">Sign Up to 3CodeVault</h2>
        </CardHeader>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            className=""
          />
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
            Sign Up
          </Button>
        </form>
        <CardFooter className="flex gap-3 items-center">
          <a href="/login">
            <Button variant="link">Login</Button>
          </a>

          <a href="/forgot-password">
            <Button variant="link">Forgot Password?</Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SignUp;
