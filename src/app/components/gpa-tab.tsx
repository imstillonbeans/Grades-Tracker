import { CourseGrade, gradeToPoints } from "./grades-tab";
import { TrendingUp, Award, BookOpen, Target } from "lucide-react";

interface Props {
  grades: CourseGrade[];
}

function getGpaColor(gpa: number) {
  if (gpa >= 3.7) return "text-emerald-600";
  if (gpa >= 3.0) return "text-blue-600";
  if (gpa >= 2.0) return "text-amber-600";
  return "text-red-600";
}

function getGpaBg(gpa: number) {
  if (gpa >= 3.7) return "bg-emerald-50 border-emerald-200";
  if (gpa >= 3.0) return "bg-blue-50 border-blue-200";
  if (gpa >= 2.0) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

export function GpaTab({ grades }: Props) {
  const totalCredits = grades.reduce((s, g) => s + g.credits, 0);
  const weightedSum = grades.reduce((s, g) => s + (gradeToPoints[g.grade] ?? 0) * g.credits, 0);
  const gpa = totalCredits > 0 ? weightedSum / totalCredits : 0;

  const distribution = grades.reduce<Record<string, number>>((acc, g) => {
    const letter = g.grade[0];
    acc[letter] = (acc[letter] || 0) + 1;
    return acc;
  }, {});

  const maxCount = Math.max(...Object.values(distribution), 1);

  return (
    <div className="space-y-6">
      <h2>GPA Tracker</h2>

      {/* GPA Display */}
      <div className={`rounded-2xl border p-6 text-center ${getGpaBg(gpa)}`}>
        <p className="text-sm text-muted-foreground mb-1">Cumulative GPA</p>
        <p className={`text-5xl tracking-tight ${getGpaColor(gpa)}`}>
          {totalCredits > 0 ? gpa.toFixed(2) : "—"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">out of 4.00</p>
        {/* Progress bar */}
        <div className="mt-4 h-2 bg-white/60 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${gpa >= 3.7 ? "bg-emerald-500" : gpa >= 3.0 ? "bg-blue-500" : gpa >= 2.0 ? "bg-amber-500" : "bg-red-500"}`}
            style={{ width: `${(gpa / 4) * 100}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: <BookOpen className="w-4 h-4" />, label: "Courses", value: grades.length },
          { icon: <Target className="w-4 h-4" />, label: "Credits", value: totalCredits },
          { icon: <Award className="w-4 h-4" />, label: "Best Grade", value: grades.length ? grades.reduce((best, g) => (gradeToPoints[g.grade] > gradeToPoints[best.grade] ? g : best)).grade : "—" },
          { icon: <TrendingUp className="w-4 h-4" />, label: "Quality Pts", value: totalCredits > 0 ? weightedSum.toFixed(1) : "—" },
        ].map((s) => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="flex justify-center text-muted-foreground mb-1">{s.icon}</div>
            <p className="text-lg">{s.value}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Grade Distribution */}
      {grades.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="mb-3">Grade Distribution</h3>
          <div className="flex items-end gap-3 h-32">
            {["A", "B", "C", "D", "F"].map((letter) => {
              const count = distribution[letter] || 0;
              const height = count > 0 ? (count / maxCount) * 100 : 4;
              const colors: Record<string, string> = { A: "bg-emerald-400", B: "bg-blue-400", C: "bg-amber-400", D: "bg-orange-400", F: "bg-red-400" };
              return (
                <div key={letter} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-xs text-muted-foreground">{count}</span>
                  <div className={`w-full rounded-t-lg transition-all duration-500 ${colors[letter]}`} style={{ height: `${height}%` }} />
                  <span className="text-xs">{letter}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Course breakdown */}
      {grades.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="mb-3">Course Breakdown</h3>
          <div className="space-y-2">
            {grades.map((g) => (
              <div key={g.id} className="flex items-center justify-between text-sm">
                <span className="truncate flex-1">{g.course}</span>
                <span className="text-muted-foreground mx-2">{g.credits} cr</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${gradeToPoints[g.grade] >= 3.7 ? "bg-emerald-100 text-emerald-700" : gradeToPoints[g.grade] >= 3.0 ? "bg-blue-100 text-blue-700" : gradeToPoints[g.grade] >= 2.0 ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}`}>
                  {g.grade} ({gradeToPoints[g.grade].toFixed(1)})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {grades.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-4">
          Add courses in the Grades tab to see your GPA here.
        </p>
      )}
    </div>
  );
}
