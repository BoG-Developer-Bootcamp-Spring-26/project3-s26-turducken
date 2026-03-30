import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';

export default function Signup() {
  const router = useRouter();
  
  // State to hold our form inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    admin: false,
  });
  
  // State for error handling and loading
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Send the POST request to your API endpoint
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      // If successful, route the user back to the login page to sign in
      router.push('/'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-6 text-center">Create Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input 
            type="text" 
            name="fullName"
            placeholder="Full Name" 
            value={formData.fullName}
            onChange={handleChange}
            className="border p-2 rounded w-full" 
            required
          />
          <input 
            type="email" 
            name="email"
            placeholder="Email Address" 
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded w-full" 
            required
          />
          <input 
            type="password" 
            name="password"
            placeholder="Choose a Password" 
            value={formData.password}
            onChange={handleChange}
            className="border p-2 rounded w-full" 
            required
          />
          
          <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
            <input 
              type="checkbox" 
              name="admin"
              checked={formData.admin}
              onChange={handleChange}
              className="w-4 h-4"
            />
            Register as Admin
          </label>

          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-green-600 text-white font-bold py-2 rounded hover:bg-green-700 transition disabled:bg-green-400"
          >
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/" className="text-blue-600 hover:underline font-semibold">
            Log in here
          </Link>
        </div>
      </div>
    </div>
  );
}