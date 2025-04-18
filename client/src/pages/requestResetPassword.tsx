import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2 } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

const RequestResetPassword = () => {
  const [email, setEmail] = useState<string>("");
  const [emailSent, setEmailSent] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) {
      toast("All input must be filled!");
      return;
    }
    //send payload to an api endpoint
    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/send-reset-password", {
        email,
      });
      const data = res.data;
      console.log("Data:", data);
      if (res.status === 200) {
        setEmailSent(true);
      }
      toast(data.message);
    } catch (error: any) {
      console.log("error:", error?.response?.data?.message || error);
      toast(error?.response?.data?.message || "Server error");
    } finally {
      setEmail("");
      setLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
        <Card className="p-5 w-92">
          <CardHeader>
            <h2 className="text-2xl">Reset Link was sent!</h2>
          </CardHeader>
          <CardContent>
            <p>Password reset link was sent to your email.</p>
            <p>
              Kindly, open your email and tap on link to reset your password.
            </p>
          </CardContent>
          <CardFooter>
            <a href="/login">
              <Button>Back To Login</Button>
            </a>
          </CardFooter>
        </Card>
      </div>
    );
  }
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-4">
      <Card className="p-5 w-92">
        <CardHeader>
          <h2 className="text-lg">Request Reset New Password</h2>
        </CardHeader>
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <Button type="submit" disabled={loading}>
            {loading && <Loader2 className="animate-spin" />}
            Request Reset Password
          </Button>
        </form>
        <CardFooter className="flex gap-3 items-center">
          <a href="/login">
            <Button variant="link">Login</Button>
          </a>

          <a href="/">
            <Button variant="link">Sign Up</Button>
          </a>
        </CardFooter>
      </Card>
    </div>
  );
};

export default RequestResetPassword;
