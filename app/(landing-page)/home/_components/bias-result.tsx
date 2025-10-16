import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, Tag } from "lucide-react";
import clsx from "clsx";


interface BiasResultProps {
  result: {
    bias_category: string;
    confidence: number;
    has_bias: boolean;
    message: string;
    text: string;
  };
}

export function BiasResult({ result }: BiasResultProps) {
  const { bias_category, confidence, has_bias, message, text } = result;

  // Glassmorphism + dark theme badge colors
  const getBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      Gender: "bg-gradient-to-r from-purple-700/80 to-purple-400/60 text-white border-purple-500/60",
      "Race / ethnicity": "bg-gradient-to-r from-blue-700/80 to-blue-400/60 text-white border-blue-500/60",
      "Age (young / middle / elderly; also continuous age ranges)":
        "bg-gradient-to-r from-green-700/80 to-green-400/60 text-white border-green-500/60",
      "Disability (visible, invisible, physical, cognitive)":
        "bg-gradient-to-r from-orange-700/80 to-orange-400/60 text-white border-orange-500/60",
      "Religion / belief system": "bg-gradient-to-r from-pink-700/80 to-pink-400/60 text-white border-pink-500/60",
      "Nationality / immigration status":
        "bg-gradient-to-r from-indigo-700/80 to-indigo-400/60 text-white border-indigo-500/60",
      "Socioeconomic status (income, education)":
        "bg-gradient-to-r from-amber-700/80 to-amber-400/60 text-white border-amber-500/60",
    };
    return colors[category] || "bg-gradient-to-r from-slate-800/80 to-slate-600/60 text-white border-slate-500/60";
  };

  return (
    <div
      className={clsx(
        "rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl shadow-2xl max-w-2xl mx-auto mt-10 p-8",
        "transition-all duration-300",
        has_bias ? "ring-2 ring-amber-500/40" : "ring-2 ring-green-500/30"
      )}
      style={{ boxShadow: has_bias ? "0 8px 32px 0 rgba(255, 193, 7, 0.15)" : "0 8px 32px 0 rgba(34,197,94,0.10)" }}
    >
      <div className="flex items-center gap-4 mb-4">
        <div className={clsx(
          "rounded-full p-2 flex items-center justify-center",
          has_bias ? "bg-amber-700/20" : "bg-green-700/20"
        )}>
          {has_bias ? (
            <AlertTriangle className="h-7 w-7 text-amber-400 drop-shadow" />
          ) : (
            <CheckCircle2 className="h-7 w-7 text-green-400 drop-shadow" />
          )}
        </div>
        <div className="flex flex-col gap-1">
          <span className={clsx(
            "text-lg font-bold tracking-tight",
            has_bias ? "text-amber-200" : "text-green-200"
          )}>
            {has_bias ? "Bias Detected" : "No Bias Detected"}
          </span>
          <span className="text-xs text-slate-400 font-mono">
            {has_bias ? message : "No bias was detected in the input."}
          </span>
        </div>
        {has_bias && (
          <Badge className={clsx(
            "ml-auto border-2 px-3 py-1 text-sm font-semibold shadow-md",
            getBadgeColor(bias_category)
          )}>
            <Tag className="h-4 w-4 mr-1 -ml-1" />
            {bias_category}
          </Badge>
        )}
      </div>
      <div className="mb-4">
        <div className="rounded-lg bg-slate-900/70 border border-slate-700 px-4 py-3 text-slate-100 text-base font-mono shadow-inner">
          <span className="text-slate-400 font-medium mr-2">Input:</span>
          <span className="text-slate-100">{text}</span>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4">
        {has_bias && (
          <span className="text-xs text-amber-200 bg-amber-700/20 px-2 py-1 rounded font-mono tracking-wide">
            Confidence: <span className="font-bold">{(confidence * 100).toFixed(2)}%</span>
          </span>
        )}
        <span className="text-xs text-slate-400 font-mono">
          {has_bias ? "Review and take action if necessary." : "Great! No bias found."}
        </span>
      </div>
    </div>
  );
}
