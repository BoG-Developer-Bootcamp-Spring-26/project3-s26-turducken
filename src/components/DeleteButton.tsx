"use client";
import Image from "next/image"

import { useState } from "react";

interface DeleteButtonProps {
    id: string;
    type: "user" | "animal" | "training"; 
    onSuccess?: () => void; 
}

export default function DeleteButton({ id, type, onSuccess }: DeleteButtonProps) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        const isConfirmed = window.confirm(
            `Are you sure you want to delete this ${type}? This action cannot be undone.`
        );
        if (!isConfirmed) return;

        setIsDeleting(true);

        let key = "";
        if (type === "user") key = "userId";
        else if (type === "animal") key = "animalId";
        else if (type === "training") key = "trainingLogId";

        try {
            const response = await fetch(`/api/${type}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ [key]: id }),
            });

            const data = await response.json();

            if (response.ok) {
                if (onSuccess) {
                    onSuccess();
                } else {
                    window.location.reload(); 
                }
            } else {
                alert(`Error: ${data.message}`);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("A network error occurred while trying to delete.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 hover:cursor-pointer hover:scale-110 rounded-full transition-all disabled:opacity-50 flex items-center justify-center shrink-0"
            title={`Delete ${type}`}
        >
            {isDeleting ? (
                <span className="block w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></span>
            ) : (
                <Image 
                    src="/images/deleteIcon.png"
                    alt="Delete icon" 
                    width={30} 
                    height={30} 
                />
            )}
        </button>
    );
}