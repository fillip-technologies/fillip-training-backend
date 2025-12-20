// import Certificate from "../models/certificate.model.js"

// const autoGenerateCertificate = async(userId, courseId) => {
//     try {
//         const existingCertificate = await Certificate.findOne({userId, courseId})
//         if(existingCertificate)
//         {
//             return existingCertificate;
//         }
//         const certificateURL = `/api/certificates/download/${id}`;
//         const newCertificate = await Certificate.create({
//             userId,
//             courseId,
//             issueDate: new Date(),
//             certificateURL
//         });
//         return newCertificate
//     } catch (error) {
//         console.log("Auto Certificate Generation Error:", error)
//     }
// };
// export default autoGenerateCertificate;


import Certificate from "../models/certificate.model.js";
import NewEnrollment from "../models/newEnrollment.model.js";

const autoGenerateCertificate = async (enrollmentId) => {
    try {
        const enrollment = await NewEnrollment.findOne({ id: enrollmentId });

        if (!enrollment) {
            throw new Error("Enrollment not found");
        }

        if (enrollment.enrollmentStatus !== "Enrolled") {
            throw new Error("Enrollment not done");
        }

        const existingCertificate = await Certificate.findOne({
            name: enrollment.name,
            course: enrollment.course
        });

        if (existingCertificate) {
            return existingCertificate;
        }

        const certificate = await Certificate.create({
            name: enrollment.name,
            course: enrollment.course,
            issueDate: new Date(),
        });
        await certificate.save();

        return certificate;

    } catch (error) {
        console.error("Auto Certificate Generation Error:", error.message);
        throw error;
    }
};

export default autoGenerateCertificate;
