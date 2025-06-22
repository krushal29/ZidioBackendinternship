import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import userDetails from "../models/UserModel.js";
import dotenv from 'dotenv';
dotenv.config();

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BACKEND_URl}/api/user/google/callback`
  },
  async (accessToken, refreshToken, profile, done) => {
    const email = profile.emails?.[0]?.value;
    const name = profile.displayName;

    let user = await userDetails.findOne({ email });

    if (!user) {
      user = await userDetails.create({
        Name: name,
        email,
        Password: "google-auth",
        role: "user",
        isLogin: true,
      });
    }

    return done(null, user);
  }
));


passport.use(new GitHubStrategy({
  clientID: process.env.GITHUB_CLIENT_ID,
  clientSecret: process.env.GITHUB_CLIENT_SECRET,
  callbackURL: `${process.env.BACKEND_URl}/api/user/github/callback`,
  scope: ['user:email']
}, async (accessToken, refreshToken, profile, done) => {
//   const email = profile.emails?.[0]?.value || `${profile.username}@github.com`;
  const email = profile.emails[0].value;
  const name = profile.displayName || profile.username || "GitHub User";

  const existingUser = await userDetails.findOne({ email });
  if (existingUser) return done(null, existingUser);

  const newUser = await userDetails.create({
    Name: name,
    email,
    Password: "github-auth",
    role: "user",
    isLogin: true,
  });

  return done(null, newUser);
}));

