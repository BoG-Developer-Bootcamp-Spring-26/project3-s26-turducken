import { UserData } from "@/types/types";
import user from "../models/User";

export async function createUser(userData: UserData) {
    const newUser = new user(userData);
    await newUser.save();
    return newUser;
}

export async function getUser(userId: string) {
    const retrievedUser = await user.findById(userId);
    return retrievedUser;
}

export async function updateUser(userId: string, newData: UserData) {
    const updatedUser = await user.findByIdAndUpdate(userId, newData);
    return updatedUser;
}

export async function deleteUser(userId: string) {
    await user.findByIdAndDelete(userId);
}