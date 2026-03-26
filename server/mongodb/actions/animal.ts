import { AnimalData } from "@/types/types";
import animal from "../models/Animal";

export async function createAnimal(animalData: AnimalData) {
    const newAnimal = new animal(animalData);
    await newAnimal.save();
    return animal;
}

export async function getAnimal(animalId: string) {
    const retrievedAnimal = await animal.findById(animalId);
    return retrievedAnimal;
}

export async function updateAnimal(animalId: string, newData: AnimalData) {
    const updatedAnimal = await animal.findByIdAndUpdate(animalId, newData);
    return updatedAnimal;
}