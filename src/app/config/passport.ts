import bcrypt from "bcryptjs";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as LocalStrategy } from "passport-local";
import { envVars } from "./env";
import User from "../modules/user/user.model";
import { AuthProvider } from "../modules/user/user.interface";

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }

        const isGoogleAuthenticated = user.auths.some(
          (auth) => auth.provider === AuthProvider.GOOGLE
        );
        if (isGoogleAuthenticated && !user.password) {
          return done(null, false, {
            message:
              "User already authenticated with Google. If you want to login with credentials then login with Google and set a password.",
          });
        }

        //TODO:--> check if user loggedin with Facebook or other auth provider

        const isPasswordMatch = await bcrypt.compare(
          password,
          user.password as string
        );

        if (!isPasswordMatch) {
          return done(null, false, { message: "Invalid password" });
        }

        if (user.isDeleted) {
          return done(null, false, { message: "User is deleted" });
        }

        if (user.isBlocked) {
          return done(null, false, { message: "User is blocked" });
        }

        if (!user.isVerified) {
          return done(null, false, { message: "User is not verified" });
        }

        user.lastLogin = new Date();
        await user.save();

        return done(null, user, { message: "User logged in successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: envVars.GOOGLE_CLIENT_ID,
      clientSecret: envVars.GOOGLE_CLIENT_SECRET,
      callbackURL: envVars.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0].value;
        if (!email) {
          return done(null, false, { message: "Email not found" });
        }

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            email,
            name: profile.displayName || profile.name?.givenName,
            picture: profile.photos?.[0].value,
            isVerified: true,
            auths: [
              {
                provider: AuthProvider.GOOGLE,
                providerId: profile.id,
              },
            ],
            lastLogin: new Date(),
          });
        }
        if (!user.auths.find((auth) => auth.provider === AuthProvider.GOOGLE)) {
          user.picture = profile.photos?.[0].value;
          user.auths.push({
            provider: AuthProvider.GOOGLE,
            providerId: profile.id,
          });
          await user.save();
        }
        return done(null, user, { message: "User logged in successfully" });
      } catch (error) {
        return done(error);
      }
    }
  )
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});
