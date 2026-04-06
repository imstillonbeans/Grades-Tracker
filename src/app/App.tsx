import { useState } from "react";
import { ClipboardList, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { AssignmentsTab, Assignment } from "./components/assignments-tab";
import { QuizzesTab, Quiz } from "./components/quizzes-tab";
import { GradesTab, CourseGrade } from "./components/grades-tab";
import { GpaTab } from "./components/gpa-tab";

const tabs = [
  { id: "assignments", label: "Assignments", icon: <ClipboardList className="w-4 h-4" /> },
  { id: "quizzes", label: "Quizzes", icon: <BookOpen className="w-4 h-4" /> },
  { id: "grades", label: "Grades", icon: <GraduationCap className="w-4 h-4" /> },
  { id: "gpa", label: "GPA", icon: <TrendingUp className="w-4 h-4" /> },
] as const;

type TabId = (typeof tabs)[number]["id"];

const sampleAssignments: Assignment[] = [
  { id: "1", title: "Research Paper Draft", course: "English 201", dueDate: "2026-04-10", status: "in-progress", priority: "high" },
  { id: "2", title: "Problem Set 5", course: "Calculus II", dueDate: "2026-04-12", status: "pending", priority: "medium" },
  { id: "3", title: "Lab Report: Titration", course: "Chemistry 101", dueDate: "2026-04-08", status: "completed", priority: "low" },
];

const sampleQuizzes: Quiz[] = [
  { id: "1", title: "Midterm Review Quiz", course: "Calculus II", date: "2026-03-28", score: 88, totalPoints: 100 },
  { id: "2", title: "Vocab Quiz 4", course: "English 201", date: "2026-04-02", score: null, totalPoints: 50 },
];

const sampleGrades: CourseGrade[] = [
  { id: "1", course: "Calculus II", credits: 4, grade: "B+" },
  { id: "2", course: "English 201", credits: 3, grade: "A-" },
  { id: "3", course: "Chemistry 101", credits: 4, grade: "A" },
  { id: "4", course: "History 105", credits: 3, grade: "B" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("assignments");
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [quizzes, setQuizzes] = useState<Quiz[]>(sampleQuizzes);
  const [grades, setGrades] = useState<CourseGrade[]>(sampleGrades);

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
