import { TrainingLogData } from "@/types/types";
import trainingLog from "../models/TrainingLog";

export async function createTrainingLog(trainingLogData: TrainingLogData) {
    const newTrainingLog = new trainingLog(trainingLogData);
    await newTrainingLog.save();
    return newTrainingLog;
}

export async function getTrainingLog(trainingLogId: string) {
    const retrievedTrainingLog = await trainingLog.findById(trainingLogId);
    return retrievedTrainingLog;
}

export async function updateTrainingLog(trainingLogId: string, newData: TrainingLogData) {
    const updatedTrainingLog = await trainingLog.findByIdAndUpdate(trainingLogId, newData);
    return updatedTrainingLog;
}

export async function deleteTrainingLog(trainingLogId: string) {
    await trainingLog.findByIdAndDelete(trainingLogId);
}

export async function deleteTrainingLogsByAnimal(animalId: string) {
    await trainingLog.deleteMany({ animal: animalId });
}

export async function deleteTrainingLogsByUser(userId: string) {
    await trainingLog.deleteMany({ user: userId });
}