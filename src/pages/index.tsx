import TitleBar from '@/components/TitleBar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useContext } from 'react';
import { Oswald, Heebo } from "next/font/google";
import { UserContext } from "../context/UserContext";
import Footer from '@/components/Footer';

export const oswald = Oswald({
  subsets: ["latin"],
  variable: "--font-oswald",
});

export const heebo = Heebo({
  subsets: ["latin"],
  variable: "--font-heebo",
});

export default function Login() {
  const router = useRouter();
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("Signup must be used within a UserContext.Provider");
  }
  const { setUserId } = context;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }), 
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to log in');
      }

      setUserId(data.userId);
      router.push(`/dashboard/training-logs`);
      
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
          
          <h1 className="text-5xl font-heebo font-bold mb-10 text-center text-black">Login</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            
            <input 
              type="email" 
              placeholder="Email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-b-2 border-[#d21312] py-1 text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:border-red-700 transition-colors" 
              required
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-b-2 border-[#d21312] py-1 text-gray-800 bg-transparent placeholder-gray-500 focus:outline-none focus:border-red-700 transition-colors" 
              required
            />
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[#cc1a1a] text-2xl text-white font-semibold py-2.5 mt-4 rounded-lg hover:bg-red-700 transition disabled:bg-red-400 flex justify-center items-center"
            >
              {isLoading ? 'Verifying...' : 'Log in'}
            </button>
          </form>

          <div className="mt-6 text-center text-md">
            <span className="text-gray-600">Don't have an account? </span>
            <Link href="/signup" className="text-black font-bold hover:underline">
              Sign up
            </Link>
          </div>
        </div>
      </main>

      <Footer />

    </div>
  );
}