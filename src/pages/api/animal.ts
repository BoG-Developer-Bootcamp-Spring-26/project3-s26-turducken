import type { NextApiRequest, NextApiResponse } from "next";
import { AnimalData } from "@/types/types";
import { createAnimal, getAnimal, updateAnimal } from "../../../server/mongodb/actions/animal";
import connectDb from "../../../server/mongodb/index";

interface AnimalApiData {
    animalData?: Partial<AnimalData>;
    message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnimalApiData>,
) {
    if (req.method === 'GET') {
        try {
            if (!req.query.animalId) {
                return res.status(400).json({
                    message: "Animal ID is required for retrieving a animal!"
                });
            }
            await connectDb();
            const animal = await getAnimal(req.query.animalId as string);
            if (!animal) {
                return res.status(400).json({
                    message: "No animal found with the provided ID!"
                });
            }
            res.status(200).json({
                animalData: animal,
                message: "Animal successfully retrieved!",
            });
        } catch (e) {
            res.status(500).json({
                message: "There was an error when retrieving your animal from the database."
            });
        }
    } else if (req.method === 'POST') {
        try {
            if (!req.body.name || !req.body.breed || !req.body.owner || !req.body.hoursTrained || !req.body.profilePicture) {
                return res.status(400).json({
                    message: "Name, breed, owner, hours trained, and profile picture are required for creating a animal!"
                });
            }
            const animalData = {
                name: req.body.name,
                breed: req.body.breed,
                owner: req.body.owner,
                hoursTrained: req.body.hoursTrained,
                profilePicture: req.body.profilePicture,
            } as AnimalData;
            await connectDb();
            const animal = await createAnimal(animalData);
            res.status(200).json({
                animalData: animalData,
                message: "Animal successfully created!",
            });
        } catch (e) {
            return res.status(500).json({
                message: "There was an error when adding your animal to the database."
            });
        }
    } else if (req.method === 'PATCH') {
        try {
            if (!req.body.hoursTrained) {
                return res.status(400).json({
                    message: "Updating a animal requires the hours trained!"
                });
            }
            await connectDb();
            const animal = await updateAnimal(req.body.animalId, req.body.hoursTrained);
            if (!animal) {
                return res.status(400).json({
                    message: "Animal not found!"
                });
            } else {
                res.status(200).json({
                    animalData: {
                        hoursTrained: animal.hoursTrained,
                    },
                    message: "Successfully updated animal!",
                })
            }
        } catch (e) {
            res.status(500).json({
                message: "There was an error when updating your animal to the database."
            });
        }
    } else {
        res.status(500).json({
            message: "This API doesn't support this HTTP method!",
        });
    }
}