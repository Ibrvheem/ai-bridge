"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Tag, Edit3 } from "lucide-react";
import dayjs from "@/lib/dayjs";
import { useState } from "react";
import { AnnotateSentenceModal } from "./annotate-sentence-modal";
import type { SentenceSchema } from "../types";

type Sentence = SentenceSchema;

type SentenceCardProps = {
  sentence: Sentence;
};

export function SentenceCard({ sentence }: SentenceCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getBadgeColor = (category: string) => {
    const colors: Record<string, string> = {
      Gender: "bg-purple-100 text-purple-800 border-purple-200",
      "Race / ethnicity": "bg-blue-100 text-blue-800 border-blue-200",
      "Age (young / middle / elderly; also continuous age ranges)":
        "bg-green-100 text-green-800 border-green-200",
      "Disability (visible, invisible, physical, cognitive)":
        "bg-orange-100 text-orange-800 border-orange-200",
      "Religion / belief system": "bg-pink-100 text-pink-800 border-pink-200",
      "Nationality / immigration status":
        "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Socioeconomic status (income, education)":
        "bg-amber-100 text-amber-800 border-amber-200",
    };
    return colors[category] || "bg-slate-100 text-slate-800 border-slate-200";
  };

  const getCategoryShortName = (category: string) => {
    const shortNames: Record<string, string> = {
      Gender: "Gender",
      "Race / ethnicity": "Race/Ethnicity",
      "Age (young / middle / elderly; also continuous age ranges)": "Age",
      "Disability (visible, invisible, physical, cognitive)": "Disability",
      "Religion / belief system": "Religion",
      "Nationality / immigration status": "Nationality",
      "Socioeconomic status (income, education)": "Socioeconomic",
    };
    return shortNames[category] || category;
  };

  return (
    <>
      <Card className="p-5 hover:shadow-md transition-all duration-200 border-slate-200 group">
        <div className="space-y-4">
          {/* Sentence Content */}
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <p className="text-base text-slate-900 leading-relaxed flex-1">
                {sentence.sentence}
              </p>
              {sentence.bias_category ? (
                <Badge
                  className={`${getBadgeColor(
                    sentence.bias_category
                  )} border shrink-0`}
                >
                  <Tag className="h-3 w-3 mr-1" />
                  {getCategoryShortName(sentence.bias_category)}
                </Badge>
              ) : (
                <Badge className="bg-amber-50 text-amber-700 border-amber-200 border shrink-0">
                  Pending
                </Badge>
              )}
            </div>

            {sentence.original_content && (
              <div className="rounded-md bg-slate-50 border border-slate-200 p-3">
                <p className="text-xs font-medium text-slate-600 mb-1">
                  Original Content:
                </p>
                <p className="text-sm text-slate-700">
                  {sentence.original_content}
                </p>
              </div>
            )}
          </div>

          {/* Metadata and Action */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <User className="h-3.5 w-3.5" />
                <span>{sentence.user?.email}</span>
              </div>

              <div className="flex items-center gap-1.5 text-xs text-slate-600">
                <Calendar className="h-3.5 w-3.5" />
                <span>{dayjs(sentence.created_at).fromNow()}</span>
              </div>

              {sentence.language && (
                <Badge variant="outline" className="text-xs">
                  {sentence.language.toUpperCase()}
                </Badge>
              )}
            </div>

            <Button
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-8 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Edit3 className="h-3 w-3 mr-1" />
              Annotate
            </Button>
          </div>
        </div>
      </Card>

      <AnnotateSentenceModal
        sentence={sentence}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
