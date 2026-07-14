import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 2000;
app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully.");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

    } catch (error) {
       console.error("Database connection failed:");
       console.error(error);
    }
};

connectDB();


//       "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: "openai/gpt-oss-120b",
//       messages: [
//         {
//           role: "user",
//           content: req.body.message
//         }
//       ]
//     })
//   };

//   try {
//     const response = await fetch(
//       "https://api.groq.com/openai/v1/chat/completions",
//       options
//     );

//     const data = await response.json();
//     console.log(data.choices[0].message.content);
//     res.json(data.choices[0].message.content);

//   } catch (error) {
//     console.log(error);
//   }
// });