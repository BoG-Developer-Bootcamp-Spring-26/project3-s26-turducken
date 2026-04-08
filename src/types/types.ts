import mongoose from 'mongoose';
import { Dispatch, SetStateAction } from 'react';

export interface UserData {
    fullName: string;
    email: string;
    password: string;
    admin: boolean;
}

export interface AnimalData {
    name: string;
    breed: string;
    owner: mongoose.Schema.Types.ObjectId;
    hoursTrained: number;
    bdate: Date;
    profilePicture: string;
}

export interface TrainingLogData {
    user: mongoose.Schema.Types.ObjectId;
    animal: mongoose.Schema.Types.ObjectId;
    title: string;
    date: Date;
    description: string;
    hours: number;
}

export interface UserContextType {
    userId: string | null;
    setUserId: Dispatch<SetStateAction<string | null>>;
}