import { useState } from "react";
import { Plus, Trash2, BookOpen } from "lucide-react";

export interface Quiz {
  id: string;
  title: string;
  course: string;
  date: string;
  score: number | null;
  totalPoints: number;
}

interface Props {
  quizzes: Quiz[];
  setQuizzes: React.Dispatch<React.SetStateAction<Quiz[]>>;
}

export function QuizzesTab({ quizzes, setQuizzes }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [totalPoints, setTotalPoints] = useState("100");

  const add = () => {
    if (!title || !course) return;
    setQuizzes((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, course, date, score: null, totalPoints: Number(totalPoints) || 100 },
    ]);
    setTitle("");
    setCourse("");
    setDate("");
    setTotalPoints("100");
    setShowForm(false);
  };

  const updateScore = (id: string, score: string) => {
    setQuizzes((prev) =>
      prev.map((q) => (q.id === id ? { ...q, score: score === "" ? null : Number(score) } : q))
    );
  };

  const remove = (id: string) => setQuizzes((prev) => prev.filter((q) => q.id !== id));

  const scored = quizzes.filter((q) => q.score !== null);
  const avg = scored.length ? scored.reduce((s, q) => s + (q.score! / q.totalPoints) * 100, 0) / scored.length : 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Quizzes</h2>
          <p className="text-muted-foreground text-sm">
            {scored.length} scored · Avg: {scored.length ? avg.toFixed(1) + "%" : "N/A"}
          </p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          <div className="grid grid-cols-3 gap-3">
            <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course" className="border border-border rounded-lg px-3 py-2 bg-input-background" />
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-border rounded-lg px-3 py-2 bg-input-background" />
            <input type="number" value={totalPoints} onChange={(e) => setTotalPoints(e.target.value)} placeholder="Total pts" className="border border-border rounded-lg px-3 py-2 bg-input-background" />
          </div>
          <button onClick={add} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm w-full hover:opacity-90 transition">Save Quiz</button>
        </div>
      )}

      <div className="space-y-2">
        {quizzes.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No quizzes yet.</p>}
        {quizzes.map((q) => (
          <div key={q.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:shadow-sm transition">
            <BookOpen className="w-4 h-4 text-blue-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="truncate">{q.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{q.course}</span>
                {q.date && <><span>·</span><span>{q.date}</span></>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <input
                type="number"
                value={q.score ?? ""}
                onChange={(e) => updateScore(q.id, e.target.value)}
                placeholder="—"
                className="w-14 text-center border border-border rounded-lg px-1 py-1 text-sm bg-input-background"
              />
              <span className="text-muted-foreground text-sm">/ {q.totalPoints}</span>
            </div>
            <button onClick={() => remove(q.id)} className="text-muted-foreground hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
