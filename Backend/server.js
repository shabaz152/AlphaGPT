import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRoutes from "./routes/chat.js";
import authRoutes from "./routes/auth.js";

const app = express();
const PORT = process.env.PORT || 2000;

const allowedOrigins = [
  "http://localhost:5173",
  "https://main.dc5b4rjixbysv.amplifyapp.com"
];

app.use(express.json());

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use("/api", chatRoutes);
app.use("/api/auth", authRoutes);   


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