import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"

const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    // callbacks: {
    //     async signIn(account, profile) {
    //         if (account.provider === "google") {
    //             return profile.email_verified && profile.email.endsWith("@std.stei.itb.ac.id")
    //         }
    //         return false
    //     },
    // },
}

export default NextAuth(authOptions)
