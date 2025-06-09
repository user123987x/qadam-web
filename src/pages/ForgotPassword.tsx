import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // In a real app, this would call an API to send password reset email
    console.log("Sending password reset email to:", email);

    setIsLoading(false);
    setEmailSent(true);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">📧</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Check Your Email
            </h1>
            <p className="text-gray-600">
              We've sent password reset instructions to your email
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="text-emerald-800 font-medium mb-2">
                    Email Sent Successfully!
                  </div>
                  <div className="text-sm text-emerald-700">
                    We've sent password reset instructions to:
                  </div>
                  <div className="text-sm font-medium text-emerald-800 mt-1">
                    {email}
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    Please check your email inbox (and spam folder) for the
                    password reset link.
                  </p>
                  <p>The link will expire in 1 hour for security reasons.</p>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Send to Different Email
                  </Button>

                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Back to Sign In
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-gray-500">
            Didn't receive the email? Check your spam folder or contact support
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App Logo and Title */}
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive password reset instructions
          </p>
        </div>

        {/* Reset Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Forgot Password</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
                <div className="text-xs text-gray-600">
                  We'll send password reset instructions to this email
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading
                  ? "Sending Instructions..."
                  : "Send Reset Instructions"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <div>
                <Link
                  to="/login"
                  className="text-sm text-emerald-600 hover:text-emerald-800"
                >
                  ← Back to Sign In
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Sign up
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-800 mb-2">Need Help?</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>If you're having trouble resetting your password:</p>
                <p>• Make sure you're using the email you registered with</p>
                <p>• Check your spam or junk mail folder</p>
                <p>• Contact our support team for assistance</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-blue-300 hover:bg-blue-100"
              >
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          Construction Manager v1.0.0 - Built for Tajikistan
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
