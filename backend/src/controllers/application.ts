import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";

const submitApplication = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const {
            fullName,
            email,
            phoneNumber,
            dateOfBirth,
            gender,
            nationality,
            continent,
            residenceCountry,
            isStudent,
            studyField,
            university,
            universityWebsite,
            isEnglishSpeaker,
            applyingAs,
            themePowerThoughts,
            countryPowerIssue,
            motivation,
            financialSupportReason,
            fullOrPartialFunding,
            dependents,
            familyIncome,
            canParticipate,
            countryTravelingFrom,
            otherFundingInfo,
            consentVisa,
            consentFlight,
            consentNorwegianLaw,
            consentReturn,
            consentPersonalDetails,
            consentAttendance,
            consentMedia,
        } = req.body;

        const studentCertificate = req.file?.buffer;

        const newApplication = new Application({
            fullName,
            email,
            phoneNumber,
            dateOfBirth,
            gender,
            nationality,
            continent,
            residenceCountry,
            isStudent,
            studyField,
            university,
            universityWebsite,
            studentCertificate,
            isEnglishSpeaker,
            applyingAs,
            themePowerThoughts,
            countryPowerIssue,
            motivation,
            financialSupportReason,
            fullOrPartialFunding,
            dependents,
            familyIncome,
            canParticipate,
            countryTravelingFrom,
            otherFundingInfo,
            consentVisa,
            consentFlight,
            consentNorwegianLaw,
            consentReturn,
            consentPersonalDetails,
            consentAttendance,
            consentMedia,
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

const getApplications = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { startDate, endDate } = req.query;
  
      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate as string);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate as string);
        let adjustedEndDate = new Date(endDate as string);
        adjustedEndDate.setHours(23, 59, 59, 999);
        dateFilter.$lte = adjustedEndDate;
      }
  
      const query = startDate || endDate ? { createdAt: dateFilter } : {};
  
      // Exclude the `studentCertificate` field from the query response
      const applications = await Application.find(query, '-studentCertificate');
  
      res.status(200).json(applications);
    } catch (error) {
      next(error);
    }
  };
  

const downloadCertificate = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
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
