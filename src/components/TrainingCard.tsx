import Image from 'next/image';
import DeleteButton from './DeleteButton';

interface TrainingCardProps {
    trainingLogId: string;
    userName: string;
    animal: string;
    animalBreed: string;
    animalName: string;
    title: string;
    date: Date;
    description: string;
    hours: number;
    setInitialData: (data: any) => void;
    setShowForm: (show: boolean) => void;
    setEditingLog: (log: any) => void;
}

export default function TrainingCard({
  trainingLogId, userName, animal, animalBreed, animalName, title, date, description, hours, setInitialData, setEditingLog, setShowForm
}: TrainingCardProps) {
  const handleEditLog = () => {
    setShowForm(true);
    setEditingLog(true);
    setInitialData({
      trainingLogId,
      userName,
      animal,
      animalBreed,
      animalName,
      title,
      month: date.toLocaleString('default', { month: 'long' }),
      day: date.getDate(),
      year: date.getFullYear(),
      description,
      hours,
    })
  }
  return (
    <div className="flex bg-white rounded-2xl shadow-md mb-4 overflow-hidden border border-gray-100 h-40 shrink-0 mr-20 ml-20">
      <div className="bg-blue-950 font-oswald text-white flex flex-col justify-center items-center px-4 min-w-30 gap-3">
        <span className="text-6xl font-bold">{date.getDate()}</span>
        <span className="text-2xl">{date.toLocaleString('default', { month: 'short' })} - {date.getFullYear()}</span>
      </div>

      <div className="flex flex-1 justify-between px-6 py-4">
        <div className="flex flex-col md:gap-4 sm:gap-2">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <h3 className="md:text-3xl sm:text-xl font-bold text-gray-900">{title}</h3>
              <span className="text-gray-400 md:text-xl sm:text-md font-semibold">• {hours} hours</span>
            </div>
            <p className="text-gray-400 md:text-xl sm:text-md font-semibold">
              {userName} - {animalBreed} - {animalName}
            </p>
          </div>
          <p className="text-black mt-1 md:text-xl sm:text-md">
            {description}
          </p>
        </div>
        <div className='flex flex-col justify-between'>
        <button onClick={handleEditLog} className='w-14'>
          <Image src="/images/trainingLogcardEditButton.png" alt="Edit Training Log" width={80} height={80}/>
        </button>
        <div className='shrink-0'>
        <DeleteButton type='training' id={trainingLogId}/>
        </div>
        </div>
      </div>
    </div>
  );
}