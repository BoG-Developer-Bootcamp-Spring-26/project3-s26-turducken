import { TrainingLogData } from "@/types/types";
import trainingLog from "../models/TrainingLog";

export async function createTrainingLog(trainingLogData: TrainingLogData) {
    const newTrainingLog = new trainingLog(trainingLogData);
    await newTrainingLog.save();
    return trainingLog;
}

export async function getTrainingLog(trainingLogId: string) {
    const retrievedTrainingLog = await trainingLog.findById(trainingLogId);
    return retrievedTrainingLog;
}

export async function updateTrainingLog(trainingLogId: string, newData: TrainingLogData) {
    const updatedTrainingLog = await trainingLog.findByIdAndUpdate(trainingLogId, newData);
    return updatedTrainingLog;
}