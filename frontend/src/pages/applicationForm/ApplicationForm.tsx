import React, { useState, useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ApplicationForm.css';

const steps = [
  'Personal Details',
  'Theme',
  'Workshop',
  'Financial Support',
  'Consent',
];

interface FormValues {
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
  firstPriority: string;
  firstPriorityReason: string;
  secondPriority?: string;
  secondPriorityReason?: string;
  thirdPriority?: string;
  thirdPriorityReason?: string;
  workshopMandatory: boolean;
  financialSupportReason: string;
  dependents: number;
  familyIncome: string;
  canParticipate: string;
  consentVisa: boolean;
  consentFlight: boolean;
  consentPersonalDetails: boolean;
  consentAttendance: boolean;
  consentMedia: boolean;
}

const ApplicationForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>(() => {
    const savedForm = localStorage.getItem('applicationForm');
    return savedForm
      ? JSON.parse(savedForm)
      : {
          fullName: '',
          dateOfBirth: '',
          gender: '',
          nationality: '',
          continent: '',
          residenceCountry: '',
          isStudent: false,
          studyField: '',
          university: '',
          universityWebsite: '',
          studentCertificate: undefined,
          isEnglishSpeaker: false,
          tShirtSize: '',
          applyingAs: '',
          themePowerThoughts: '',
          countryPowerIssue: '',
          motivation: '',
          firstPriority: '',
          firstPriorityReason: '',
          secondPriority: '',
          secondPriorityReason: '',
          thirdPriority: '',
          thirdPriorityReason: '',
          workshopMandatory: false,
          financialSupportReason: '',
          dependents: 0,
          familyIncome: '',
          canParticipate: '',
          consentVisa: false,
          consentFlight: false,
          consentPersonalDetails: false,
          consentAttendance: false,
          consentMedia: false,
        };
  });

  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);

  useEffect(() => {
    localStorage.setItem('applicationForm', JSON.stringify(formValues));
  }, [formValues]);

  useEffect(() => {
    if (!visitedSteps.includes(currentStep)) {
      setVisitedSteps([...visitedSteps, currentStep]);
    }
  }, [currentStep, visitedSteps]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    const isCheckbox =
      e.target instanceof HTMLInputElement && e.target.type === 'checkbox';
    setFormValues((prevState) => ({
      ...prevState,
      [name]: isCheckbox ? e.target.checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    setFormValues((prevState) => ({
      ...prevState,
      [name]: file || undefined,
    }));
  };

  const validateStep = () => {
    const currentFields = getCurrentFields();
    const stepErrors: string[] = [];

    currentFields.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        stepErrors.push(field.label);
      }
    });

    return stepErrors.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (index: number) => {
    if (visitedSteps.includes(index)) {
      setCurrentStep(index);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateStep()) {
      console.log('Form submitted:', formValues);
      localStorage.removeItem('applicationForm');
    }
  };

  const renderInput = ({
    label,
    name,
    type,
    options,
    placeholder,
    required,
  }: {
    label: string;
    name: keyof FormValues;
    type: string;
    options?: string[];
    placeholder?: string;
    required?: boolean;
  }) => {
    if (type === 'textarea') {
      return (
        <label key={name} className="formSection">
          <p>{label}</p>
          <textarea
            name={name}
            value={formValues[name] as string}
            onChange={handleChange}
            className="formInput"
            required={required}
            placeholder={placeholder}
          />
        </label>
      );
    }
    if (type === 'file') {
      return (
        <label key={name} className="formSection">
          <p>{label}</p>
          <input
            type="file"
            name={name}
            onChange={handleFileChange}
            className="formInput"
            required={required}
          />
        </label>
      );
    }
    if (type === 'select') {
      return (
        <label key={name} className="formSection">
          <p>{label}</p>
          <select
            name={name}
            value={formValues[name] as string}
            onChange={handleChange}
            className="formInput"
            required={required}
          >
            <option value="" disabled>
              Select an option
            </option>
            {options?.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      );
    }
    if (type === 'checkbox') {
      return (
        <label key={name} className="formSection">
          <div className="checkboxContainer">
            <input
              type={type}
              name={name}
              checked={Boolean(formValues[name])}
              onChange={handleChange}
              className="checkboxInput"
              required={required}
            />
            <span className="checkboxLabel">{label}</span>
          </div>
        </label>
      );
    }
    return (
      <label key={name} className="formSection">
        <p>{label}</p>
        <input
          type={type}
          name={name}
          value={formValues[name] as string | number | undefined}
          onChange={handleChange}
          className="formInput"
          required={required}
          placeholder={placeholder}
        />
      </label>
    );
  };

  const getCurrentFields = () => {
    switch (currentStep) {
      case 0:
        return personalDetails;
      case 1:
        return themeSection;
      case 2:
        return workshopSection;
      case 3:
        return financialSupportSection;
      case 4:
        return consentSection;
      default:
        return [];
    }
  };

  const personalDetails = [
    { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe', required: true },
    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', placeholder: 'YYYY-MM-DD', required: true },
    { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
    { label: 'Nationality', name: 'nationality', type: 'text', placeholder: 'ex. Norwegian', required: true },
    { label: 'Continent of Nationality', name: 'continent', type: 'text', placeholder: 'ex. Europe', required: true },
    { label: 'Country of Residence', name: 'residenceCountry', type: 'text', placeholder: 'ex. Norway', required: true },
    { label: 'By checking this box, I confirm I am a student throughout the academic year 2024-2025', name: 'isStudent', type: 'checkbox', required: true },
    { label: 'What do you study?', name: 'studyField', type: 'text', placeholder: 'ex. Infomatics', required: true },
    { label: 'Name of your University/Institute', name: 'university', type: 'text', placeholder: 'ex. Norwegian University of Science and Technology', required: true },
    { label: 'Your University/Institute website address (optional)', name: 'universityWebsite', type: 'text', placeholder: 'ex. https://youruniversity.edu' },
    { label: 'Please upload your student certificate', name: 'studentCertificate', type: 'file', required: true },
    { label: 'By checking this box, I confirm I am able to communicate in English', name: 'isEnglishSpeaker', type: 'checkbox', required: true },
    { label: 'What is your T-Shirt size?', name: 'tShirtSize', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'], required: true },
    { label: 'I am applying as', name: 'applyingAs', type: 'select', options: ['Regular participant', 'SOrCE', 'Coastal Carolina University', 'Dialogue Project'], required: true },
  ];

  const themeSection = [
    { label: "When considering the theme of 'POWER' for ISFiT25, what aspects or dimensions of power come to your mind first?", name: 'themePowerThoughts', type: 'textarea', placeholder: 'When I think of power I think of ...', required: true },
    { label: "Reflecting on your country's context, can you identify a specific power issue? How does this issue manifest, and what are its consequences?", name: 'countryPowerIssue', type: 'textarea', placeholder: 'When reflecting on my country\'s context, an issue regarding power is ...', required: true },
    { label: 'What is your motivation for attending ISFiT25? How do you envision contributing to discussions and activities surrounding this theme during the festival?', name: 'motivation', type: 'textarea', placeholder: 'My motivation for attending ISFiT25 is ...', required: true },
  ];

  const workshopSection = [
    { label: 'Select your first priority', name: 'firstPriority', type: 'text', placeholder: 'Your first priority', required: true },
    { label: 'Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Polarization.', name: 'firstPriorityReason', type: 'textarea', placeholder: 'I want to attend this workshop because ...', required: true },
    { label: 'Select your second priority (optional)', name: 'secondPriority', type: 'text', placeholder: 'Your second priority', required: true },
    { label: 'Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Power. (optional)', name: 'secondPriorityReason', type: 'textarea', placeholder: 'I want to attend this workshop because ...' },
    { label: 'Select your third priority (optional)', name: 'thirdPriority', type: 'text', placeholder: 'Your third priority', required: true },
    { label: 'Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Power. (optional)', name: 'thirdPriorityReason', type: 'textarea', placeholder: 'I want to attend this workshop because ...' },
    { label: 'By checking this box, I confirm I am aware it is mandatory to participate in the given workshop even if I don´t get any of my priorities', name: 'workshopMandatory', type: 'checkbox', required: true },
  ];

  const financialSupportSection = [
    { label: 'Some of the participants get financial support for their trip to participate in ISFiT25. Why do you think that you should be considered for this financial support?', name: 'financialSupportReason', type: 'textarea', placeholder: 'I should be considered to get financial support because ...' },
    { label: 'How many dependents do you have?', name: 'dependents', type: 'number', placeholder: 'Number of dependents' },
    { label: 'What is your family´s monthly income?', name: 'familyIncome', type: 'text', placeholder: 'Your family income' },
    { label: 'I can participate in ISFiT25', name: 'canParticipate', type: 'select', options: ['without any financial support', 'if I get partial financial support', 'if I get full financial support'] },
  ];

  const consentSection = [
    { label: 'I have to apply for a visa if I get accepted as a participant', name: 'consentVisa', type: 'checkbox', required: true },
    { label: 'I am aware that I have to book a flight to Norway on my own even if I get financial support', name: 'consentFlight', type: 'checkbox', required: true },
    { label: 'I agree that ISFiT can keep my personal details to be used later in the festival', name: 'consentPersonalDetails', type: 'checkbox', required: true },
    { label: 'I am aware that a participation certificate will be given only if I attend all days of the workshop and mandatory events', name: 'consentAttendance', type: 'checkbox', required: true },
    { label: 'I agree that ISFiT can share pictures and videos of me taken during the festival on social media', name: 'consentMedia', type: 'checkbox', required: true },
  ];

  const renderStep = () => {
    return getCurrentFields().map(renderInput);
  };

  return (
    <div>
      <div className="topRight">
        <Link to="/login" style={{ color: 'white' }}>
          <Button>Login</Button>
        </Link>
        <Link to="/profilePage" style={{ color: 'white' }}>
          <Button>My profile</Button>
        </Link>
      </div>
      <Header linkTo="/homepage" />
      
      <div className="outerContainer">
        <h1 className="applicationSectionHeader">Application Form</h1>
        <p>
          Hey! Awesome that you want to apply for ISFiT 2025, please fill out
          all required fields.
        </p>
      </div>

      <div className="progressOverview">
        {steps.map((step, index) => (
          <span key={index}>
            <span
              className={`progressStep ${index === currentStep ? 'currentStep' : ''} ${
                visitedSteps.includes(index) ? 'clickableStep' : ''
              }`}
              onClick={() => handleStepClick(index)}
            >
              {step}
            </span>
            {index < steps.length - 1 && <span className="separator"> &gt; </span>}
          </span>
        ))}
      </div>

      <form className="applicationForm" onSubmit={handleSubmit}>
        <div id="applicationContainer">
          <div className="outerContainer">
            <h1 className="applicationSectionHeader">{steps[currentStep]}</h1>
            {renderStep()}
          </div>
        </div>
        <div className="navigationButtons">
          {currentStep > 0 && (
            <Button onClick={handlePrevious}>Previous</Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button onClick={handleNext}>Next</Button>
          ) : (
            <Button type="submit">Submit</Button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ApplicationForm;
