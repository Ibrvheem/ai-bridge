"use client";

import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import { useState } from "react";
import { findBias, findBiasModelS } from "../service";
import { BiasResult } from "./bias-result";
import { Tabs } from "@/components/ui/tabs";

function BiasResultSkeleton() {
  return (
    <div className="relative max-w-3xl mx-auto mt-8 animate-pulse">
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-slate-700 via-slate-800 to-slate-900 rounded-2xl opacity-30 blur-lg" />
        <div className="relative bg-gradient-to-br from-slate-900/90 to-slate-950/90 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/40 to-slate-900/40 opacity-50 rounded-2xl pointer-events-none" />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-slate-700/30 ring-1 ring-slate-700/30">
                  <div className="h-6 w-6 rounded-full bg-slate-700/40" />
                </div>
                <div>
                  <div className="h-5 w-32 bg-slate-700/40 rounded mb-2" />
                  <div className="h-3 w-20 bg-slate-700/30 rounded" />
                </div>
              </div>
              <div className="h-8 w-24 rounded bg-slate-700/30" />
            </div>
            <div className="mb-6 p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 rounded-full bg-slate-700/40" />
                <div className="h-3 w-24 bg-slate-700/30 rounded" />
              </div>
              <div className="h-4 w-full bg-slate-700/30 rounded mb-1" />
              <div className="h-4 w-2/3 bg-slate-700/20 rounded" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="h-4 w-4 rounded-full bg-slate-700/40" />
                    <div className="h-3 w-20 bg-slate-700/30 rounded" />
                  </div>
                  <div className="h-5 w-10 bg-slate-700/30 rounded" />
                </div>
                <div className="h-2 w-full bg-slate-700/30 rounded-full" />
              </div>
              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="h-2 w-2 rounded-full bg-slate-700/40 mt-1" />
                  <div>
                    <div className="h-3 w-16 bg-slate-700/30 rounded mb-1" />
                    <div className="h-4 w-40 bg-slate-700/20 rounded mb-1" />
                    <div className="h-4 w-32 bg-slate-700/20 rounded" />
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="h-3 w-48 mx-auto bg-slate-700/30 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BiasInputProps {
  placeholders: string[];
}

export function BiasInput({ placeholders }: BiasInputProps) {
  const [text, setText] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("default");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      setLoading(true);
      setResult(null);
      const response =
        selectedModel == "default"
          ? await findBias({ text })
          : await findBiasModelS({ text });
      setText(""); // Clear input after submission
      setResult(response);
      setLoading(false);
      console.log("Bias detection response:", response);
      return response;
    } catch (error) {
      setLoading(false);
      return error;
    }
  };

  const tabs = [
    {
      title: "Model 1.0.0",
      value: "default",
    },
    {
      title: "Model 1.0.1",
      value: "soto",
    },
  ];

  return (
    <div className="w-full min-h-[50vh] ">
      <div className="flex justify-center mb-6">
        <Tabs
          tabs={tabs}
          containerClassName="bg-slate-900/50 backdrop-blur-sm rounded-full p-1 border border-slate-800 w-fit"
          activeTabClassName="bg-gradient-to-r from-slate-700 to-slate-800"
          tabClassName="text-sm font-medium transition-all"
          onTabChange={(value) => setSelectedModel(value)}
        />
      </div>

      <PlaceholdersAndVanishInput
        placeholders={placeholders}
        onChange={handleChange}
        onSubmit={onSubmit}
      />

      {loading && <BiasResultSkeleton />}
      {!loading && result && <BiasResult result={result} />}
    </div>
  );
}
