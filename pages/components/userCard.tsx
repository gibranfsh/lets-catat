import { DefaultSession } from "next-auth"

interface UserCardProps {
    user: DefaultSession["user"] | null;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
    return (
        <div className="flex flex-col items-center justify-center mt-8">
            {user && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <img
                        src={user.image || ""}
                        alt={user.name || ""}
                        className="rounded-full w-32 h-32 mb-4"
                    />
                    <h1 className="text-2xl font-bold mb-2">{user.name || ""}</h1>
                    <p className="text-gray-600">{user.email || ""}</p>
                </div>
            )}
        </div>
    );
};

export default UserCard;
