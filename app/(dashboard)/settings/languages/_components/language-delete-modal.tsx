"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { Language } from "../types";
import { useDeleteLanguage } from "../_hooks/use-delete-language";

interface LanguageDeleteModalProps {
  language: Language;

  children: React.ReactNode;
}

export function LanguageDeleteModal({
  language,
  children,
}: LanguageDeleteModalProps) {
  const { loading, handleDelete } = useDeleteLanguage(language._id);

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Language</DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="py-4">
          <div className="rounded-lg border p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium">{language.name}</h4>
              <span className="text-xs bg-gray-100 px-2 py-1 rounded uppercase">
                {language.code}
              </span>
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Native name: {language.native_name}
            </p>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span>Status: {language.isActive ? "Active" : "Inactive"}</span>
              <span>Sentences: {0}</span>
            </div>
          </div>

          <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-amber-800">
                  Cannot delete this language
                </p>
                <p className="text-amber-700">
                  This language has {0} existing sentences. You must remove all
                  sentences before deleting the language.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-red-800">Are you sure?</p>
                <p className="text-red-700">
                  This will permanently delete the language &quot;
                  {language.name}&quot; and cannot be undone.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" disabled={loading}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleDelete()}
            loading={loading}
          >
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
