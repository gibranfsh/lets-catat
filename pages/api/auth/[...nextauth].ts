import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "./lib/mongodb"

const authOptions: NextAuthOptions = {
    adapter: MongoDBAdapter(clientPromise),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    callbacks: {
        session: async ({ session, token, user, newSession, trigger }) => {
            // Skip insertion when session is being invalidated
            if (trigger === 'signout' as string) {
                return Promise.resolve(session);
            }

            if (session.user) {
                const client = await clientPromise;
                const db = client.db();

                const existingUser = await db.collection('users').findOne({ email: user.email });

                // Modify the user object by adding the role property, use existing role if it exists, otherwise set to 'user'
                const modifiedUser = {
                    ...user,
                    role: existingUser?.role || 'user',
                };

                if (existingUser) {
                    // User already exists, perform update
                    await db.collection('users').updateOne({ email: user.email }, { $set: modifiedUser });
                } else {
                    // User does not exist, perform insert
                    await db.collection('users').insertOne(modifiedUser);
                }

                session.user = modifiedUser;
            }

            return Promise.resolve(session);
        },
    }
}

export default NextAuth(authOptions)
