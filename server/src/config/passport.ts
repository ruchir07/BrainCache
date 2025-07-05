import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import user from "../model/user";
import dotenv from "dotenv";

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "/https://braincache-backend.onrender.com/api/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const existingUser = await user.findOne({ googleId: profile.id });
        if (existingUser) {
            return done(null, existingUser);
        }
        const newUser = new user({
            googleId: profile.id,
            name: profile.displayName,
            email: profile.emails?.[0].value || "",
        });

        await newUser.save();
        return done(null, newUser);
    } catch (error) {
        return done(error, undefined);
    }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => user.findById(id).then(user => done(null, user)));
