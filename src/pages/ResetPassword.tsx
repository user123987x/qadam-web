import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Валидация
    if (!password.trim() || !confirmPassword.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 8) {
      setError("Пароль должен содержать минимум 8 символов");
      return;
    }

    setIsLoading(true);

    // Симуляция вызова API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // В реальном приложении здесь будет вызов API для сброса пароля
    console.log("Resetting password for:", email);
    console.log("New password:", password);

    setIsLoading(false);
    setSuccess(true);

    // Перенаправление на страницу входа через 3 секунды
    setTimeout(() => {
      navigate("/login");
    }, 3000);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Пароль успешно изменен!
            </h1>
            <p className="text-gray-600">
              Ваш пароль был успешно обновлен
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="text-emerald-800 font-medium mb-2">
                    Пароль обновлен
                  </div>
                  <div className="text-sm text-emerald-700">
                    Теперь вы можете войти с новым паролем
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    Вы будете перенаправлены на страницу входа через несколько секунд...
                  </p>
                </div>

                <Button
                  onClick={() => navigate("/login")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Войти сейчас
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-gray-500">
            Construction Manager v1.0.0
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
          <div className="text-6xl mb-4">🔑</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Установите новый пароль
          </h1>
          <p className="text-gray-600">
            Придумайте новый пароль для вашего аккаунта
          </p>
        </div>

        {/* Reset Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Сброс пароля</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4 text-center">
              <div className="text-sm text-gray-600 mb-1">Аккаунт</div>
              <div className="font-medium text-gray-900">{email}</div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Password */}
              <div className="space-y-2">
                <Label htmlFor="password">Новый пароль</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Введите новый пароль"
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                      </svg>
                    )}
                  </button>
                </div>
                <div className="text-xs text-gray-600">
                  Минимум 8 символов
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Подтвердите пароль</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Повторите новый пароль"
                  required
                />
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading
                  ? "Обновление пароля..."
                  : "Обновить пароль"}
              </Button>
            </form>

            {/* Links */}
            {/* <div className="mt-6 text-center space-y-2">
              <div>
                <Link
                  to="/login"
                  className="text-sm text-emerald-600 hover:text-emerald-800"
                >
                  ← Назад к входу
                </Link>
              </div>
            </div> */}
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-800 mb-2">Нужна помощь?</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Если у вас возникли проблемы со сбросом пароля:</p>
                <p>• Убедитесь, что используете тот же email, с которым регистрировались</p>
                <p>• Проверьте папку "Спам" в вашей почте</p>
                <p>• Обратитесь в службу поддержки</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-blue-300 hover:bg-blue-100"
              >
                Служба поддержки
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-xs text-gray-500">
          Строительный менеджер v1.0.0 • Создано для профессионалов
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;