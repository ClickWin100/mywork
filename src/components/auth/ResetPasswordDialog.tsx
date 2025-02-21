
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResetPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onReset: () => void;
  loading: boolean;
}

export const ResetPasswordDialog = ({
  open,
  onOpenChange,
  onReset,
  loading,
}: ResetPasswordDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#F1F0FB]">
        <DialogHeader>
          <DialogTitle>إعادة تعيين كلمة المرور</DialogTitle>
          <DialogDescription>
            سيتم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني
          </DialogDescription>
        </DialogHeader>
        <Button
          onClick={onReset}
          className="bg-[#3498DB] hover:bg-[#2980B9]"
          disabled={loading}
        >
          {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
