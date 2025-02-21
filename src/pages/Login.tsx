
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const DEFAULT_USERNAME = "absoool";
const DEFAULT_PASSWORD = "absoool$1984";
const DEFAULT_EMAIL = "absoool4@gmail.com";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showResetDialog, setShowResetDialog] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      console.log("Checking session...");
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        console.error("Session check error:", sessionError);
        return;
      }
      if (session) {
        console.log("Active session found, redirecting...");
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error during session check:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (username !== DEFAULT_USERNAME) {
        toast({
          variant: "destructive",
          title: "خطأ في تسجيل الدخول",
          description: "اسم المستخدم غير صحيح",
        });
        return;
      }

      console.log("Attempting login with:", { email: DEFAULT_EMAIL, password });
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: DEFAULT_EMAIL,
        password: password,
      });

      if (error) {
        console.error("Login error:", error);
        
        if (password === DEFAULT_PASSWORD) {
          console.log("Attempting to create account with default credentials...");
          const { error: signUpError } = await supabase.auth.signUp({
            email: DEFAULT_EMAIL,
            password: DEFAULT_PASSWORD,
          });

          if (signUpError) {
            console.error("Signup error:", signUpError);
            toast({
              variant: "destructive",
              title: "خطأ في إنشاء الحساب",
              description: "حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى",
            });
          } else {
            toast({
              title: "تم إنشاء الحساب بنجاح",
              description: "يمكنك الآن تسجيل الدخول باستخدام كلمة المرور الافتراضية",
            });
            
            const { error: loginError } = await supabase.auth.signInWithPassword({
              email: DEFAULT_EMAIL,
              password: DEFAULT_PASSWORD,
            });
            
            if (!loginError) {
              navigate("/");
              return;
            }
          }
        } else {
          toast({
            variant: "destructive",
            title: "خطأ في تسجيل الدخول",
            description: "كلمة المرور غير صحيحة",
          });
        }
      } else if (data.user) {
        navigate("/");
      }
    } catch (err) {
      console.error("Unexpected error during login:", err);
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: "حدث خطأ غير متوقع أثناء تسجيل الدخول",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    setLoading(true);
    try {
      console.log("Attempting to reset password for:", DEFAULT_EMAIL);
      
      const { error } = await supabase.auth.resetPasswordForEmail(DEFAULT_EMAIL, {
        redirectTo: window.location.origin + '/reset-password',
      });

      if (error) {
        console.error("Reset password error:", error);
        toast({
          variant: "destructive",
          title: "خطأ في إرسال رابط إعادة تعيين كلمة المرور",
          description: error.message || "حدث خطأ أثناء إرسال الرابط. يرجى المحاولة مرة أخرى",
        });
      } else {
        toast({
          title: "تم إرسال رابط إعادة تعيين كلمة المرور",
          description: "يرجى التحقق من بريدك الإلكتروني",
        });
        setShowResetDialog(false);
      }
    } catch (err) {
      console.error("Unexpected error during password reset:", err);
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9FF] to-[#EDF4FF] flex items-center justify-center p-4" dir="rtl">
      <Card className="w-full max-w-md p-6 bg-[#F1F0FB] border-none shadow-lg rounded-xl">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-[#2C3E50]">تسجيل الدخول</h1>
          <p className="text-[#7F8C8D] mt-2">مرحباً بك مجدداً</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
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

      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="bg-[#F1F0FB]">
          <DialogHeader>
            <DialogTitle>إعادة تعيين كلمة المرور</DialogTitle>
            <DialogDescription>
              سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
            </DialogDescription>
          </DialogHeader>
          <Button
            onClick={handleResetPassword}
            className="bg-[#3498DB] hover:bg-[#2980B9]"
            disabled={loading}
          >
            {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Login;
