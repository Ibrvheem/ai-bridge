import { Badge } from "@/components/ui/badge";
import {
  AlertTriangle,
  CheckCircle2,
  Tag,
  Shield,
  TrendingUp,
} from "lucide-react";

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

  const getBadgeStyle = (category: string) => {
    const styles: Record<string, string> = {
      Gender: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      "Race / ethnicity": "bg-blue-500/20 text-blue-300 border-blue-500/30",
      "Age (young / middle / elderly; also continuous age ranges)":
        "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
      "Disability (visible, invisible, physical, cognitive)":
        "bg-orange-500/20 text-orange-300 border-orange-500/30",
      "Religion / belief system":
        "bg-pink-500/20 text-pink-300 border-pink-500/30",
      "Nationality / immigration status":
        "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
      "Socioeconomic status (income, education)":
        "bg-amber-500/20 text-amber-300 border-amber-500/30",
    };
    return (
      styles[category] || "bg-slate-500/20 text-slate-300 border-slate-500/30"
    );
  };

  const getGradient = () => {
    if (has_bias) {
      return "from-amber-500/10 via-transparent to-red-500/10";
    }
    return "from-emerald-500/10 via-transparent to-teal-500/10";
  };

  const confidencePercentage = confidence * 100;

  return (
    <div
      className={`relative max-w-3xl mx-auto mt-8 transition-all duration-700 ease-out opacity-100 translate-y-0`}
    >
      {/* Glassmorphic Card */}
      <div className="relative group">
        {/* Animated gradient border effect */}
        <div
          className={`absolute -inset-0.5 bg-gradient-to-r ${
            has_bias
              ? "from-amber-500 via-red-500 to-pink-500"
              : "from-emerald-500 via-teal-500 to-cyan-500"
          } rounded-2xl opacity-30 blur-lg group-hover:opacity-50 transition duration-500`}
        ></div>

        {/* Main card */}
        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          {/* Background gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50 rounded-2xl pointer-events-none`}
          ></div>

          {/* Content */}
          <div className="relative z-10">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div
                  className={`p-3 rounded-xl ${
                    has_bias
                      ? "bg-amber-500/20 ring-1 ring-amber-500/30"
                      : "bg-emerald-500/20 ring-1 ring-emerald-500/30"
                  }`}
                >
                  {has_bias ? (
                    <AlertTriangle className="h-6 w-6 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                  )}
                </div>
                <div>
                  <h3
                    className={`text-xl font-bold ${
                      has_bias ? "text-amber-300" : "text-emerald-300"
                    }`}
                  >
                    {has_bias ? "Bias Detected" : "No Bias Detected"}
                  </h3>
                  <p className="text-sm text-slate-400 mt-1">
                    Analysis Complete
                  </p>
                </div>
              </div>

              {has_bias && (
                <Badge
                  className={`${getBadgeStyle(
                    bias_category
                  )} border px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 backdrop-blur-sm`}
                >
                  <Tag className="h-3.5 w-3.5" />
                  {bias_category}
                </Badge>
              )}
            </div>

            {/* Input Text Display */}
            <div className="mb-6 p-4 bg-black/30 rounded-xl border border-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="h-4 w-4 text-slate-500" />
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Analyzed Text
                </span>
              </div>
              <p className="text-slate-200 leading-relaxed">{text}</p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Confidence Score */}
              {has_bias && (
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-amber-400" />
                      <span className="text-sm font-semibold text-slate-300">
                        Confidence Score
                      </span>
                    </div>
                    <span className="text-xl font-bold text-amber-300">
                      {confidencePercentage.toFixed(1)}%
                    </span>
                  </div>
                  {/* Animated progress bar */}
                  <div className="h-2 bg-slate-800/50 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-red-500 rounded-full transition-all duration-1000 ease-out"
                      style={{
                        width: `${confidencePercentage}%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {/* Analysis Message */}
              <div
                className={`p-4 bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors ${
                  !has_bias ? "md:col-span-2" : ""
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    <div className="h-2 w-2 rounded-full bg-teal-400 animate-pulse"></div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                      Analysis
                    </span>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="pt-4 border-t border-white/5">
              <p className="text-xs text-slate-500 text-center">
                Powered by AI-BRIDGE Advanced Bias Detection Engine
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
