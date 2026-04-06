import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import { heebo, oswald } from "@/pages";

interface AnimalFormProps {
  initialData?: any;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function AnimalForm({ initialData, onSave, onCancel }: AnimalFormProps) {
    const router = useRouter();
    const now = new Date(); 
    const [formData, setFormData] = useState({
        trainingLogId: "",
        name: "",
        breed: "",
        owner: "",
        hoursTrained: "",
        profilePicture: "", 
    });
    const context = useContext(UserContext);
    const [loading, setLoading] = useState(false);

    if (!context) {
        return <div>Error: UserContext not found. Ensure this page is wrapped in the Provider.</div>;
      }
      const { userId } = context;
    
      useEffect(() => {
        if (initialData) {
          setFormData(initialData);
        }
      }, [initialData]);

      useEffect(() => {
        if (!userId) {
          router.push("/");
          return;
        }
    }, [userId, router]);

      if (loading) {
        return (
          <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
            <p className="text-xl text-gray-500">Loading</p>
          </div>
        );
      }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <form 
    onSubmit={(e) => {
      e.preventDefault();
      onSave(formData);
    }}
    className="max-w-250 mx-auto bg-white px-2">
        <div className="space-y-5">
            <div>
                <label className="block text-2xl font-semibold text-gray-900">Animal Name</label>
                
                <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    className="text-gray-600 text-2xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-2xl font-semibold text-gray-900">Breed</label>
                <input
                    name="breed"
                    value={formData.breed}
                    onChange={handleChange}
                    placeholder="Breed"
                    className="text-gray-600 text-2xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-2xl font-semibold text-gray-900">Total hours trained</label>
                <input
                    required
                    name="hoursTrained"
                    type="number"
                    value={formData.hoursTrained}
                    onChange={handleChange}
                    placeholder="Hours"
                    className="text-gray-600 text-2xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                />
            </div>

            <div>
                <label className="block text-2xl font-semibold text-gray-900">Profile Picture</label>
                <input
                    name="profilePicture"
                    value={formData.profilePicture}
                    onChange={handleChange}
                    placeholder="Google Image URL"
                    className="text-gray-600 text-2xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                    required
                />
            </div>

            <div className="flex gap-10 pt-6 pb-10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 px-3 border-2 border-red-700 text-3xl text-red-700 rounded-md hover:bg-red-50 transition-colors max-w-50">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-red-700 text-white text-3xl font-semibold rounded-md hover:bg-red-800 transition-colors max-w-50">
                    Save
                </button>
            </div>
        </div>
    </form>
  );

}