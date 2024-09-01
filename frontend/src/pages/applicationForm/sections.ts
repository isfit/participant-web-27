import { IApplicationForm } from "../../types/types";
import { nationalities, nations } from "./nationality";

export const personalDetails: Array<{
    label: string;
    name: keyof IApplicationForm;
    type: string;
    options?: string[];
    placeholder?: string;
    required?: boolean;
  }> = [
    {
      label: 'Full Name',
      name: 'fullName',
      type: 'text',
      placeholder: 'John Doe',
      required: true,
    },
    {
      label: 'Date of Birth',
      name: 'dateOfBirth',
      type: 'date',
      placeholder: 'YYYY-MM-DD',
      required: true,
    },
    {
      label: 'Gender',
      name: 'gender',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
      required: true,
    },
    {
      label: 'Nationality',
      name: 'nationality',
      type: 'select',
      options: nationalities,
      required: true,
    },
    {
      label: 'Continent of Nationality',
      name: 'continent',
      type: 'text',
      placeholder: 'ex: Europe',
      required: true,
    },
    {
      label: 'Country of Residence',
      name: 'residenceCountry',
      type: 'select',
      options: nations,
      required: true,
    },
    {
      label:
        'By checking this box, I confirm I am a student throughout the academic year 2024-2025',
      name: 'isStudent',
      type: 'checkbox',
      required: true,
    },
    {
      label: 'What do you study?',
      name: 'studyField',
      type: 'text',
      placeholder: 'ex. Infomatics',
      required: true,
    },
    {
      label: 'Name of your University/Institute',
      name: 'university',
      type: 'text',
      placeholder: 'ex. Norwegian University of Science and Technology',
      required: true,
    },
    {
      label: 'Your University/Institute website address (optional)',
      name: 'universityWebsite',
      type: 'text',
      placeholder: 'ex. https://youruniversity.edu',
    },
    {
      label: 'Please upload your student certificate as a PDF',
      name: 'studentCertificate',
      type: 'file',
      required: true,
    },
    {
      label:
        'By checking this box, I confirm I am able to communicate in English',
      name: 'isEnglishSpeaker',
      type: 'checkbox',
      required: true,
    },
    {
      label: 'What is your T-Shirt size?',
      name: 'tShirtSize',
      type: 'select',
      options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'],
      required: true,
    },
    {
      label: 'I am applying as',
      name: 'applyingAs',
      type: 'select',
      options: [
        'Regular participant',
        'SOrCE',
        'Coastal Carolina University',
        'Dialogue Project',
      ],
      required: true,
    },
  ];

  export const themeSection: Array<{
    label: string;
    name: keyof IApplicationForm;
    type: string;
    placeholder?: string;
    required?: boolean;
  }> = [
    {
      label:
        "When considering the theme of 'POWER' for ISFiT25, what aspects or dimensions of power come to your mind first?",
      name: 'themePowerThoughts',
      type: 'textarea',
      placeholder: 'When I think of power I think of ...',
      required: true,
    },
    {
      label:
        "Reflecting on your country's context, can you identify a specific power issue? How does this issue manifest, and what are its consequences?",
      name: 'countryPowerIssue',
      type: 'textarea',
      placeholder:
        "When reflecting on my country's context, an issue regarding power is ...",
      required: true,
    },
    {
      label:
        'What is your motivation for attending ISFiT25? How do you envision contributing to discussions and activities surrounding this theme during the festival?',
      name: 'motivation',
      type: 'textarea',
      placeholder: 'My motivation for attending ISFiT25 is ...',
      required: true,
    },
  ];

  export const financialSupportSection: Array<{
    label: string;
    name: keyof IApplicationForm;
    type: string;
    options?: string[];
    placeholder?: string;
    required?: boolean;
  }> = [
    {
      label:
        'Some of the participants get financial support for their trip to participate in ISFiT25. Why do you think that you should be considered for this financial support?',
      name: 'financialSupportReason',
      type: 'textarea',
      placeholder:
        'I should be considered to get financial support because ...',
    },
    {
      label: 'How many dependents do you have?',
      name: 'dependents',
      type: 'number',
      placeholder: 'Number of dependents',
    },
    {
      label: 'What is your family´s monthly income?',
      name: 'familyIncome',
      type: 'text',
      placeholder: 'Your family income',
    },
    {
      label: 'I can participate in ISFiT25',
      name: 'canParticipate',
      type: 'select',
      options: [
        'without any financial support',
        'if I get partial financial support',
        'if I get full financial support',
      ],
    },
  ];

  export const consentSection: Array<{
    label: string;
    name: keyof IApplicationForm;
    type: string;
    placeholder?: string;
    required?: boolean;
  }> = [
    {
      label: 'I have to apply for a visa if I get accepted as a participant',
      name: 'consentVisa',
      type: 'checkbox',
      required: true,
    },
    {
      label:
        'I am aware that I have to book a flight to Norway on my own even if I get financial support',
      name: 'consentFlight',
      type: 'checkbox',
      required: true,
    },
    {
      label:
        'I agree that ISFiT can keep my personal details to be used later in the festival',
      name: 'consentPersonalDetails',
      type: 'checkbox',
      required: true,
    },
    {
      label:
        'I am aware that a participation certificate will be given only if I attend all days of the workshop and mandatory events',
      name: 'consentAttendance',
      type: 'checkbox',
      required: true,
    },
    {
      label:
        'I agree that ISFiT can share pictures and videos of me taken during the festival on social media',
      name: 'consentMedia',
      type: 'checkbox',
      required: true,
    },
  ];