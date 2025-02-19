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
              date: new Date().toLocaleDateString('en-US'),
            }
          : expense
      );
      setExpenses(updatedExpenses);
      setEditingExpense(null);
      toast({
        title: "تم التحديث",
        description: "تم تحديث المصروف بنجاح",
      });
    } else {
      const newExpense: Expense = {
        id: Date.now(),
        amount: parseFloat(amount),
        description,
        date: new Date().toLocaleDateString('en-US'),
        category,
      };
      setExpenses([newExpense, ...expenses]);
      toast({
        title: "تم التسجيل",
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

  const getPercentageChange = () => {
    if (expenses.length < 2) return null;
    
    const currentTotal = last7DaysExpenses;
    const previousWeekExpenses = expenses.reduce((sum, expense) => {
      const expenseDate = new Date(expense.date);
      const twoWeeksAgo = new Date();
      const oneWeekAgo = new Date();
      twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      
      if (expenseDate >= twoWeeksAgo && expenseDate < oneWeekAgo) {
        return sum + expense.amount;
      }
      return sum;
    }, 0);

    if (previousWeekExpenses === 0) return null;
    
    const percentageChange = ((currentTotal - previousWeekExpenses) / previousWeekExpenses) * 100;
    return percentageChange;
  };

  const percentageChange = getPercentageChange();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4F9FF] to-[#EDF4FF] pb-8" dir="rtl">
      <div className="container mx-auto p-4 max-w-4xl space-y-6">
        <div className="text-center space-y-2 bg-gradient-to-r from-[#2C3E50] to-[#3498DB] text-[#F1F1F1] py-8 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold animate-fade-in">نظام مصاريف شركة الإعلانات</h1>
          <p className="text-[#E5E9F0] animate-fade-in">تتبع وإدارة مصاريف الشركة بسهولة</p>
        </div>

        <Card className="p-6 bg-[#F1F0FB] border-none shadow-lg rounded-xl transform hover:scale-[1.01] transition-all duration-200">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">المبلغ (بالدولار)</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-[#3498DB]" />
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
                    className="pl-10 bg-[#F2FCE2] border-[#E5E9F0] focus:border-[#3498DB] focus:ring-[#3498DB]"
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-[#2C3E50]">الفئة</label>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm" className="hover:bg-[#3498DB]/10 text-[#3498DB]">
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
                          className="bg-[#F2FCE2] border-[#E5E9F0]"
                        />
                      </div>
                      <DialogFooter>
                        <Button onClick={handleAddCategory} className="bg-[#3498DB] hover:bg-[#2980B9]">
                          إضافة الفئة
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="bg-[#F2FCE2] border-[#E5E9F0]">
                    <SelectValue placeholder="اختر الفئة" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#F1F0FB]">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#2C3E50] mb-2">الوصف</label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="أدخل وصف المصروف"
                  className="bg-[#F2FCE2] border-[#E5E9F0] focus:border-[#3498DB] focus:ring-[#3498DB]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#E5E9F0]">
              <Button type="submit" className="w-full bg-[#3498DB] hover:bg-[#2980B9] transition-colors">
                {editingExpense ? "تحديث المصروف" : "تسجيل المصروف"}
              </Button>
              
              {editingExpense && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2 border-[#3498DB] text-[#3498DB] hover:bg-[#3498DB] hover:text-[#F1F1F1]"
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
          <Card className="group p-6 bg-gradient-to-br from-[#E5DEFF] to-[#D3E4FD] border-none shadow-lg rounded-xl transform hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2C3E50]">إجمالي المصاريف</h2>
              <ChartBar className="h-5 w-5 text-[#3498DB] group-hover:scale-110 transition-transform" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#2C3E50] animate-fade-in">${totalExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>

          <Card className="group p-6 bg-gradient-to-br from-[#F2FCE2] to-[#D3E4FD] border-none shadow-lg rounded-xl transform hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2C3E50]">مصاريف آخر 7 أيام</h2>
              <Calendar className="h-5 w-5 text-[#2ECC71] group-hover:scale-110 transition-transform" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#2C3E50] animate-fade-in">
              ${last7DaysExpenses.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
            </p>
            {percentageChange !== null && (
              <p className={`text-sm mt-2 ${percentageChange > 0 ? 'text-red-500' : 'text-green-500'}`}>
                {percentageChange > 0 ? '↑' : '↓'} {Math.abs(percentageChange).toFixed(1)}% مقارنة بالأسبوع السابق
              </p>
            )}
          </Card>

          <Card className="group p-6 bg-gradient-to-br from-[#FEF7CD] to-[#FDE1D3] border-none shadow-lg rounded-xl transform hover:scale-[1.02] transition-all duration-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-[#2C3E50]">متوسط المصاريف اليومي</h2>
              <TrendingUp className="h-5 w-5 text-[#F1C40F] group-hover:scale-110 transition-transform" />
            </div>
            <p className="mt-2 text-3xl font-bold text-[#2C3E50] animate-fade-in">${averageDailyExpense.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
          </Card>
        </div>

        <Card className="p-6 bg-[#F1F0FB] border-none shadow-lg rounded-xl transform hover:scale-[1.01] transition-all duration-200">
          <h2 className="text-xl font-semibold mb-4 text-[#2C3E50] flex items-center gap-2">
            <ChartBar className="h-5 w-5 text-[#3498DB]" />
            المصاريف حسب الفئة
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(expensesByCategory).map(([cat, amount], index) => (
              <div 
                key={cat} 
                className="flex items-center justify-between p-4 bg-gradient-to-r from-[#E5DEFF] to-[#F2FCE2] rounded-lg border border-[#E5E9F0] hover:border-[#3498DB] transition-all duration-200 animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="font-medium text-[#2C3E50]">{cat}</span>
                <span className="font-bold text-[#3498DB]">${amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-[#F1F0FB] border-none shadow-lg rounded-xl transform hover:scale-[1.01] transition-all duration-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#2C3E50] flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-[#3498DB]" />
              سجل المصاريف
            </h2>
            <span className="text-sm text-[#7F8C8D] bg-[#E5DEFF] px-3 py-1 rounded-full animate-fade-in">
              {expenses.length} مصروف
            </span>
          </div>
          <div className="space-y-4">
            {expenses.map((expense, index) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-[#F2FCE2] to-[#FEF7CD] rounded-lg border border-[#E5E9F0] hover:border-[#3498DB]/30 transition-all duration-200 animate-fade-in hover:scale-[1.01]"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div>
                  <p className="font-medium text-[#2C3E50]">{expense.description}</p>
                  <div className="flex items-center gap-2 text-sm text-[#7F8C8D] mt-1">
                    <span className="px-2 py-1 bg-[#E5DEFF] rounded-full text-[#3498DB]">{expense.category}</span>
                    <span>{expense.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <p className="font-bold text-[#2C3E50]">${expense.amount.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(expense)}
                      className="hover:bg-[#E5DEFF] text-[#3498DB]"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setDeleteExpenseId(expense.id)}
                      className="hover:bg-[#FFDEE2] text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
            
            {expenses.length === 0 && (
              <p className="text-center text-[#7F8C8D] py-8 animate-fade-in">لا توجد مصاريف مسجلة</p>
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
              className="bg-[#3498DB] hover:bg-[#2980B9]"
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
