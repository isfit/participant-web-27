import { Request, Response, NextFunction } from "express";
import Application from "../models/Application";



const submitApplication = async (req: Request, res: Response, next: NextFunction) => {
    try {
      
      const {
        fullName,
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
        tShirtSize,
        applyingAs,
        themePowerThoughts,
        countryPowerIssue,
        motivation,
        financialSupportReason,
        dependents,
        familyIncome,
        canParticipate,
        consentVisa,
        consentFlight,
        consentPersonalDetails,
        consentAttendance,
        consentMedia
      } = req.body;

      const studentCertificate = req.file?.buffer;
  
      const newApplication = new Application({
        fullName,
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
        tShirtSize,
        applyingAs,
        themePowerThoughts,
        countryPowerIssue,
        motivation,
        financialSupportReason,
        dependents,
        familyIncome,
        canParticipate,
        consentVisa,
        consentFlight,
        consentPersonalDetails,
        consentAttendance,
        consentMedia
      });
  
      await newApplication.save();
  
      res.status(201).json({ message: "Application submitted successfully", application: newApplication });
    } catch (error) {
      next(error);
    }
  };

  const getApplications = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const { startDate, endDate } = req.query;

      const dateFilter: any = {};
      if (startDate) {
        dateFilter.$gte = new Date(startDate as string);
      }
      if (endDate) {
        dateFilter.$lte = new Date(endDate as string);
      }

      const query = startDate || endDate ? { createdAt: dateFilter } : {};

      const applications = await Application.find(query);
  
      res.status(200).json(applications);
    } catch (error) {
      next(error);
    }
  }
  
export { submitApplication, getApplications };