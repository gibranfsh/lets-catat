import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import UserCard from './components/userCard';
import type { GetServerSideProps } from 'next'
import { getSession } from 'next-auth/react'

interface User {
  id: string
  name: string
  email: string
  image?: string
  emailVerified?: string
  role: string
}

const Home = ({ user }: { user: User}) => {

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-6">Welcome to LetsCatat</h1>
      <div className="flex space-x-4">
        {user ? (
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
      {user && <UserCard user={user as User} />}
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  return {
    props: {
      user: session?.user || null,
    },
  };
}