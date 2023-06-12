import type { GetServerSideProps, NextPage } from 'next';
import { useSession, getSession } from 'next-auth/react';

interface Session {
    user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
        role?: string | null;
    };
}

const AdminOnly: NextPage = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="flex space-x-4">
                <p className="text-4xl font-bold mb-6">This page is only for admin</p>
            </div>
        </div>
    );
}

export default AdminOnly;

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context) as Session;

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    if (session?.user?.role !== 'admin') {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }

    return {
        props: {},
    };
}