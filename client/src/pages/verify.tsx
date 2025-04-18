import { Card, CardHeader } from "@/components/ui/card";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAppContext } from "@/context/DataLayer";
import { axiosInstance } from "@/lib/AxiosInstance";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const VerifyPage = () => {
  const navigate = useNavigate();
  const [code, setCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { authEmail } = useAppContext();
  useEffect(() => {
    if (code.length == 6) {
      handleVerify();
    }
  }, [code]);
  const handleVerify = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/auth/verify-email/${code}?email=${authEmail}`
      );
      const data = res.data;
      toast(data.message);
      if (res.status === 200) {
        navigate(`/dashboard`);
      }
    } catch (error: any) {
      console.log("error:", error?.response?.data?.message || error);
      toast(error?.response?.data?.message || "Error occured on server");
    } finally {
      setCode("");
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center flex-col">
      <Card className="p-12 w-92">
        <CardHeader>
          <h2>Enter 6 Digit Verification Code</h2>
        </CardHeader>
        <InputOTP
          value={code}
          onChange={(value: string) => setCode(value)}
          maxLength={6}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className="w-full flex justify-center items-center">
          {loading && <Loader2 className="animate-spin" />}
        </div>
      </Card>
    </div>
  );
};

export default VerifyPage;
