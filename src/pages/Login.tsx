
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ResetPasswordDialog } from "@/components/auth/ResetPasswordDialog";
import { useAuth } from "@/hooks/useAuth";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const { loading, checkSession, handleLogin, handleResetPassword } = useAuth();

  useEffect(() => {
    checkSession();
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin(username, password);
  };

  const onResetPassword = async () => {
    const success = await handleResetPassword();
    if (success) {
      setShowResetDialog(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9FF] to-[#EDF4FF] flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md p-6 bg-[#F1F0FB] border-none shadow-lg rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">تسجيل الدخول</h1>
          <p className="text-[#7F8C8D] mt-2">مرحباً بك مجدداً</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="اسم المستخدم"
              className="bg-[#F2FCE2] border-[#E5E9F0] mb-4"
            />
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="كلمة المرور"
              className="bg-[#F2FCE2] border-[#E5E9F0]"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#3498DB] hover:bg-[#2980B9]"
            disabled={loading}
          >
            {loading ? "جاري التحميل..." : "تسجيل الدخول"}
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="w-full text-[#3498DB] hover:bg-[#3498DB]/10"
            onClick={() => setShowResetDialog(true)}
          >
            نسيت كلمة المرور؟
          </Button>
        </form>
      </Card>

      <ResetPasswordDialog
        open={showResetDialog}
        onOpenChange={setShowResetDialog}
        onReset={onResetPassword}
        loading={loading}
      />
    </div>
  );
};

export default Login;
