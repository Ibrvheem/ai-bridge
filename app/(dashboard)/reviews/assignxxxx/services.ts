"use server";

import api from "@/lib/api";
import { revalidateTag } from "next/cache";

export async function getUsers() {
  try {
    const response = await api.get("users", { tags: ["users"] });
    return response;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getAllAssignments() {
  try {
    const response = await api.get("reviews/assignments", {
      tags: ["assignments"],
    });
    return response;
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return [];
  }
}

export async function assignReviewer(reviewerId: string, annotatorId: string) {
  try {
    const response = await api.post("reviews/assign", {
      reviewer_id: reviewerId,
      annotator_id: annotatorId,
    });
    revalidateTag("assignments");
    return response;
  } catch (error) {
    console.error("Error assigning reviewer:", error);
    return { error: "Failed to assign reviewer" };
  }
}

export async function removeAssignment(
  reviewerId: string,
  annotatorId: string,
) {
  try {
    const response = await api.delete(
      `reviews/assign/${reviewerId}/${annotatorId}`,
    );
    revalidateTag("assignments");
    return response;
  } catch (error) {
    console.error("Error removing assignment:", error);
    return { error: "Failed to remove assignment" };
  }
}
