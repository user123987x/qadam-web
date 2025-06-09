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
import {
  BuildingIcon,
  WorkerIcon,
  EmployerIcon,
  SupplierIcon,
} from "@/components/ui/icons";

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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App Branding */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-soft-green to-deep-blue rounded-2xl flex items-center justify-center shadow-large">
              <BuildingIcon size={32} className="text-white" />
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-soft-green rounded-full border-2 border-white"></div>
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-neutral-800 tracking-tight">
              Construction Manager
            </h1>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Streamline your construction projects with professional management
              tools
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="app-card-elevated">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-medium text-neutral-800">
              Welcome Back
            </CardTitle>
            <p className="text-sm text-neutral-600 mt-1">
              Sign in to your account
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {successMessage && (
                <Alert className="border-soft-green/20 bg-soft-green/5">
                  <AlertDescription className="text-soft-green text-sm font-medium">
                    {successMessage}
                  </AlertDescription>
                </Alert>
              )}

              {error && (
                <Alert
                  variant="destructive"
                  className="border-red-200 bg-red-50"
                >
                  <AlertDescription className="text-red-700 text-sm">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-neutral-700"
                >
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="Enter your work email"
                  className="input-field h-12"
                  required
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-700"
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Enter your password"
                  className="input-field h-12"
                  required
                />
              </div>

              {/* Role Selection (Optional) */}
              <div className="space-y-2">
                <Label
                  htmlFor="role"
                  className="text-sm font-medium text-neutral-700"
                >
                  Role (Optional)
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as UserRole })
                  }
                >
                  <SelectTrigger className="input-field h-12">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employer">
                      <div className="flex items-center gap-3">
                        <EmployerIcon size={18} className="text-deep-blue" />
                        <span>Project Manager</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="worker">
                      <div className="flex items-center gap-3">
                        <WorkerIcon size={18} className="text-soft-green" />
                        <span>Construction Worker</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="supplier">
                      <div className="flex items-center gap-3">
                        <SupplierIcon size={18} className="text-deep-blue" />
                        <span>Material Supplier</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-3">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: checked as boolean })
                  }
                  className="border-neutral-300"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-neutral-600 font-normal"
                >
                  Keep me signed in
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="btn-primary w-full h-12 text-base font-medium"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Links */}
            <div className="space-y-4 pt-2">
              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-sm text-soft-green hover:text-soft-green-light font-medium transition-colors"
                >
                  Forgot your password?
                </Link>
              </div>
              <div className="text-center text-sm text-neutral-600">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-soft-green hover:text-soft-green-light font-medium transition-colors"
                >
                  Create account
                </Link>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Demo Access */}
        <div className="app-card bg-gradient-to-br from-deep-blue/5 to-soft-green/5 border-deep-blue/10">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-lg font-medium text-neutral-800 flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-soft-green rounded-full animate-pulse"></div>
              Quick Demo Access
            </CardTitle>
            <p className="text-sm text-neutral-600">
              Try the app instantly with demo accounts
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Demo Credentials */}
            <div className="bg-white/60 rounded-xl p-4 space-y-3 border border-white/40">
              <div className="text-sm font-medium text-neutral-700">
                Demo Credentials:
              </div>
              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span className="font-medium">Project Manager:</span>
                  <span className="text-neutral-500">
                    ahmad@construction.tj
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Worker:</span>
                  <span className="text-neutral-500">farid@worker.tj</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium">Supplier:</span>
                  <span className="text-neutral-500">info@gulnora.tj</span>
                </div>
                <div className="text-center text-neutral-500 pt-2 border-t border-neutral-200">
                  Any password works in demo mode
                </div>
              </div>
            </div>

            {/* Quick Login Buttons */}
            <div className="grid gap-3">
              <Button
                variant="outline"
                className="btn-outline h-12 justify-start"
                onClick={() => handleDemoLogin("employer")}
              >
                <EmployerIcon size={20} className="text-deep-blue mr-3" />
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-800">
                    Project Manager
                  </div>
                  <div className="text-xs text-neutral-500">
                    Manage projects & teams
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="btn-outline h-12 justify-start"
                onClick={() => handleDemoLogin("worker")}
              >
                <WorkerIcon size={20} className="text-soft-green mr-3" />
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-800">
                    Construction Worker
                  </div>
                  <div className="text-xs text-neutral-500">
                    Log work & track earnings
                  </div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="btn-outline h-12 justify-start"
                onClick={() => handleDemoLogin("supplier")}
              >
                <SupplierIcon size={20} className="text-deep-blue mr-3" />
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-800">
                    Material Supplier
                  </div>
                  <div className="text-xs text-neutral-500">
                    Manage inventory & deliveries
                  </div>
                </div>
              </Button>
            </div>
          </CardContent>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-500">
          Construction Manager v1.0.0 • Built for professionals
        </div>
      </div>
    </div>
  );
};

export default Login;
