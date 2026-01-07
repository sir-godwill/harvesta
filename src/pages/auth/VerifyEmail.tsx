import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { verifyAccount } from "@/lib/api";

export default function VerifyEmail() {
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleVerify = async () => {
    if (code.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setIsLoading(true);
    try {
      const { success } = await verifyAccount(code);
      if (success) {
        toast.success("Email verified successfully!");
        // Redirect handled by auth state change
      }
    } catch (error) {
      toast.error("Invalid or expired code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      // Placeholder: resend verification email
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success("Verification email sent!");
    } catch (error) {
      toast.error("Failed to resend email. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-3xl font-bold text-primary">Harvestá</h1>
          </Link>
        </div>

        <Card className="border-0 shadow-lg">
          <CardContent className="pt-8 pb-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verify your email</h2>
              <p className="text-muted-foreground">
                We've sent a verification code to your email address. Enter the code below to verify your account.
              </p>
            </div>

            <div className="flex flex-col items-center gap-6">
              <InputOTP
                value={code}
                onChange={setCode}
                maxLength={6}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>

              <Button
                onClick={handleVerify}
                className="w-full bg-primary hover:bg-primary/90"
                disabled={isLoading || code.length !== 6}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify email"
                )}
              </Button>

              <p className="text-sm text-muted-foreground">
                Didn't receive the code?{" "}
                <button
                  onClick={handleResend}
                  disabled={isResending}
                  className="text-primary hover:underline disabled:opacity-50"
                >
                  {isResending ? "Sending..." : "Resend"}
                </button>
              </p>
            </div>

            <div className="mt-8 text-center">
              <Link
                to="/login"
                className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
