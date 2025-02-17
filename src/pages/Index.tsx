import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, ChartBar, Calendar, TrendingUp, Pencil, Trash2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

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
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

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

    if (editingExpense) {
      const updatedExpenses = expenses.map(expense => 
        expense.id === editingExpense.id 
          ? {
              ...expense,
              amount: parseFloat(amount),
              description,
              category,
            }
          : expense
      );
      setExpenses(updatedExpenses);
      setEditingExpense(null);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث المصروف بنجاح",
      });
    } else {
      const newExpense: Expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        date: new Date().toLocaleDateString('ar-SA'),
        category,
      };
      setExpenses([newExpense, ...expenses]);
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم تسجيل المصروف بنجاح",
      });
    }

    setAmount("");
    setDescription("");
    setCategory("عام");
  };

  const handleEdit = (expense: Expense) => {
    setEditingExpense(expense);
    setAmount(expense.amount.toString());
    setDescription(expense.description);
    setCategory(expense.category);
  };

  const handleDelete = (expenseId: number) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== expenseId);
    setExpenses(updatedExpenses);
    setDeleteExpenseId(null);
    toast({
      title: "تم الحذف بنجاح",
      description: "تم حذف المصروف بنجاح",
    });
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const expensesByCategory = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
  }, [expenses]);

  const last7DaysExpenses = useMemo(() => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return expenses.reduce((sum, expense) => {
      const expenseDate = new Date(expense.date);
      if (expenseDate >= sevenDaysAgo) {
        return sum + expense.amount;
      }
      return sum;
    }, 0);
  }, [expenses]);

  const averageDailyExpense = useMemo(() => {
    if (expenses.length === 0) return 0;
    
    const uniqueDays = new Set(expenses.map(e => e.date)).size;
    return totalExpenses / uniqueDays;
  }, [expenses, totalExpenses]);

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
              {editingExpense ? "تحديث المصروف" : "تسجيل المصروف"}
            </Button>
            
            {editingExpense && (
              <Button
                type="button"
                variant="outline"
                className="w-full mt-2"
                onClick={() => {
                  setEditingExpense(null);
                  setAmount("");
                  setDescription("");
                  setCategory("عام");
                }}
              >
                إلغاء التعديل
              </Button>
            )}
          </form>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">إجمالي المصاريف</h2>
              <ChartBar className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">مصاريف آخر 7 أيام</h2>
              <Calendar className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">${last7DaysExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">متوسط المصاريف اليومي</h2>
              <TrendingUp className="h-5 w-5 text-muted-foreground" />
            </div>
            <p className="mt-2 text-3xl font-bold">${averageDailyExpense.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">المصاريف حسب الفئة</h2>
          <div className="space-y-4">
            {Object.entries(expensesByCategory).map(([cat, amount]) => (
              <div key={cat} className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <p className="font-medium">{cat}</p>
                <p className="font-bold">${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
            ))}
          </div>
        </Card>

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
                <div className="flex items-center gap-4">
                  <p className="font-bold">${expense.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(expense)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteExpenseId(expense.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {expenses.length === 0 && (
              <p className="text-center text-muted-foreground">لا توجد مصاريف مسجلة</p>
            )}
          </div>
        </Card>
      </div>

      <AlertDialog open={deleteExpenseId !== null} onOpenChange={() => setDeleteExpenseId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المصروف؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>إلغاء</AlertDialogCancel>
            <AlertDialogAction onClick={() => deleteExpenseId && handleDelete(deleteExpenseId)}>
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
