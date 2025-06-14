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

    // Simple validation
    if (!formData.email || !formData.password) {
      setError("Пожалуйста, заполните все поля.");
      setIsLoading(false);
      return;
    }

    // Demo authentication - in real app, this would be an API call
    const user = mockUsers.find(
      (u) => u.email === formData.email && formData.role === u.role,
    );

    if (user) {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      switchUser(user.id);
      navigate("/dashboard");
    } else {
      setError("Неверный email или пароль. Попробуйте снова.");
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
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-neutral-100 flex items-center justify-center p-6">
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
              Строительный менеджер
            </h1>
            <p className="text-neutral-600 text-sm leading-relaxed">
              Оптимизируйте ваши строительные проекты с профессиональными
              инструментами управления
            </p>
          </div>
        </div>

        {/* Login Form */}
        <div className="app-card-elevated">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-xl font-medium text-neutral-800">
              Добро пожаловать
            </CardTitle>
            <p className="text-sm text-neutral-600 mt-1">
              Войдите в вашу учетную запись
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
                  Email адрес
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="введите ваш email"
                  className="bg-white/80 border-neutral-200 focus:border-soft-green focus:ring-soft-green/20"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-neutral-700"
                >
                  Пароль
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder="введите ваш пароль"
                  className="bg-white/80 border-neutral-200 focus:border-soft-green focus:ring-soft-green/20"
                />
              </div>

              {/* Role */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-neutral-700">
                  Роль
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: UserRole) =>
                    setFormData({ ...formData, role: value })
                  }
                >
                  <SelectTrigger className="bg-white/80 border-neutral-200 focus:border-soft-green focus:ring-soft-green/20">
                    <SelectValue placeholder="Выберите вашу роль" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employer">
                      <div className="flex items-center gap-2">
                        <EmployerIcon size={16} />
                        Работодатель
                      </div>
                    </SelectItem>
                    <SelectItem value="worker">
                      <div className="flex items-center gap-2">
                        <WorkerIcon size={16} />
                        Рабочий
                      </div>
                    </SelectItem>
                    <SelectItem value="supplier">
                      <div className="flex items-center gap-2">
                        <SupplierIcon size={16} />
                        Поставщик
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Remember Me */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={formData.rememberMe}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, rememberMe: !!checked })
                  }
                  className="border-neutral-300 data-[state=checked]:bg-soft-green data-[state=checked]:border-soft-green"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-neutral-600 cursor-pointer"
                >
                  Запомнить меня
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary h-12 text-base font-medium"
              >
                {isLoading ? "Вход..." : "Войти"}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-4 text-neutral-500 font-medium">
                  или попробуйте демо
                </span>
              </div>
            </div>

            {/* Demo Login Buttons */}
            <div className="space-y-3">
              <p className="text-xs text-neutral-500 text-center">
                Быстрый вход для демонстрации
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("employer")}
                className="w-full h-12 justify-start bg-white/60 border-neutral-200 hover:bg-neutral-50"
              >
                <EmployerIcon size={20} className="text-deep-blue mr-3" />
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-800">
                    Работодатель
                  </div>
                  <div className="text-xs text-neutral-500">
                    Управление проектами и командой
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("worker")}
                className="w-full h-12 justify-start bg-white/60 border-neutral-200 hover:bg-neutral-50"
              >
                <WorkerIcon size={20} className="text-soft-green mr-3" />
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-800">Рабочий</div>
                  <div className="text-xs text-neutral-500">
                    Записывайте работу и заработок
                  </div>
                </div>
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => handleDemoLogin("supplier")}
                className="w-full h-12 justify-start bg-white/60 border-neutral-200 hover:bg-neutral-50"
              >
                <SupplierIcon size={20} className="text-deep-blue mr-3" />
                <div className="text-left flex-1">
                  <div className="font-medium text-neutral-800">
                    Поставщик материалов
                  </div>
                  <div className="text-xs text-neutral-500">
                    Управление складом и доставками
                  </div>
                </div>
              </Button>
            </div>

            {/* Links */}
            <div className="space-y-4 text-center">
              <Link
                to="/forgot-password"
                className="text-sm text-soft-green hover:text-soft-green-light font-medium"
              >
                Забыли пароль?
              </Link>
              <div className="text-sm text-neutral-600">
                Нет аккаунта?{" "}
                <Link
                  to="/signup"
                  className="text-soft-green hover:text-soft-green-light font-medium"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </CardContent>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-neutral-500">
          Строительный менеджер v1.0.0 • Создано для профессионалов
        </div>
      </div>
    </div>
  );
};

export default Login;
