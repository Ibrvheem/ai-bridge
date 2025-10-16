"use server"
import detectionAPI from "@/lib/detection-api";
import { FindDetectionPayload } from "./types";

export async function findBias(payload: FindDetectionPayload) {
    try {
        const response = await detectionAPI.post('/detect', payload)
        return response;
    } catch (error) {
        console.error("Error finding bias:", error);
        throw error;
    }
}