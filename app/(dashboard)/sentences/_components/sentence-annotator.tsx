"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Edit3 } from "lucide-react";
import { AnnotateSentenceModal } from "./annotate-sentence-modal";
import { SentenceSchema } from "../types";

type SentenceAnnotatorProps = {
  sentence: SentenceSchema;
};

export function SentenceAnnotator({ sentence }: SentenceAnnotatorProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsModalOpen(true)}
        className="h-8"
      >
        <Edit3 className="h-3 w-3 mr-1" />
        Annotate
      </Button>
      <AnnotateSentenceModal
        sentence={sentence}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
}
