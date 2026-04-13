import type { NextApiRequest, NextApiResponse } from "next";
import { TrainingLogData } from "@/types/types";
import { createTrainingLog, deleteTrainingLog, getTrainingLog, updateTrainingLog } from "../../../server/mongodb/actions/trainingLog";
import { getAnimal, updateAnimal } from "../../../server/mongodb/actions/animal";
import connectDb from "../../../server/mongodb/index";

interface TrainingLogApiData {
    trainingLogData?: TrainingLogData;
    message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TrainingLogApiData>,
) {
    if (req.method === 'POST') {
        try {
            if (!req.body.user || !req.body.animal || !req.body.title || !req.body.date || !req.body.description || !req.body.hours) {
                return res.status(400).json({
                    message: "User, animal, title, date, description, and hours are required for creating a trainingLog!"
                });
            }
            await connectDb();
            const animal = await getAnimal(req.body.animal);
            if (!animal || animal.owner.toString() !== req.body.user) {
                return res.status(400).json({ message: "The specified animal does not belong to this user!" });
            }
            const trainingLogData = {
                user: req.body.user,
                animal: req.body.animal,
                title: req.body.title,
                date: req.body.date,
                description: req.body.description,
                hours: req.body.hours,
            } as TrainingLogData;
            const trainingLog = await createTrainingLog(trainingLogData);
            const newTotalHours = (animal.hoursTrained) + req.body.hours;
            await updateAnimal(animal._id.toString(), newTotalHours);
            res.status(200).json({
                trainingLogData: trainingLogData,
                message: "TrainingLog successfully created!",
            });
        } catch (e) {
            res.status(500).json({
                message: "There was an error when adding your trainingLog to the database."
            });
        }
    } else if (req.method === 'PATCH') {
        try {
            if (!req.body.user || !req.body.animal || !req.body.title || !req.body.date || !req.body.description || !req.body.hours) {
                return res.status(400).json({
                    message: "Updating a trainingLog requires user, animal, title, date, description, and hours!"
                });
            }
            await connectDb();
            const oldLog = await getTrainingLog(req.body.trainingLogId);
            if (!oldLog) {
                return res.status(400).json({
                    message: "TrainingLog not found!"
                });
            }
            const hoursDifference = req.body.hours - oldLog.hours;
            const trainingLogData = {
                user: req.body.user,
                animal: req.body.animal,
                title: req.body.title,
                date: req.body.date,
                description: req.body.description,
                hours: req.body.hours,
            };
            const trainingLog = await updateTrainingLog(req.body.trainingLogId, trainingLogData);
            if (hoursDifference !== 0) {
                const animal = await getAnimal(req.body.animal);
                const newTotalHours = (animal.hoursTrained) + hoursDifference;
                await updateAnimal(animal._id.toString(), newTotalHours);
            }
            res.status(200).json({
                trainingLogData: trainingLogData,
                message: "Successfully updated trainingLog!",
            })
        } catch (e) {
            res.status(500).json({
                message: "There was an error when updating your trainingLog to the database."
            });
        }
    }
    else if (req.method === 'DELETE') {
        try {
            if (!req.body.trainingLogId) {
                return res.status(400).json({
                    message: "Deleting a training log requires a trainingLogId!"
                })
            }
            await connectDb();
            const logToDelete = await getTrainingLog(req.body.trainingLogId);
            if (!logToDelete) {
                return res.status(400).json({
                    message: "TrainingLog not found!"
                });
            }
            await deleteTrainingLog(req.body.trainingLogId);
            const animal = await getAnimal(logToDelete.animal);
            if (animal) {
                const newHours = Math.max(0, animal.hoursTrained - logToDelete.hours);
                await updateAnimal(animal._id.toString(), newHours);
            }

            res.status(200).json({
                message: "Succesfully deleted trainingLog and updated animal hours!"
            })
        } catch (e) {
            res.status(500).json({
                message: "There was an error when deleting your trainingLog from database."
            });
        }
    } else {
        res.status(500).json({
            message: "This API doesn't support this HTTP method!",
        });
    }
}