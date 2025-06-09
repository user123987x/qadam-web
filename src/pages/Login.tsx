import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserRole } from "@/hooks/useUserRole";
import { mockUsers } from "@/lib/constants";
import { UserRole } from "@/lib/types";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { switchUser } = useUserRole();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "" as UserRole | "",
    rememberMe: false,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for success message from signup
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Demo authentication - in real app, this would call an API
    const user = mockUsers.find(
      (u) =>
        u.email.toLowerCase() === formData.email.toLowerCase() &&
        (formData.role === "" || u.role === formData.role),
    );

    if (user) {
      // Simulate successful login
      switchUser(user.id);

      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    } else {
      setError("Invalid email or password. Please try again.");
    }

    setIsLoading(false);
  };

  const handleDemoLogin = (role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) {
      switchUser(user.id);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App Logo and Title */}
        <div className="text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Construction Manager
          </h1>
          <p className="text-gray-600">
            Sign in to manage your construction projects
          </p>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {successMessage && (
                <Alert className="border-emerald-200 bg-emerald-50">
                  <AlertDescription className="text-emerald-700">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

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
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  required
                />
              </div>

              {/* Role Selection (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="role">Role (Optional)</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as UserRole })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employer">👨‍💼 Employer</SelectItem>
                    <SelectItem value="worker">👷‍♂️ Worker</SelectItem>
                    <SelectItem value="supplier">🏢 Supplier</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                />
                <Label htmlFor="remember" className="text-sm">
                  Remember me
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-4 text-center space-y-2">
              <div>
                <Link
                  to="/forgot-password"
                  className="text-sm text-emerald-600 hover:text-emerald-800"
                >
                  Forgot your password?
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

        {/* Demo Login Options */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center text-blue-800">
              🎯 Demo Access
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-blue-700 text-center mb-4">
              Try the app instantly with demo accounts or use these credentials:
            </p>

            {/* Demo Credentials */}
            <div className="bg-white rounded-lg p-3 text-xs space-y-2">
              <div className="font-medium text-blue-800">
                Demo Login Credentials:
              </div>
              <div className="space-y-1">
                <div>
                  <span className="font-medium">Employer:</span>{" "}
                  ahmad@construction.tj
                </div>
                <div>
                  <span className="font-medium">Worker:</span> farid@worker.tj
                </div>
                <div>
                  <span className="font-medium">Supplier:</span> info@gulnora.tj
                </div>
                <div className="text-gray-600 mt-2">
                  Password: any password works in demo
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start border-blue-300 hover:bg-blue-100"
                onClick={() => handleDemoLogin("employer")}
              >
                <span className="mr-3">👨‍💼</span>
                <div className="text-left">
                  <div className="font-medium">Login as Employer</div>
                  <div className="text-xs text-gray-600">
                    Manage projects & workers
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-blue-300 hover:bg-blue-100"
                onClick={() => handleDemoLogin("worker")}
              >
                <span className="mr-3">👷‍♂️</span>
                <div className="text-left">
                  <div className="font-medium">Login as Worker</div>
                  <div className="text-xs text-gray-600">
                    Log work & track earnings
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="w-full justify-start border-blue-300 hover:bg-blue-100"
                onClick={() => handleDemoLogin("supplier")}
              >
                <span className="mr-3">🏢</span>
                <div className="text-left">
                  <div className="font-medium">Login as Supplier</div>
                  <div className="text-xs text-gray-600">
                    Manage materials & deliveries
                  </div>
                </div>
              </Button>
            </div>

            <div className="text-xs text-blue-600 text-center mt-3">
              All demo accounts use sample data for testing
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

export default Login;
