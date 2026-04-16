import { useContext, useState, useEffect } from "react";
import { UserContext } from "@/context/UserContext";
import { useRouter } from "next/router";
import { heebo } from "@/pages";

interface TrainingLogsFormProps {
  initialData?: any;
  editingLog?: boolean;
  onSave: (data: any) => void;
  onCancel: () => void;
}

export default function TrainingForm({ initialData, editingLog, onSave, onCancel }: TrainingLogsFormProps) {
    const router = useRouter();
    const now = new Date(); 
    const [formData, setFormData] = useState({
    trainingLogId: "",
    title: "",
    animal: "",
    animalBreed: "",
    animalName: "",
    hours: "",
    month: now.toLocaleString('default', { month: 'long' }),
    day: now.getDate(),
    year: now.getFullYear(),
    description: "",
  });
  const context = useContext(UserContext);
  const [animals, setAnimals] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true);

  if (!context) {
    return <div>Error: UserContext not found. Ensure this page is wrapped in the Provider.</div>;
  }
  const { userId } = context;

  useEffect(() => {
    if (editingLog && initialData) {
      setFormData(initialData);
    }
  }, [initialData, editingLog]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/user/animals");
        const allAnimals = await response.json();
        const userAnimals = allAnimals.filter((animal: any) => animal.owner === userId);
        setAnimals(userAnimals);
      } catch (error) {
        console.error("Failed to fetch animals:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [userId, router]);

  if (loading) {
    return (
      <div className={`${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
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
      if (Number(formData.hours) <= 0) {
        alert("Please enter a valid number of hours.");
        return;
      }
      const testDate = new Date(`${formData.month} ${formData.day}, ${formData.year}`);

      if (isNaN(testDate.getTime())) {
        alert("Please enter a valid date.");
        return;
      }
      onSave(formData);
    }}
    className="max-w-200 mx-auto bg-white px-2">
        <div className="space-y-4">
            <div>
                <label className="block text-xl font-semibold text-gray-900">Title</label>
                
                <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Title"
                    className="text-gray-600 text-xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                    required
                />
            </div>

            <div>
                <label className="block text-xl font-semibold text-gray-900">Select Animal</label>
                <select
                    required
                    name="animal"
                    value={formData.animal}
                    onChange={handleChange}
                    className="text-gray-600 text-xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md bg-white appearance-none">
                    <option value="" disabled>Select an animal</option>
                    {animals.map((animal) => (
                            <option value={ animal._id }>{ animal.name } - { animal.breed }</option>
                        ))}
                </select>
            </div>

            <div>
                <label className="block text-xl font-semibold text-gray-900">Total hours trained</label>
                <input
                    required
                    name="hours"
                    type="number"
                    value={formData.hours}
                    onChange={handleChange}
                    placeholder="Hours"
                    className="text-gray-600 text-xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <div>
                    <label className="block text-xl font-semibold text-gray-900">Month</label>
                    <select
                    required
                    name="month"
                    value={formData.month}
                    onChange={handleChange}
                    className="text-gray-600 text-xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md bg-white">
                        <option value="January">January</option>
                        <option value="February">February</option>
                        <option value="March">March</option>
                        <option value="April">April</option>
                        <option value="May">May</option>
                        <option value="June">June</option>
                        <option value="July">July</option>
                        <option value="August">August</option>
                        <option value="September">September</option>
                        <option value="October">October</option>
                        <option value="November">November</option>
                        <option value="December">December</option>
                    </select>
                </div>
                <div>
                    <label className="block text-xl font-semibold text-gray-900">Date</label>
                    <input
                    required
                    name="day"
                    type="text"
                    value={formData.day}
                    onChange={handleChange}
                    className="text-gray-600 text-xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-xl font-semibold text-gray-900">Year</label>
                    <input
                    required
                    name="year"
                    type="text"
                    value={formData.year}
                    onChange={handleChange}
                    className="text-gray-600 text-xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xl font-semibold text-gray-900">Note</label>
                <textarea
                    required
                    name="description"
                    rows={5}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Note"
                    className="text-gray-600 text-xl font-semibold w-full py-5 px-6 border border-gray-300 border-2 rounded-md"
                />
            </div>

            <div className="flex gap-10 pt-6 pb-10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 py-2 px-3 border-2 border-red-700 text-2xl text-red-700 rounded-md hover:bg-red-50 transition-colors max-w-50">
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 py-2 px-3 bg-red-700 text-white text-2xl font-semibold rounded-md hover:bg-red-800 transition-colors max-w-50">
                    {editingLog? "Edit": "Save"}
                </button>
            </div>
        </div>
    </form>
  );
}