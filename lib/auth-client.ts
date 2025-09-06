import {createAuthClient}  from "better-auth/react";

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL!,
  user: {
    additionalFields: {
      role: {
        type: "string",
        default: "user",
      },
    },
  },
});
