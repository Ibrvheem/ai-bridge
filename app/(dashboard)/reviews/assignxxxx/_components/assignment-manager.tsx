"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { assignReviewer, removeAssignment } from "../services";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  type: string;
}

interface PopulatedAssignment {
  _id: string;
  reviewer_id: { _id: string; email: string };
  annotator_id: { _id: string; email: string };
  created_at: string;
}

export function AssignmentManager({
  users,
  assignments,
}: {
  users: User[];
  assignments: PopulatedAssignment[];
}) {
  const router = useRouter();
  const [reviewerId, setReviewerId] = useState("");
  const [annotatorId, setAnnotatorId] = useState("");
  const [isPending, startTransition] = useTransition();
  const [removingId, setRemovingId] = useState<string | null>(null);

  const handleAssign = () => {
    if (!reviewerId || !annotatorId) return;
    startTransition(async () => {
      const result = await assignReviewer(reviewerId, annotatorId);
      if (!result.error) {
        setReviewerId("");
        setAnnotatorId("");
        router.refresh();
      }
    });
  };

  const handleRemove = (rId: string, aId: string, assignmentId: string) => {
    setRemovingId(assignmentId);
    startTransition(async () => {
      await removeAssignment(rId, aId);
      setRemovingId(null);
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      {/* Assign Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">New Assignment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="w-full sm:w-64 space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Reviewer
              </label>
              <Select value={reviewerId} onValueChange={setReviewerId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select reviewer" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u._id} value={u._id}>
                      {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="w-full sm:w-64 space-y-1.5">
              <label className="text-sm font-medium text-slate-700">
                Annotator
              </label>
              <Select value={annotatorId} onValueChange={setAnnotatorId}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select annotator" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) => u._id !== reviewerId)
                    .map((u) => (
                      <SelectItem key={u._id} value={u._id}>
                        {u.email}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={handleAssign}
              disabled={!reviewerId || !annotatorId || isPending}
              className="w-full sm:w-auto"
            >
              {isPending && !removingId ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Assign
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Current Assignments ({assignments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {assignments.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-8">
              No assignments yet. Use the form above to assign a reviewer to an
              annotator.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reviewer</TableHead>
                  <TableHead>Annotator</TableHead>
                  <TableHead className="w-[80px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((a) => (
                  <TableRow key={a._id}>
                    <TableCell className="font-medium">
                      {a.reviewer_id?.email || "Unknown"}
                    </TableCell>
                    <TableCell>{a.annotator_id?.email || "Unknown"}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleRemove(
                            a.reviewer_id?._id,
                            a.annotator_id?._id,
                            a._id,
                          )
                        }
                        disabled={removingId === a._id}
                      >
                        {removingId === a._id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-red-500" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
