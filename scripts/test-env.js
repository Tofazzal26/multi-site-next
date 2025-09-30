import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(".env.local") });

console.log("🔍 Loaded MONGODB_URI =", process.env.MONGODB_URI);
