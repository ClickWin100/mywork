
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Star, LightbulbIcon, BellIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Note {
  id: number;
  title: string;
  content: string;
  type: string;
  date: string;
}

const Notes = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [type, setType] = useState("فكرة تطويرية");
  const [notes, setNotes] = useState<Note[]>(() => {
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !content) {
      toast({
        title: "خطأ",
        description: "الرجاء إدخال العنوان والمحتوى",
        variant: "destructive",
      });
      return;
    }

    if (editingNote) {
      const updatedNotes = notes.map(note => 
        note.id === editingNote.id 
          ? {
              ...note,
              title,
              content,
              type,
              date: new Date().toLocaleDateString('en-US'),
            }
          : note
      );
      setNotes(updatedNotes);
      setEditingNote(null);
      toast({
        title: "تم التحديث",
        description: "تم تحديث الملاحظة بنجاح",
      });
    } else {
      const newNote: Note = {
        id: Date.now(),
        title,
        content,
        type,
        date: new Date().toLocaleDateString('en-US'),
      };
      setNotes([newNote, ...notes]);
      toast({
        title: "تم الإضافة",
        description: "تمت إضافة الملاحظة بنجاح",
      });
    }

    setTitle("");
    setContent("");
    setType("فكرة تطويرية");
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setTitle(note.title);
    setContent(note.content);
    setType(note.type);
  };

  const handleDelete = (noteId: number) => {
    setNotes(notes.filter(note => note.id !== noteId));
    setDeleteNoteId(null);
    toast({
      title: "تم الحذف",
      description: "تم حذف الملاحظة بنجاح",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "فكرة تطويرية":
        return <LightbulbIcon className="h-4 w-4 text-yellow-500" />;
      case "تذكير":
        return <BellIcon className="h-4 w-4 text-blue-500" />;
      case "فكرة مستقبلية":
        return <Star className="h-4 w-4 text-purple-500" />;
      default:
        return <LightbulbIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl bg-[#F2FCE2]" dir="rtl">
      <div className="space-y-6">
        <div className="text-center space-y-2 bg-[#1A1F2C] text-white py-6 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold">سجل الملاحظات والأفكار</h1>
          <p className="text-gray-300">سجل أفكارك وملاحظاتك للتطوير المستقبلي</p>
        </div>

        <Card className="p-6 bg-[#E5DEFF] border-none shadow-md">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] mb-2">العنوان</label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="عنوان الملاحظة"
                  className="bg-white/50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1F2C] mb-2">النوع</label>
                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-white/50">
                    <SelectValue placeholder="اختر نوع الملاحظة" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="فكرة تطويرية">فكرة تطويرية</SelectItem>
                    <SelectItem value="تذكير">تذكير</SelectItem>
                    <SelectItem value="فكرة مستقبلية">فكرة مستقبلية</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-[#1A1F2C] mb-2">المحتوى</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="اكتب ملاحظتك هنا..."
                  className="bg-white/50 min-h-[100px]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <Button type="submit" className="w-full bg-[#403E43] hover:bg-[#1A1F2C]">
                {editingNote ? "تحديث الملاحظة" : "إضافة ملاحظة"}
              </Button>
              
              {editingNote && (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-2 border-[#403E43] text-[#403E43] hover:bg-[#403E43] hover:text-white"
                  onClick={() => {
                    setEditingNote(null);
                    setTitle("");
                    setContent("");
                    setType("فكرة تطويرية");
                  }}
                >
                  إلغاء التعديل
                </Button>
              )}
            </div>
          </form>
        </Card>

        <div className="space-y-4">
          {notes.map((note) => (
            <Card key={note.id} className="p-6 bg-[#F1F0FB] border-none shadow-md">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(note.type)}
                    <h3 className="text-xl font-semibold text-[#1A1F2C]">{note.title}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground">{note.date}</p>
                  <p className="mt-2 text-[#1A1F2C] whitespace-pre-wrap">{note.content}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(note)}
                    className="hover:bg-[#E5DEFF]"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteNoteId(note.id)}
                    className="hover:bg-[#FFDEE2]"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
          
          {notes.length === 0 && (
            <p className="text-center text-muted-foreground">لا توجد ملاحظات مسجلة</p>
          )}
        </div>
      </div>

      <AlertDialog open={deleteNoteId !== null} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent className="bg-[#F1F0FB]">
          <AlertDialogHeader>
            <AlertDialogTitle>هل أنت متأكد من حذف هذه الملاحظة؟</AlertDialogTitle>
            <AlertDialogDescription>
              لا يمكن التراجع عن هذا الإجراء بعد تنفيذه.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="hover:bg-[#FFDEE2]">إلغاء</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => deleteNoteId && handleDelete(deleteNoteId)}
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

export default Notes;
