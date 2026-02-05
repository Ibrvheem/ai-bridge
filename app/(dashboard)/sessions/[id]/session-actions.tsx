"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  MoreHorizontal,
  PlayCircle,
  PauseCircle,
  CheckCircle2,
  Trash2,
  Loader2,
} from "lucide-react";
import { updateSession, deleteSession } from "../services";
import { SessionStatus } from "../types";

interface SessionActionsProps {
  sessionId: string;
  currentStatus: SessionStatus;
}

export function SessionActions({
  sessionId,
  currentStatus,
}: SessionActionsProps) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: SessionStatus) => {
    setIsUpdating(true);
    try {
      const result = await updateSession(sessionId, { status: newStatus });
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success(`Session ${newStatus}`);
      router.refresh();
    } catch (error) {
      toast.error("Failed to update session status");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const result = await deleteSession(sessionId);
      if ("error" in result) {
        toast.error(result.error);
        return;
      }
      toast.success("Session deleted");
      router.push("/sessions");
    } catch (error) {
      toast.error("Failed to delete session");
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isUpdating}>
            {isUpdating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <MoreHorizontal className="h-4 w-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {currentStatus !== SessionStatus.ACTIVE && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(SessionStatus.ACTIVE)}
            >
              <PlayCircle className="h-4 w-4 mr-2" />
              Resume Session
            </DropdownMenuItem>
          )}
          {currentStatus === SessionStatus.ACTIVE && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(SessionStatus.PAUSED)}
            >
              <PauseCircle className="h-4 w-4 mr-2" />
              Pause Session
            </DropdownMenuItem>
          )}
          {currentStatus !== SessionStatus.COMPLETED && (
            <DropdownMenuItem
              onClick={() => handleStatusChange(SessionStatus.COMPLETED)}
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Completed
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Session
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Session?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. If this session has exports, it
              cannot be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
