import { AnimalData } from "@/types/types";
import animal from "../models/Animal";

export async function createAnimal(animalData: AnimalData) {
    const newAnimal = new animal(animalData);
    await newAnimal.save();
    return newAnimal;
}

export async function getAnimal(animalId: string) {
    const retrievedAnimal = await animal.findById(animalId);
    return retrievedAnimal;
}

export async function updateAnimal(animalId: string, newHours: Number) {
    const updatedAnimal = await animal.findByIdAndUpdate(animalId, { hoursTrained: newHours });
    return updatedAnimal;
}

export async function deleteAnimal(animalId: string) {
    await animal.findByIdAndDelete(animalId);
}

export async function deleteAnimalsByUser(userId: string) {
    await animal.deleteMany({ owner: userId });
}