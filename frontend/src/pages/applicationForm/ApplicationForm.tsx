import React, { useState, useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import Header from '../../components/Header/Header';
import './ApplicationForm.css';
import { IApplicationForm } from '../../types/types';
import { apply } from '../../api/application';
import { Navigate } from 'react-router-dom';
import { getContinentFromNationality } from './nationality';
import { countryCodes } from './countryCodes.ts';
import {
  personalDetails,
  themeSection,
  financialSupportSection,
  consentSection,
} from './sections';
import checkErrorField from './checkErrorField';
import getSummary from '../../utils/summary.tsx';
import CustomToast from './toast';

const steps = [
  'Personal Details',
  'Theme',
  'Financial Support',
  'Consent',
  'Summary',
];

interface FormField {
  label: string;
  labelElement?: JSX.Element;
  name: keyof IApplicationForm;
  type: string;
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

const ApplicationForm: React.FC = () => {
  const [formValues, setFormValues] = useState<IApplicationForm>(() => {
    const savedForm = localStorage.getItem('applicationForm');
    return savedForm
      ? JSON.parse(savedForm)
      : {
          fullName: '',
          phoneNumber: '',
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
          applyingAs: '',
          themePowerThoughts: '',
          countryPowerIssue: '',
          motivation: '',
          financialSupportReason: '',
          fullOrPartialFunding: '',
          dependents: 0,
          familyIncome: '',
          countryTravelingFrom: '',
          otherFundingInfo: '',
          canParticipate: '',
          consentVisa: '',
          consentFlight: false,
          consentNorwegianLaw: false,
          consentReturn: false,
          consentPersonalDetails: false,
          consentAttendance: false,
          consentMedia: '',
        };
  });
  const [redirect, setRedirect] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<number[]>([0]);
  const [toastOpen, setToastOpen] = useState(false); // State for toast visibility
  const [toastMessage, setToastMessage] = useState(['']); // State for toast message
  const [toastTitle, setToastTitle] = useState(''); // State for toast title
  const [countryCode, setCountryCode] = useState(''); // Default country code
  let stepErrors: string[] = [];

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
    >,
  ) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';

    setFormValues((prevState) => {
      const updatedValues = {
        ...prevState,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      };

      // Update the continent field based on the selected nationality
      if (name === 'nationality') {
        const continent = getContinentFromNationality(value);
        updatedValues['continent'] = continent;
      }

      return updatedValues;
    });

    // Handling the "dependents" field
    if (name === 'dependents') {
      const numericValue = parseInt(value, 10);
      if (numericValue < 0) {
        setFormValues((prevState) => ({
          ...prevState,
          [name]: 0,
        }));
        return;
      }
    }

    // Updating text areas with word limit constraints
    if (type === 'textarea') {
      const wordCount = value.trim().split(/\s+/).length;
      if (
        ((name === 'themePowerThoughts' || name === 'otherFundingInfo') &&
          wordCount <= 100) ||
        ((name === 'countryPowerIssue' ||
          name === 'motivation' ||
          name === 'financialSupportReason') &&
          wordCount <= 300)
      ) {
        setFormValues((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      }
    } else {
      setFormValues((prevState) => ({
        ...prevState,
        [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value,
      }));
    }

    // Separate state update for nationality/continent logic
    if (name === 'nationality') {
      const continent = getContinentFromNationality(value);
      setFormValues((prevState) => ({
        ...prevState,
        continent,
      }));
    }

    console.log(name, value, type);
  };

  const handlePhoneNumberChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    if (name === 'countryCode') {
      setCountryCode(value);

      setFormValues((prevState) => ({
        ...prevState,
        phoneNumber: `${value}${prevState.phoneNumber.replace(countryCode, '')}`,
      }));
    }

    if (name === 'phoneNumber') {
      setFormValues((prevState) => ({
        ...prevState,
        phoneNumber: `${countryCode}${value.replace(countryCode, '')}`,
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    
    if (file) {
      if (!['application/pdf'].includes(file.type)) {
        alert('File must be a PDF.');
        e.target.value = '';
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5 MB limit
        alert('File size exceeds 5 MB');
        e.target.value = '';
        return;
      }
    }
  
    setFormValues((prevState) => ({
      ...prevState,
      [name]: file || undefined,
    }));
  };

  const validateStep = () => {
    const currentFields = getCurrentFields();
    stepErrors = [];

    currentFields.forEach((field) => {
      if (field.required && !formValues[field.name]) {
        stepErrors.push(field.label);
      }
    });

    console.log('Errors:', stepErrors);

    if (stepErrors.length > 0) {
      setToastTitle('Missing Required Fields');
      setToastMessage(stepErrors);
      setToastOpen(true); // Show the toast with the error message
      return stepErrors.length === 0;
    } else {
      setToastOpen(false); // Hide the toast if there are no errors
      return stepErrors.length === 0;
    }
  };

  const handleNext = () => {
    console.log(currentStep);
    console.log(formValues);
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

  const handleSubmit = async () => {
    if (!validateStep()) {
      return;
    }
  
    const formData = new FormData();
  
    Object.entries(formValues).forEach(([key, value]) => {
      if (key === 'studentCertificate' && value) {
        formData.append(key, value as File);
      } else {
        formData.append(key, String(value));
      }
    });
  
    try {
      const response = await apply(formData);
      if (response.status === 201) {
        setSubmitted(true);
        console.log('Application submitted:', response.data.message);
        localStorage.removeItem('applicationForm');
      } else {
        console.log('Error submitting application:', response.data.message);
      }
    } catch (error) {
      console.error('Error submitting application:', error);
    }
  };

  if (redirect) {
    return <Navigate to="/homepage" />;
  }

  const summarySection: Array<{
    label: string;
    name: keyof IApplicationForm;
    type: string;
    placeholder?: string;
    required?: boolean;
  }> = [
    { label: 'Summary', name: 'summary', type: 'summary' },
    {
      label: 'I agree that this information is correct.',
      name: 'summaryCheck',
      type: 'checkbox',
      required: true,
    },
  ];

  const renderInput = ({
    label,
    labelElement,
    name,
    type,
    options,
    placeholder,
    required,
  }: FormField) => {
    if (name === 'continent') {
      const nationality = formValues['nationality'];
      const continent = getContinentFromNationality(nationality);
      return (
        <label key={name} className="formSection">
          <p>{label}</p>
          <input
            type={type}
            name={name}
            value={continent}
            onChange={handleChange}
            className="formInput"
            required={required}
            placeholder={placeholder}
            disabled
          />
        </label>
      );
    }

    if (name === 'phoneNumber') {
      return (
        <label key={name} className="formSection">
          <p>{label}</p>
          <div className="phoneInputContainer">
            <select
              name="countryCode"
              value={countryCode}
              onChange={handlePhoneNumberChange}
              className="countryCodeSelect formInput"
            >
              <option value="" disabled>
                Select an option
              </option>
              {countryCodes.map((country) => (
                <option
                  key={`${country.name}-${country.code}`} // Ensure uniqueness
                  value={country.code}
                >
                  {country.name} ({country.code})
                </option>
              ))}
            </select>
            <input
              type="text"
              name={name}
              value={formValues[name].replace(countryCode, '')}
              onChange={handlePhoneNumberChange}
              className="formInput phoneNumberInput"
              required={required}
              placeholder={placeholder}
            />
          </div>
        </label>
      );
    }

    if (type === 'checkbox') {
      return (
        <label key={name} className="formSection">
          <div className="checkboxContainer">
            <input
              type="checkbox"
              name={name}
              checked={Boolean(formValues[name])}
              onChange={handleChange}
              className="checkboxInput"
              required={required}
            />
            <span className="checkboxLabel">{labelElement || label}</span>
          </div>
        </label>
      );
    }

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

    if (type === 'summary') {
      return getSummary();
    }

    return (
      <label key={name} className="formSection">
        <p>{labelElement || label}</p>
        {type === 'textarea' && (
          <textarea
            name={name}
            value={formValues[name] as string}
            onChange={handleChange}
            className="formInput"
            required={required}
            placeholder={placeholder}
          />
        )}
        {type === 'file' && (
          <div className="fileInputContainer">
            <label className="customFileInputLabel">
              <div className="customFileInputText">Choose File</div>
              <input
                type="file"
                name={name}
                onChange={handleFileChange}
                className="fileInput"
                required={required}
                accept=".pdf"
              />
            </label>
            {formValues[name] && formValues[name] instanceof File && (
              <div className="fileInfo">
                <p>Uploaded file: {(formValues[name] as unknown as File).name}</p>
              </div>
            )}
          </div>
        )}
        {type === 'select' && (
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
        )}
        {/* Default case for other input types */}
        {type !== 'textarea' &&
          type !== 'file' &&
          type !== 'select' &&
          type !== 'checkbox' && (
            <input
              type={type}
              name={name}
              value={formValues[name] as string | number | undefined}
              onChange={handleChange}
              className="formInput"
              required={required}
              placeholder={placeholder}
            />
          )}
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
        return financialSupportSection;
      case 3:
        return consentSection;
      case 4:
        return summarySection;
      default:
        return [];
    }
  };

  const renderStep = () => {
    return getCurrentFields().map(renderInput);
  };

  return (
    <div className="applicationFormContainer">
      <Header linkTo="/homepage" />

      {submitted ? (
        <div className="outerContainer">
          <h1 className="applicationSectionHeader">Application submitted</h1>
          <p>Thank you for applying to ISFiT!</p>
          <div className="navigationButtons">
            <Button type="button" onClick={() => setRedirect(true)}>
              Back to Homepage
            </Button>
          </div>
        </div>
      ) : (
        <>
          <div className="outerContainer">
            <h1 className="applicationSectionHeader">
              Welcome to the ISFiT 2025 Participant Application!
            </h1>
            <p>
              ISFiT, the world’s largest international student festival, is held
              biennially in Trondheim, Norway, during the spring semester. Since
              its inception in 1990, ISFiT has brought together students from
              diverse national and cultural backgrounds, fostering dialogue and
              connection through stimulating discussions on important global
              issues.
            </p>
            <p>
              Each festival centers around a unique theme, and for 2025, we will
              be exploring the theme of POWER. We invite you to join us from
              March 13th to 23rd, 2025, for this exciting event, where students
              from across the globe will gather in Trondheim to engage, learn,
              and inspire one another.
            </p>
          </div>
          <div className="progressOverview">
            {steps.map((step, index) => (
              <span key={index}>
                <span
                  className={`progressStep ${
                    index === currentStep ? 'currentStep' : ''
                  } ${visitedSteps.includes(index) ? 'clickableStep' : ''}`}
                  onClick={() => handleStepClick(index)}
                >
                  {step}
                </span>
                {index < steps.length - 1 && (
                  <span className="separator"> &gt; </span>
                )}
              </span>
            ))}
          </div>
          <form id="applicationContainer">
            <div className="outerContainerSection">
              <h1 className="applicationSectionHeader">{steps[currentStep]}</h1>
              {renderStep()}
            </div>
          </form>
          <div className="navigationButtons">
            {currentStep > 0 && (
              <Button type="button" onClick={handlePrevious}>
                Previous
              </Button>
            )}
            {currentStep < steps.length - 1 ? (
              <Button type="button" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button type="button" onClick={handleSubmit}>
                Apply
              </Button>
            )}
          </div>
          <CustomToast
            open={toastOpen}
            setOpen={setToastOpen}
            title={toastTitle}
            message={toastMessage}
          />
        </>
      )}
    </div>
  );
};

export default ApplicationForm;
