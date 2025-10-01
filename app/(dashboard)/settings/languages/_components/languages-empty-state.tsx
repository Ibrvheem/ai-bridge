"use client";

import { Languages, Plus } from "lucide-react";
import { EmptyState } from "@/components/molecules/empty-state";

interface LanguagesEmptyStateProps {
  onAddLanguage?: () => void;
}

export function LanguagesEmptyState({
  onAddLanguage,
}: LanguagesEmptyStateProps) {
  return (
    <EmptyState
      icon={Languages}
      title="No languages configured"
      description="Get started by adding your first language for annotation support. Languages help organize and categorize your content."
      action={
        onAddLanguage
          ? {
              label: "Add Language",
              onClick: onAddLanguage,
              icon: Plus,
            }
          : undefined
      }
      size="lg"
    />
  );
}
