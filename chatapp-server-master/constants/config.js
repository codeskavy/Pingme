// Token name used in cookies
const CHATTU_TOKEN = "chattu-token";

// CORS Configuration
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "http://localhost:4173",
    process.env.CLIENT_URL,
  ].filter(Boolean), // Remove undefined/null if CLIENT_URL is not set
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true, // Allows cookies and auth headers
};

export { corsOptions, CHATTU_TOKEN };
