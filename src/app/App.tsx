import { useState, useEffect, useRef, useCallback } from "react";
import { ClipboardList, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { AssignmentsTab, Assignment } from "./components/assignments-tab";
import { QuizzesTab, Quiz } from "./components/quizzes-tab";
import { GradesTab, CourseGrade } from "./components/grades-tab";
import { GpaTab } from "./components/gpa-tab";
import { projectId, publicAnonKey } from "/utils/supabase/info";

const API = `https://${projectId}.supabase.co/functions/v1/make-server-9e4d84c0`;
const headers = { "Content-Type": "application/json", Authorization: `Bearer ${publicAnonKey}` };

const tabs = [
  { id: "assignments", label: "Assignments", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "quizzes", label: "Quizzes", icon: <BookOpen className="w-4 h-4" /> },
  { id: "grades", label: "Grades", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "gpa", label: "GPA", icon: <TrendingUp className="w-4 h-4" /> },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("assignments");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [grades, setGrades] = useState<CourseGrade[]>([]);
  const [loaded, setLoaded] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load data on mount
  useEffect(() => {
    fetch(`${API}/data`, { headers })
      .then((r) => r.json())
      .then((d) => {
        if (d.assignments?.length) setAssignments(d.assignments);
        if (d.quizzes?.length) setQuizzes(d.quizzes);
        if (d.grades?.length) setGrades(d.grades);
        setLoaded(true);
      })
      .catch((e) => {
        console.log("Failed to load data:", e);
        setLoaded(true);
      });
  }, []);

  // Auto-save with debounce
  const save = useCallback(() => {
    if (!loaded) return;
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      fetch(`${API}/data`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ assignments, quizzes, grades }),
      }).catch((e) => console.log("Failed to save:", e));
    }, 500);
  }, [assignments, quizzes, grades, loaded]);

  useEffect(() => { save(); }, [save]);

  if (!loaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-6 pb-24">
        {/* Header */}
        <div className="mb-6">
          <h1 className="flex items-center gap-2">
            <GraduationCap className="w-6 h-6" /> SchoolTracker
          </h1>
          <p className="text-muted-foreground text-sm">Stay on top of your academic progress</p>
        </div>

        {/* Tab Content */}
        {activeTab === "assignments" && <AssignmentsTab assignments={assignments} setAssignments={setAssignments} />}
        {activeTab === "quizzes" && <QuizzesTab quizzes={quizzes} setQuizzes={setQuizzes} />}
        {activeTab === "grades" && <GradesTab grades={grades} setGrades={setGrades} />}
        {activeTab === "gpa" && <GpaTab grades={grades} />}
      </div>

      {/* Bottom Tab Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-2xl mx-auto flex">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex flex-col items-center gap-0.5 py-3 transition text-xs ${
                activeTab === tab.id ? "text-primary" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}