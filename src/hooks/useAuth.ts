
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import {
  DEFAULT_EMAIL,
  DEFAULT_PASSWORD,
  DEFAULT_USERNAME,
} from "@/utils/auth-constants";

export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleLogin = async (username: string, password: string) => {
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
        return false;
      } else {
        toast({
          title: "تم إرسال رابط إعادة تعيين كلمة المرور",
          description: "يرجى التحقق من بريدك الإلكتروني",
        });
        return true;
      }
    } catch (err) {
      console.error("Unexpected error during password reset:", err);
      toast({
        variant: "destructive",
        title: "خطأ غير متوقع",
        description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    checkSession,
    handleLogin,
    handleResetPassword,
  };
};
