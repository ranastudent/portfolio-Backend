import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import prisma from "../utils/prisma";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check if user exists
        let user = await prisma.user.findUnique({
          where: { email: profile.emails?.[0].value },
        });

        if (!user) {
          // create new user
          user = await prisma.user.create({
            data: {
              name: profile.displayName,
              email: profile.emails?.[0].value!,
              password: "", // not used for Google users
              role: "USER",
            },
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null as any);
      }
    }
  )
);

export default passport;
