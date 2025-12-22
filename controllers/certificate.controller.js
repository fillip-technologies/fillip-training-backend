import PDFDocument from "pdfkit";
import Certificate from "../models/certificate.model.js";
import NewEnrollment from "../models/newEnrollment.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js"

// export const downloadCertificate = async(req, res) => {
//     try {
//         const {id} = req.params;
//         const certificate = await Certificate.findOne({id});
//         if(!certificate)
//         {
//             return res.status(404).json({
//                message: "Certificate Not Found",
//                success: false 
//             })
//         }
//         const user = await User.findOne({id: certificate.userId})
//         if(!user)
//         {
//             return res.status(404).json({
//                 message: "User Not Found",
//                 success: false,
//             })
//         }

//         const course = await Course.findOne({id: certificate.courseId})
//         if(!course)
//         {
//             return res.status(404).json({
//                 message: "Course Not Found",
//                 success: false
//             })
//         }

//         const doc = new PDFDocument();
        
//         res.setHeader("content-Type", "application/pdf");
//         res.setHeader(
//             "Content-Disposition",
//             `attachment; filename=${id}.pdf`
//         )

//         doc.pipe(res);

//         doc.fontSize(28).text("Certificate of Completion", { align: "center" });
//         doc.moveDown(2);

//         doc.fontSize(18).text("This is to certify that", { align: "center" });
//         doc.moveDown(1);

//         doc.fontSize(25).text(user.fullName, { align: "center", underline: true });
//         doc.moveDown(2);

//         doc.fontSize(16).text(
//         `has successfully completed the course "${course.courseName}".`,
//         { align: "center" }
//         );

//         doc.moveDown(3);
//         doc.fontSize(12).text(`Certificate ID: ${cert.id}`, { align: "center" });
//         doc.fontSize(12).text(`Issue Date: ${cert.issueDate.toDateString()}`, {
//         align: "center",
//         });

//         doc.end() 
//     } catch (error) {
//         return res.status(500).json({
//             message: "Internal server error",
//             success: false,
//             error: error.message,
//         })
        
//     }
// }

export const downloadCertificate = async (req, res) => {
    try {
        const { id } = req.params;

        const certificate = await Certificate.findOne({ id });
        if (!certificate) {
            return res.status(404).json({
                message: "Certificate Not Found",
                success: false
            });
        }

        const enrollment = await NewEnrollment.findOne({
            name: certificate.name,
            course: certificate.course
        });

        if (!enrollment) {
            return res.status(404).json({
                message: "Enrollment Not Found",
                success: false
            });
        }

        const doc = new PDFDocument();

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename=${id}.pdf`
        );

        doc.pipe(res);

        doc.fontSize(28).text("Certificate of Completion", { align: "center" });
        doc.moveDown(2);

        doc.fontSize(18).text("This is to certify that", { align: "center" });
        doc.moveDown(1);

        doc.fontSize(25).text(
            enrollment.name,
            { align: "center", underline: true }
        );

        doc.moveDown(2);

        doc.fontSize(16).text(
            `has successfully completed the course "${enrollment.course}".`,
            { align: "center" }
        );

        doc.moveDown(3);
        doc.fontSize(12).text(`Certificate ID: ${certificate.id}`, { align: "center" });
        doc.fontSize(12).text(
            `Issue Date: ${certificate.issueDate.toDateString()}`,
            { align: "center" }
        );

        doc.end();

    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};


// import puppeteer from "puppeteer";
// import fs from "fs";
// import path from "path";
// import Certificate from "../models/certificate.model.js";
// import NewEnrollment from "../models/newEnrollment.model.js";

// export const downloadCertificate = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const certificate = await Certificate.findOne({ id });
//     if (!certificate) {
//       return res.status(404).json({ message: "Certificate Not Found" });
//     }

//     const enrollment = await NewEnrollment.findOne({
//       name: certificate.name,
//       course: certificate.course,
//     });

//     if (!enrollment) {
//       return res.status(404).json({ message: "Enrollment Not Found" });
//     }

//     let html = fs.readFileSync(
//       path.join(process.cwd(), "certificate.html"),
//       "utf8"
//     );
//     html = html
//       .replace("{{name}}", enrollment.name)
//       .replace("{{course}}", enrollment.course)
//       .replace("{{description}}", certificate.description || "")
//       .replace("{{certificateId}}", certificate.id)
//       .replace(
//         "{{issueDate}}",
//         new Date(certificate.issueDate).toDateString()
//       );

//     const browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();
//     await page.setContent(html, { waitUntil: "networkidle0" });

//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       printBackground: true,
//       landscape: true,
//     });

//     await browser.close();

//     res.set({
//       "Content-Type": "application/pdf",
//       "Content-Disposition": `attachment; filename=${id}.pdf`,
//     });

//     res.send(pdfBuffer);

//   } catch (error) {
//     res.status(500).json({
//       message: "Internal Server Error",
//       error: error.message,
//     });
//   }
// };
