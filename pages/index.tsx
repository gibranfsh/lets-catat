import { NextPage } from 'next';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import UserCard from './components/userCard';

interface User {
  name?: string | null | undefined;
  email?: string | null | undefined;
  image?: string | null | undefined;
  role?: string | null | undefined;
};

const Home: NextPage = () => {
  const { data: session } = useSession();
  console.log(session);
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to LetsCatat</h1>
      <div className="flex space-x-4">
        {session ? (
          <>
            <Link href="/note" passHref>
              <button className="bg-green-500 text-white px-4 py-2 rounded">Go to Notes</button>
            </Link>
            <button onClick={() => signOut()} className="bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
          </>
        ) : (
          <button onClick={() => signIn("google")} className="bg-blue-500 text-white px-4 py-2 rounded">Login with Google</button>
        )}
      </div>
      {session && <UserCard user={session.user as User} />}
    </div>
  );
};

export default Home;