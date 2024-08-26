export interface User {
    _id: string;
    fullName: string;
    email: string;
    password: string;
    country: string;
    address: string;
    dateBirth: string;
    phone: string;
    role: string;
    createdAt: string;
}

export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

export interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    authTokens: AuthTokens | null;
}

export interface IApplicationForm {
    _id?: string;
    fullName: string;
    dateOfBirth: string;
    gender: string;
    nationality: string;
    continent: string;
    residenceCountry: string;
    isStudent: boolean;
    studyField: string;
    university: string;
    universityWebsite?: string;
    studentCertificate?: File;
    isEnglishSpeaker: boolean;
    tShirtSize: string;
    applyingAs: string;
    themePowerThoughts: string;
    countryPowerIssue: string;
    motivation: string;
    financialSupportReason: string;
    fullOrPartialFunding: string;
    dependents: number;
    familyIncome: string;
    canParticipate: string;
    countryTravelingFrom: string;
    otherFundingInfo: string;
    consentVisa: boolean;
    consentFlight: boolean;
    consentNorwegianLaw: boolean;
    consentReturn: boolean;
    consentPersonalDetails: boolean;
    consentAttendance: boolean;
    consentMedia: boolean;
    createdAt?: string;
  }