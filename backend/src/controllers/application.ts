import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";
import { BlobServiceClient } from "@azure/storage-blob";

// Controller to handle submitting an application
const submitApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const AZURE_STORAGE_CONNECTION_STRING = process.env.AZURE_STORAGE_CONNECTION_STRING;
        const AZURE_STORAGE_DOWNLOAD_STRING = process.env.AZURE_STORAGE_DOWNLOAD_STRING;

        const {
            fullName, email, phoneNumber, dateOfBirth, gender, nationality, continent,
            residenceCountry, isStudent, studyField, university, universityWebsite,
            isEnglishSpeaker, applyingAs, themePowerThoughts, countryPowerIssue,
            motivation, financialSupportReason, fullOrPartialFunding, dependents, familyIncome,
            canParticipate, countryTravelingFrom, otherFundingInfo, consentVisa,
            consentFlight, consentNorwegianLaw, consentReturn, consentPersonalDetails,
            consentAttendance, consentMedia,
        } = req.body;

        const studentCertificate = req.file?.buffer;

        // Upload Certificate to Azure Blob Storage and set the URL in the application
        let studentCertificateUrl: string | undefined;
        if (studentCertificate) {
            if (!AZURE_STORAGE_CONNECTION_STRING) {
                throw Error("Azure Storage Connection string not found");
            }

            const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
            const containerClient = blobServiceClient.getContainerClient("studentcertificates");

            const blobName = `certificate_${email}.pdf`;
            const blockBlobClient = containerClient.getBlockBlobClient(blobName);
            const exists = await blockBlobClient.exists();
            if (exists) {
                await blockBlobClient.delete();  // Delete old certificate if it exists
            }
            await blockBlobClient.upload(studentCertificate, studentCertificate.length);

            // Get the URL of the uploaded blob
            const blobUrl = blockBlobClient.url;
            studentCertificateUrl = `${blobUrl}?${AZURE_STORAGE_DOWNLOAD_STRING}`;
        }

        const newApplication = new Application({
            fullName, email, phoneNumber, dateOfBirth, gender, nationality, continent,
            residenceCountry, isStudent, studyField, university, universityWebsite,
            studentCertificateUrl, // Save only the URL, not the actual certificate buffer
            isEnglishSpeaker, applyingAs, themePowerThoughts, countryPowerIssue,
            motivation, financialSupportReason, fullOrPartialFunding, dependents, familyIncome,
            canParticipate, countryTravelingFrom, otherFundingInfo, consentVisa,
            consentFlight, consentNorwegianLaw, consentReturn, consentPersonalDetails,
            consentAttendance, consentMedia,
        });

        await newApplication.save();

        res.status(201).json({
            message: "Application submitted successfully",
            application: newApplication,
        });
    } catch (error) {
        next(error);
    }
};

// Controller to handle fetching applications with pagination and filtering
const getApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { startDate, endDate, page = 1, limit = 50 } = req.query;

        const dateFilter: any = {};
        if (startDate) {
            dateFilter.$gte = new Date(startDate as string);
        }
        if (endDate) {
            let adjustedEndDate = new Date(endDate as string);
            adjustedEndDate.setHours(23, 59, 59, 999);
            dateFilter.$lte = adjustedEndDate;
        }

        const matchStage = startDate || endDate ? { createdAt: dateFilter } : {};
        const skip = (Number(page) - 1) * Number(limit); // Pagination logic

        // Aggregation pipeline to group by fullName, email, and phoneNumber, and apply pagination
        const applications = await Application.aggregate([
            { $match: matchStage },
            {
                $group: {
                    _id: {
                        fullName: "$fullName",
                        email: "$email",
                        phoneNumber: "$phoneNumber",
                    },
                    doc: { $first: "$$ROOT" }, // Take the first document in each group
                },
            },
            { $replaceRoot: { newRoot: "$doc" } }, // Replace root to include only the original document
            { $project: { studentCertificate: 0, studentCertificateUrl: 0 } }, // Exclude sensitive fields
            { $skip: skip }, // Apply pagination
            { $limit: Number(limit) }, // Apply limit
        ]);

        res.status(200).json(applications);
    } catch (error) {
        next(error);
    }
};

// Controller to handle downloading student certificate by application ID
const downloadCertificate = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const application = await Application.findById(id);

        if (!application || !application.studentCertificate) {
            return res.status(404).json({ message: "File not found" });
        }

        const fileName = `certificate_${application.fullName.replace(/\s/g, "_").replace(/[^\x00-\x7F]/g, "")}.pdf`;

        res.setHeader(
            "Content-Disposition",
            `attachment; filename="${fileName}"`
        );
        res.setHeader("Content-Type", "application/pdf");
        res.send(application.studentCertificate);
    } catch (error) {
        next(error);
    }
};

export { submitApplication, getApplications, downloadCertificate };
