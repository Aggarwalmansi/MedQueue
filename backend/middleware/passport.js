const passport = require("passport")
const GoogleStrategy = require("passport-google-oauth20").Strategy
const { PrismaClient } = require("@prisma/client")
const bcrypt = require("bcryptjs")

const prisma = new PrismaClient()

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.BACKEND_URL || 'http://localhost:5001'}/api/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id
        const email = profile.emails?.[0]?.value?.toLowerCase()
        const fullName = profile.displayName || profile.name?.givenName || "Google User"

        if (!email) {
          return done(null, false, { message: "Google account has no email" })
        }

        let user = await prisma.user.findUnique({
          where: { googleId },
        })

        if (!user) {
          const existingEmailUser = await prisma.user.findUnique({
            where: { email },
          })

          if (existingEmailUser) {
            user = await prisma.user.update({
              where: { id: existingEmailUser.id },
              data: {
                googleId,
              },
            })
          } else {
            const randomPassword = Math.random().toString(36).slice(-12)
            const hashedPassword = await bcrypt.hash(randomPassword, 10)

            user = await prisma.user.create({
              data: {
                email,
                fullName,
                googleId,
                password: hashedPassword,
                role: "PATIENT", // Default to Patient
              },
            })
          }
        }

        return done(null, user)
      } catch (err) {
        console.error("Google strategy error:", err)
        return done(err, null)
      }
    }
  )
)

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } })
    done(null, user)
  } catch (err) {
    done(err, null)
  }
})

module.exports = passport
