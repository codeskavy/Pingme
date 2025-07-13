const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    "https://chatting-website-eight.vercel.app", // ✅ Add this
    process.env.CLIENT_URL, // ✅ In case you use env vars too
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};

const CHATTU_TOKEN = "chattu-token";

export { corsOptions, CHATTU_TOKEN };
