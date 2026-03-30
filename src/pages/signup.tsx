import Footer from '@/components/Footer';
import TitleBar from '@/components/TitleBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { heebo, oswald } from '.';

export default function Signup() {
  const router = useRouter();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [admin, setAdmin] = useState(false);
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({ fullName, email, password, admin }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      router.push('/'); 
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`${oswald.variable} ${heebo.variable} relative min-h-screen flex flex-col bg-white font-heebo overflow-hidden`}>
        <TitleBar />
      <main className="flex-grow flex flex-col items-center justify-center p-4 z-10">
        <div className="w-full max-w-lg">

        <h1 className="text-5xl font-heebo font-bold mb-10 text-center text-black">Create Account</h1>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSignup} className="flex flex-col gap-6">
          <input 
            type="text" 
            placeholder="Full Name" 
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full border-b-2 border-[#d21312] py-1 text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:border-red-700 transition-colors" 
            required
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-b-2 border-[#d21312] py-1 text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:border-red-700 transition-colors" 
            required
          />
          <input 
            type="password" 
            placeholder="Choose a Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-b-2 border-[#d21312] py-1 text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:border-red-700 transition-colors" 
            required
          />

          <input 
            type="password" 
            placeholder="Confirm Password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border-b-2 border-[#d21312] py-1 text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:border-red-700 transition-colors" 
            required
          />
          
          <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
            <input 
              type="checkbox" 
              checked={admin}
              onChange={(e) => setAdmin(e.target.checked)}
              className="size-5 rounded-none border-2 border-red-600 appearance-none
                        checked:bg-red-600 checked:border-red-600
                        checked:bg-[url('https://api.iconify.design/heroicons:check-16-solid.svg?color=white')]
                        bg-center bg-no-repeat cursor-pointer"
            />
            Admin Access
          </label>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-[#d21312] text-white font-semibold text-2xl py-2.5 mt-4 rounded-lg hover:bg-red-700 transition disabled:bg-red-400 flex justify-center items-center"
          >
            {isLoading ? 'Creating...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-md">
          <span className="text-gray-600">Already have an account? </span>
          <Link href="/" className="text-black font-bold hover:underline">
            Sign in
          </Link>
        </div>
      </div>
      </main>
      <Footer />
    </div>
  );
}