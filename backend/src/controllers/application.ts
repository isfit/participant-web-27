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
        studentCertificate,
        isEnglishSpeaker,
        tShirtSize,
        applyingAs,
        themePowerThoughts,
        countryPowerIssue,
        motivation,
        firstPriority,
        firstPriorityReason,
        secondPriority,
        secondPriorityReason,
        thirdPriority,
        thirdPriorityReason,
        workshopMandatory,
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
        firstPriority,
        firstPriorityReason,
        secondPriority,
        secondPriorityReason,
        thirdPriority,
        thirdPriorityReason,
        workshopMandatory,
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
  
  export default submitApplication;