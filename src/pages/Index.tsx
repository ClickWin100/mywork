import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DollarSign, ChartBar, Calendar, TrendingUp, Pencil, Trash2, Plus } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

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
  const [category, setCategory] = useState("أجهزة إعلانات");
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const savedExpenses = localStorage.getItem('expenses');
    return savedExpenses ? JSON.parse(savedExpenses) : [];
  });
  const [categories, setCategories] = useState<string[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : [
      "أجهزة إعلانات",
      "خادم",
      "نطاق",
      "اشتراك",
      "إضافات الموقع"
    ];
  });
  const [newCategory, setNewCategory] = useState("");
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [deleteExpenseId, setDeleteExpenseId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  const handleAddCategory = () => {
    if (!newCategory.trim()) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال اسم الفئة",
        variant: "destructive",
      });
      return;
    }

    if (categories.includes(newCategory.trim())) {
      toast({
        title: "خطأ",
        description: "هذه الفئة موجودة مسبقاً",
        variant: "destructive",
      });
      return;
    }

    setCategories([...categories, newCategory.trim()]);
    setNewCategory("");
    toast({
      title: "تم بنجاح",
      description: "تمت إضافة الفئة الجديدة",
    });
  };

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
              date: new Date().toLocaleDateString('ar-SA'), // تحديث التاريخ عند التعديل
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
    setCategory("أجهزة إعلانات");
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
    <div className="container mx-auto p-4 max-w-4xl bg-[#F2FCE2]" dir="rtl">
      <div className="space-y-6">
        <div className="text-center space-y-2 bg-[#1A1F2C] text-white py-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">نظام مصاريف شركة الإعلانات</h1>
          <p className="text-gray-300">تتبع وإدارة مصاريف الشركة بسهولة</p>
        </div>

        <Card className="p-6 bg-[#FDE1D3] border-none shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1A1F2C]">المبلغ (بالدولار)</label>
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
                    className="pl-10 bg-white/50"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-[#1A1F2C]">الفئة</label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-[#E5DEFF]/50">
                        <Plus className="h-4 w-4 ml-1" />
                        فئة جديدة
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#F1F0FB]">
                      <DialogHeader>
                        <DialogTitle>إضافة فئة جديدة</DialogTitle>
                        <DialogDescription>
                          أدخل اسم الفئة الجديدة التي تريد إضافتها
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <Input
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="اسم الفئة"
                          className="bg-white/50"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddCategory} className="bg-[#403E43] hover:bg-[#1A1F2C]">
                          إضافة الفئة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="block text-sm font-medium text-[#1A1F2C]">الوصف</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل وصف المصروف"
                  className="bg-white/50"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button type="submit" className="w-full bg-[#403E43] hover:bg-[#1A1F2C]">
                {editingExpense ? "تحديث المصروف" : "تسجيل المصروف"}
              </Button>
              
              {editingExpense && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2 border-[#403E43] text-[#403E43] hover:bg-[#403E43] hover:text-white"
                  onClick={() => {
                    setEditingExpense(null);
                    setAmount("");
                    setDescription("");
                    setCategory("أجهزة إعلانات");
                  }}
                >
                  إلغاء التعديل
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          <Card className="p-6 bg-[#E5DEFF] border-none shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1A1F2C]">إجمالي المصاريف</h2>
              <ChartBar className="h-5 w-5 text-[#403E43]" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#1A1F2C]">${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>

          <Card className="p-6 bg-[#FFDEE2] border-none shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1A1F2C]">مصاريف آخر 7 أيام</h2>
              <Calendar className="h-5 w-5 text-[#403E43]" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#1A1F2C]">${last7DaysExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>

          <Card className="p-6 bg-[#FEF7CD] border-none shadow-md">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#1A1F2C]">متوسط المصاريف اليومي</h2>
              <TrendingUp className="h-5 w-5 text-[#403E43]" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#1A1F2C]">${averageDailyExpense.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
        </div>

        <Card className="p-6 bg-[#F1F0FB] border-none shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#1A1F2C]">المصاريف حسب الفئة</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(expensesByCategory).map(([cat, amount]) => (
              <div key={cat} className="flex items-center justify-between p-4 bg-white/50 rounded-lg">
                <span className="font-medium text-[#1A1F2C]">{cat}</span>
                <span className="font-bold text-[#403E43]">${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#F1F0FB] border-none shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#1A1F2C]">سجل المصاريف</h2>
            <span className="text-sm text-muted-foreground">
              {expenses.length} مصروف
            </span>
          </div>
          <div className="space-y-4">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
              >
                <div>
                  <p className="font-medium text-[#1A1F2C]">{expense.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="px-2 py-1 bg-[#E5DEFF] rounded text-[#403E43]">{expense.category}</span>
                    <span>{expense.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#1A1F2C]">${expense.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(expense)}
                      className="hover:bg-[#E5DEFF]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteExpenseId(expense.id)}
                      className="hover:bg-[#FFDEE2]"
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
        <AlertDialogContent className="bg-[#F1F0FB]">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذا المصروف؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-[#FFDEE2]">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteExpenseId && handleDelete(deleteExpenseId)}
              className="bg-[#403E43] hover:bg-[#1A1F2C]"
            >
              تأكيد الحذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Index;
