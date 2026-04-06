import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";

export interface CourseGrade {
  id: string;
  course: string;
  credits: number;
  grade: string;
}

interface Props {
  grades: CourseGrade[];
  setGrades: React.Dispatch<React.SetStateAction<CourseGrade[]>>;
}

const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F"];

export const gradeToPoints: Record<string, number> = {
  "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7,
  "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, "D-": 0.7, F: 0.0,
};

const gradeColor = (g: string) => {
  const p = gradeToPoints[g] ?? 0;
  if (p >= 3.7) return "bg-emerald-100 text-emerald-700";
  if (p >= 3.0) return "bg-blue-100 text-blue-700";
  if (p >= 2.0) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
};

export function GradesTab({ grades, setGrades }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [course, setCourse] = useState("");
  const [credits, setCredits] = useState("3");
  const [grade, setGrade] = useState("A");

  const add = () => {
    if (!course) return;
    setGrades((prev) => [...prev, { id: crypto.randomUUID(), course, credits: Number(credits) || 3, grade }]);
    setCourse("");
    setCredits("3");
    setGrade("A");
    setShowForm(false);
  };

  const updateGrade = (id: string, newGrade: string) => {
    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, grade: newGrade } : g)));
  };

  const remove = (id: string) => setGrades((prev) => prev.filter((g) => g.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Grades</h2>
          <p className="text-muted-foreground text-sm">{grades.length} courses</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm hover:opacity-90 transition">
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course name" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          <div className="grid grid-cols-2 gap-3">
            <input type="number" value={credits} onChange={(e) => setCredits(e.target.value)} placeholder="Credits" className="border border-border rounded-lg px-3 py-2 bg-input-background" />
            <select value={grade} onChange={(e) => setGrade(e.target.value)} className="border border-border rounded-lg px-3 py-2 bg-input-background">
              {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          <button onClick={add} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm w-full hover:opacity-90 transition">Save Grade</button>
        </div>
      )}

      <div className="space-y-2">
        {grades.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No grades recorded yet.</p>}
        {grades.map((g) => (
          <div key={g.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:shadow-sm transition">
            <div className="flex-1 min-w-0">
              <p className="truncate">{g.course}</p>
              <p className="text-xs text-muted-foreground">{g.credits} credit{g.credits !== 1 ? "s" : ""}</p>
            </div>
            <select
              value={g.grade}
              onChange={(e) => updateGrade(g.id, e.target.value)}
              className={`px-3 py-1 rounded-full text-sm ${gradeColor(g.grade)} border-0 cursor-pointer`}
            >
              {gradeOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <button onClick={() => remove(g.id)} className="text-muted-foreground hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
