
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, ChartBar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  category: string;
}

const Index = () => {
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("عام");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || !description) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال المبلغ والوصف",
        variant: "destructive",
      });
      return;
    }

    const newExpense: Expense = {
      id: Date.now(),
      amount: parseFloat(amount),
      description,
      date: new Date().toLocaleDateString('ar-SA'),
      category,
    };

    setExpenses([newExpense, ...expenses]);
    setAmount("");
    setDescription("");
    
    toast({
      title: "تم التسجيل بنجاح",
      description: "تم تسجيل المصروف بنجاح",
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="container mx-auto p-4 max-w-4xl" dir="rtl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">سجل المصاريف</h1>
          <p className="text-muted-foreground">سجل وتتبع مصاريفك بسهولة</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium">المبلغ (بالدولار)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    type="text"
                    value={amount}
                    onChange={(e) => {
                      // السماح فقط بالأرقام والنقطة العشرية
                      const value = e.target.value;
                      if (value === '' || /^\d*\.?\d*$/.test(value)) {
                        setAmount(value);
                      }
                    }}
                    placeholder="أدخل المبلغ"
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium">الفئة</label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="عام">عام</SelectItem>
                    <SelectItem value="مواد">مواد</SelectItem>
                    <SelectItem value="معدات">معدات</SelectItem>
                    <SelectItem value="خدمات">خدمات</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium">الوصف</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل وصف المصروف"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">
              تسجيل المصروف
            </Button>
          </form>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">إجمالي المصاريف</h2>
              <ChartBar className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">سجل المصاريف</h2>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-muted rounded-lg"
              >
                <div>
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-muted-foreground">
                    {expense.category} - {expense.date}
                  </p>
                </div>
                <p className="font-bold">${expense.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
            ))}
            
            {expenses.length === 0 && (
              <p className="text-center text-muted-foreground">لا توجد مصاريف مسجلة</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Index;
