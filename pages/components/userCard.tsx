import { NextPage } from 'next';
import Image from 'next/image';

interface UserCardProps {
    user: {
        name?: string | null | undefined;
        email?: string | null | undefined;
        image?: string | null | undefined;
        role?: string | null | undefined;
    };
}

const UserCard: NextPage<UserCardProps> = ({ user }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-8">
            {user && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <Image
                        src={user.image || ""}
                        alt={user.name || ""}
                        width={128}
                        height={128}
                        className="rounded-full w-32 h-32 mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-2">{user.name || ""}</h1>
                    <p className="text-gray-600">Email: {user.email || ""}</p>
                    <p className="text-gray-600">Role: {user.role || ""}</p>
                </div>
            )}
        </div>
    );
};

export default UserCard;
