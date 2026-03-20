import { createAuthClient } from "better-auth/react";
import { sentinelClient } from "@better-auth/infra/client";

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
  plugins: [sentinelClient()],
});
