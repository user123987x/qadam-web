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
      setError("Пожалуйста, введите ваш email адрес");
      return;
    }

    if (!email.includes("@")) {
      setError("Пожалуйста, введите корректный email адрес");
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
              Проверьте свою почту
            </h1>
            <p className="text-gray-600">
              Мы отправили инструкции по сбросу пароля на вашу электронную почту
            </p>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
                  <div className="text-emerald-800 font-medium mb-2">
                    Письмо успешно отправлено!
                  </div>
                  <div className="text-sm text-emerald-700">
                    Мы отправили инструкции по сбросу пароля на:
                  </div>
                  <div className="text-sm font-medium text-emerald-800 mt-1">
                    {email}
                  </div>
                </div>

                <div className="text-sm text-gray-600 space-y-2">
                  <p>
                    Проверьте свой почтовый ящик (и папку со спамом) на наличие ссылки для сброса пароля.
                  </p>
                  <p>Срок действия ссылки истечет через 1 час по соображениям безопасности.</p>
                </div>

                <div className="space-y-2">
                  {/* <Button
                    onClick={() => {
                      setEmailSent(false);
                      setEmail("");
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Send to Different Email
                  </Button> */}

                  <Button
                    onClick={() => navigate("/login")}
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                  >
                    Вернуться к входу
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-xs text-gray-500">
            Не получили письмо? Проверьте папку со спамом или обратитесь в службу поддержки
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
            Сбросить пароль
          </h1>
          <p className="text-gray-600">
            Введите свой адрес электронной почты, чтобы получить инструкции по сбросу пароля
          </p>
        </div>

        {/* Reset Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Забыли пароль</CardTitle>
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
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Введите ваш email адрес"
                  required
                />
                <div className="text-xs text-gray-600">
                  Мы отправим инструкции по сбросу пароля на этот адрес электронной почты
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700"
                disabled={isLoading}
              >
                {isLoading
                  ? "Отправка инструкций..."
                  : "Отправить инструкции по сбросу"}
              </Button>
            </form>

            {/* Links */}
            <div className="mt-6 text-center space-y-2">
              <div>
                <Link
                  to="/login"
                  className="text-sm text-emerald-600 hover:text-emerald-800"
                >
                  ← Вернуться к входу
                </Link>
              </div>
              <div className="text-sm text-gray-600">
                Нет аккаунта?{" "}
                <Link
                  to="/signup"
                  className="text-emerald-600 hover:text-emerald-800 font-medium"
                >
                  Зарегистрироваться
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="font-semibold text-blue-800 mb-2">Нужна помощь?</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Если у вас возникли проблемы со сбросом пароля:</p>
                <p>• Убедитесь, что вы используете адрес электронной почты, указанный при регистрации.</p>
                <p>• Проверьте папку со спамом или нежелательной почтой</p>
                <p>• Обратитесь за помощью в нашу службу поддержки.</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-3 border-blue-300 hover:bg-blue-100"
              >
                Связаться с поддержки
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

export default ForgotPassword;
