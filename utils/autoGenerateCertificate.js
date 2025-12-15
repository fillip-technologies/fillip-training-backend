import Certificate from "../models/certificate.model.js"

const autoGenerateCertificate = async(userId, courseId) => {
    try {
        const existingCertificate = await Certificate.findOne({userId, courseId})
        if(existingCertificate)
        {
            return existingCertificate;
        }
        const certificateURL = `/api/certificates/download/${id}`;
        const newCertificate = await Certificate.create({
            userId,
            courseId,
            issueDate: new Date(),
            certificateURL
        });
        return newCertificate
    } catch (error) {
        console.log("Auto Certificate Generation Error:", error)
    }
};
export default autoGenerateCertificate;