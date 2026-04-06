import { useState } from "react";
import { Plus, Trash2, CheckCircle2, Circle, Calendar } from "lucide-react";

export interface Assignment {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

interface Props {
  assignments: Assignment[];
  setAssignments: React.Dispatch<React.SetStateAction<Assignment[]>>;
}

const priorityColors = {
  low: "bg-emerald-100 text-emerald-700",
  medium: "bg-amber-100 text-amber-700",
  high: "bg-red-100 text-red-700",
};

const statusIcons = {
  pending: <Circle className="w-4 h-4 text-muted-foreground" />,
  "in-progress": <Circle className="w-4 h-4 text-blue-500" />,
  completed: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
};

export function AssignmentsTab({ assignments, setAssignments }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");

  const addAssignment = () => {
    if (!title || !course) return;
    setAssignments((prev) => [
      ...prev,
      { id: crypto.randomUUID(), title, course, dueDate, status: "pending", priority },
    ]);
    setTitle("");
    setCourse("");
    setDueDate("");
    setPriority("medium");
    setShowForm(false);
  };

  const toggleStatus = (id: string) => {
    setAssignments((prev) =>
      prev.map((a) => {
        if (a.id !== id) return a;
        const next = a.status === "pending" ? "in-progress" : a.status === "in-progress" ? "completed" : "pending";
        return { ...a, status: next };
      })
    );
  };

  const remove = (id: string) => setAssignments((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2>Assignments</h2>
          <p className="text-muted-foreground text-sm">{assignments.filter((a) => a.status !== "completed").length} pending</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 rounded-lg text-sm hover:opacity-90 transition"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border rounded-xl p-4 space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" className="w-full border border-border rounded-lg px-3 py-2 bg-input-background" />
          <div className="grid grid-cols-2 gap-3">
            <input value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course" className="border border-border rounded-lg px-3 py-2 bg-input-background" />
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="border border-border rounded-lg px-3 py-2 bg-input-background" />
          </div>
          <div className="flex items-center gap-2">
            {(["low", "medium", "high"] as const).map((p) => (
              <button key={p} onClick={() => setPriority(p)} className={`px-3 py-1 rounded-full text-xs capitalize transition ${priority === p ? priorityColors[p] : "bg-muted text-muted-foreground"}`}>
                {p}
              </button>
            ))}
          </div>
          <button onClick={addAssignment} className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm w-full hover:opacity-90 transition">
            Save Assignment
          </button>
        </div>
      )}

      <div className="space-y-2">
        {assignments.length === 0 && <p className="text-muted-foreground text-sm text-center py-8">No assignments yet. Add one above!</p>}
        {assignments.map((a) => (
          <div key={a.id} className="flex items-center gap-3 bg-card border border-border rounded-xl p-3 hover:shadow-sm transition">
            <button onClick={() => toggleStatus(a.id)} className="shrink-0">{statusIcons[a.status]}</button>
            <div className="flex-1 min-w-0">
              <p className={`truncate ${a.status === "completed" ? "line-through text-muted-foreground" : ""}`}>{a.title}</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                <span>{a.course}</span>
                {a.dueDate && (
                  <>
                    <span>·</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{a.dueDate}</span>
                  </>
                )}
              </div>
            </div>
            <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[a.priority]}`}>{a.priority}</span>
            <button onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive transition"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}
