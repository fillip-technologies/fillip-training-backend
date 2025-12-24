import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import cookieParser from "cookie-parser";
import connectDB from "./db.js";

import authRoutes from "./routes/auth.route.js";
import instructorRoutes from "./routes/instructor.route.js";
import studentRoutes from "./routes/student.route.js";
import courseRoutes from "./routes/course.route.js";
import batchRoutes from "./routes/batch.route.js";
import classRoutes from "./routes/class.route.js";
import attendanceRoutes from "./routes/attendance.route.js";
import enquiryRoutes from "./routes/enquiry.route.js";
import enrollmentRoutes from "./routes/enrollment.route.js";
import certificateRoutes from "./routes/certificate.route.js";
import courseCategoryRoutes from "./routes/courseCategory.route.js";
import newEnrollmentRoutes from "./routes/newEnrollment.route.js";
import contactRoutes from "./routes/contact.route.js";
import emailRoutes from "./routes/email.route.js";
// import assignmentRoutes from "./routes/assignment.route.js";
// import marksheetRoutes from "./routes/marksheet.route.js";

const app = express();
dotenv.config();

const isDevelopment = process.env.NODE_ENV !== "production";
const corsOptions = {
  origin: function (origin, callback) {
     if (isDevelopment) {
      return callback(null, true);
    }
    const allowedOrigins = [
      "http://localhost:5173",
      "https://nextindia-training.fillipsoftware.com"
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 3000
connectDB()

app.use("/api/auth", authRoutes);
app.use("/api/instructor", instructorRoutes);
app.use("/api/student", studentRoutes);
app.use("/api/course-category", courseCategoryRoutes);
app.use("/api/course", courseRoutes);
app.use("/api/batch", batchRoutes);
app.use("/api/class", classRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/newEnrollment", newEnrollmentRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/email", emailRoutes);

// app.use("/api/assignment", assignmentRoutes);
// app.use("/api/marksheet", marksheetRoutes);


app.listen(PORT, () => 
    console.log(`Server is running on ${PORT}`)
)
