import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Badge } from "@/components/ui/badge";
import { UserRole } from "@/lib/types";
import { workerSpecializations } from "@/lib/constants";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "" as UserRole | "",
    specialization: "", // For workers
    companyName: "", // For employers and suppliers
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = "Имя обязательно";
    if (!formData.lastName.trim()) newErrors.lastName = "Фамилия обязательна";
    if (!formData.email.trim()) newErrors.email = "Email обязателен";
    if (!emailRegex.test(formData.email))
      newErrors.email = "Неверный формат email";
    if (!formData.phone.trim()) newErrors.phone = "Номер телефона обязателен";
    if (!formData.password) newErrors.password = "Пароль обязателен";
    if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!formData.role) newErrors.role = "Пожалуйста, выберите вашу роль";
    if (formData.role === "worker" && !formData.specialization)
      newErrors.specialization = "Пожалуйста, выберите вашу специализацию";
    if (
      (formData.role === "employer" || formData.role === "supplier") &&
      !formData.companyName.trim()
    ) {
      newErrors.companyName = "Название компании обязательно";
    }
    if (!formData.agreeToTerms)
      newErrors.terms = "You must agree to the terms and conditions";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real app, this would call an API to create the account
    console.log("Creating account:", formData);

    // Simulate successful registration
    setIsLoading(false);

    // Redirect to login with success message
    navigate("/login", {
      state: {
        message:
          "Account created successfully! Please sign in with your credentials.",
      },
    });
  };

  const getRoleDescription = (role: UserRole) => {
    switch (role) {
      case "employer":
        return "Manage construction projects, assign workers, and track progress";
      case "worker":
        return "Log daily work, track earnings, and view assigned projects";
      case "supplier":
        return "Manage material deliveries, track inventory, and monitor usage";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* App Logo and Title */}
        <div className="text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Join Construction Manager
          </h1>
          <p className="text-gray-600">
            Create your account to start managing construction projects
          </p>
        </div>

        {/* Signup Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Create Account</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <div className="text-xs text-red-600">
                      {errors.firstName}
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <div className="text-xs text-red-600">
                      {errors.lastName}
                    </div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <div className="text-xs text-red-600">{errors.email}</div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="+992 XX XXX XXXX"
                />
                {errors.phone && (
                  <div className="text-xs text-red-600">{errors.phone}</div>
                )}
              </div>

              {/* Role Selection */}
              <div className="space-y-2">
                <Label htmlFor="role">I am a *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) =>
                    setFormData({ ...formData, role: value as UserRole })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите вашу роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employer">
                      <div className="flex items-center gap-2">
                        <span>👨‍💼</span>
                        <span>Employer / Project Manager</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="worker">
                      <div className="flex items-center gap-2">
                        <span>👷‍♂️</span>
                        <span>Construction Worker</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="supplier">
                      <div className="flex items-center gap-2">
                        <span>🏢</span>
                        <span>Material Supplier</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {formData.role && (
                  <div className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                    {getRoleDescription(formData.role)}
                  </div>
                )}
                {errors.role && (
                  <div className="text-xs text-red-600">{errors.role}</div>
                )}
              </div>

              {/* Worker Specialization */}
              {formData.role === "worker" && (
                <div className="space-y-2">
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Select
                    value={formData.specialization}
                    onValueChange={(value) =>
                      setFormData({ ...formData, specialization: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите вашу специализацию" />
                    </SelectTrigger>
                    <SelectContent>
                      {workerSpecializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.specialization && (
                    <div className="text-xs text-red-600">
                      {errors.specialization}
                    </div>
                  )}
                </div>
              )}

              {/* Company Name for Employers and Suppliers */}
              {(formData.role === "employer" ||
                formData.role === "supplier") && (
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    placeholder="Your company name"
                  />
                  {errors.companyName && (
                    <div className="text-xs text-red-600">
                      {errors.companyName}
                    </div>
                  )}
                </div>
              )}

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="Create a password"
                />
                {errors.password && (
                  <div className="text-xs text-red-600">{errors.password}</div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  placeholder="Confirm your password"
                />
                {errors.confirmPassword && (
                  <div className="text-xs text-red-600">
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              {/* Terms Agreement */}
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeToTerms}
                    onCheckedChange={(checked) =>
                      setFormData({
                        ...formData,
                        agreeToTerms: checked as boolean,
                      })
                    }
                  />
                  <div className="text-sm">
                    <Label htmlFor="terms" className="text-sm">
                      I agree to the{" "}
                      <Link
                        to="/terms"
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        to="/privacy"
                        className="text-emerald-600 hover:text-emerald-800"
                      >
                        Privacy Policy
                      </Link>
                    </Label>
                  </div>
                </div>
                {errors.terms && (
                  <div className="text-xs text-red-600">{errors.terms}</div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-4 text-center">
              <div className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Sign in
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview */}
        <Card className="bg-emerald-50 border-emerald-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-emerald-800 mb-3">
                Why Choose Construction Manager?
              </h3>
              <div className="space-y-2 text-sm text-emerald-700">
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Replace manual notebooks and spreadsheets</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Real-time project tracking and progress</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Automatic payment calculations</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Material inventory management</span>
                </div>
              </div>
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

export default Signup;
