import React, { useState, useEffect } from 'react';
import { Button } from '@radix-ui/themes';
import Header from '../../components/Header/Header';
import './ApplicationForm.css';
import { IApplicationForm } from '../../types/types';
import { apply } from '../../api/application';
import { Navigate } from 'react-router-dom';

const steps = [
  'Personal Details',
  'Theme',
  'Financial Support',
  'Consent',
];

const ApplicationForm: React.FC = () => {
  const [formValues, setFormValues] = useState<IApplicationForm>(() => {
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
  const [redirect, setRedirect] = useState(false);
  const [submitted, setSubmitted] = useState(false);
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
  
    console.log(name, value, type);
  };
  

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    const file = e.target.files?.[0];
    if (file && !['application/pdf'].includes(file.type)) {
      alert('File must be a PDF.');
      return;
    }
    if (file && file.size > 5 * 1024 * 1024) { // 5 MB limit
      alert('File size exceeds 5 MB');
      return;
    }
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
    console.log(currentStep)
    console.log(formValues)
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
      //add the studentCertificate as a file if it exists
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
        setTimeout(() => {
          setRedirect(true);
        }, 5000);
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

  const nations = ["Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua & Deps", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Rep", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Congo {Democratic Rep}", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland {Republic}", "Israel", "Italy", "Ivory Coast", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea North", "Korea South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Macedonia", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar, {Burma}", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "Norway", "Oman", "Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russian Federation", "Rwanda", "St Kitts & Nevis", "St Lucia", "Saint Vincent & the Grenadines", "Samoa", "San Marino", "Sao Tome & Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad & Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"];
  const nationalities = ["Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Antiguan or Barbudan", "Argentine", 
  "Armenian", "Australian", "Austrian", "Azerbaijani", "Bahamian", "Bahraini", "Bangladeshi", "Barbadian", 
  "Belarusian", "Belgian", "Belizean", "Beninese", "Bhutanese", "Bolivian", "Bosnian or Herzegovinian", 
  "Botswanan", "Brazilian", "British", "Bruneian", "Bulgarian", "Burkinabé", "Burundian", "Cabo Verdean", 
  "Cambodian", "Cameroonian", "Canadian", "Central African", "Chadian", "Chilean", "Chinese", "Colombian", 
  "Comoran", "Congolese (Congo-Brazzaville)", "Congolese (Congo-Kinshasa)", "Costa Rican", "Croatian", 
  "Cuban", "Cypriot", "Czech", "Danish", "Djiboutian", "Dominican", "Dominican (Dominican Republic)", 
  "Dutch", "East Timorese", "Ecuadorean", "Egyptian", "Emirati", "Equatorial Guinean", "Eritrean", 
  "Estonian", "Eswatini", "Ethiopian", "Fijian", "Filipino", "Finnish", "French", "Gabonese", "Gambian", 
  "Georgian", "German", "Ghanaian", "Greek", "Grenadian", "Guatemalan", "Guinean", "Guinea-Bissauan", 
  "Guyanese", "Haitian", "Honduran", "Hungarian", "Icelander", "Indian", "Indonesian", "Iranian", "Iraqi", 
  "Irish", "Israeli", "Italian", "Ivorian", "Jamaican", "Japanese", "Jordanian", "Kazakh", "Kenyan", 
  "Kiribati", "Kuwaiti", "Kyrgyz", "Laotian", "Latvian", "Lebanese", "Lesotho", "Liberian", "Libyan", 
  "Liechtenstein", "Lithuanian", "Luxembourgish", "Macedonian", "Malagasy", "Malawian", "Malaysian", 
  "Maldivian", "Malian", "Maltese", "Marshallese", "Mauritanian", "Mauritian", "Mexican", "Micronesian", 
  "Moldovan", "Monacan", "Mongolian", "Montenegrin", "Moroccan", "Mozambican", "Namibian", "Nauruan", 
  "Nepalese", "New Zealander", "Nicaraguan", "Nigerien", "Nigerian", "North Korean", "Norwegian", "Omani", 
  "Pakistani", "Palauan", "Palestinian", "Panamanian", "Papua New Guinean", "Paraguayan", "Peruvian", 
  "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Rwandan", "Saint Kitts and Nevis", "Saint Lucian", 
  "Saint Vincentian", "Samoan", "San Marinese", "Sao Tomean", "Saudi", "Senegalese", "Serbian", 
  "Seychellois", "Sierra Leonean", "Singaporean", "Slovak", "Slovenian", "Solomon Islander", "Somali", 
  "South African", "South Korean", "South Sudanese", "Spanish", "Sri Lankan", "Sudanese", "Surinamese", 
  "Swazi", "Swedish", "Swiss", "Syrian", "Taiwanese", "Tajik", "Tanzanian", "Thai", "Togolese", "Tongan", 
  "Trinidadian or Tobagonian", "Tunisian", "Turkish", "Turkmen", "Tuvaluan", "Ugandan", "Ukrainian", 
  "Uruguayan", "Uzbek", "Vanuatuan", "Venezuelan", "Vietnamese", "Yemeni", "Zambian", "Zimbabwean"];
  
  


  const nationalityToContinent: { [key: string]: string } = {
    "Afghan": "Asia",
    "Albanian": "Europe",
    "Algerian": "Africa",
    "American": "North America",
    "Andorran": "Europe",
    "Angolan": "Africa",
    "Antiguan or Barbudan": "North America",
    "Argentine": "South America",
    "Armenian": "Asia",
    "Australian": "Australia",
    "Austrian": "Europe",
    "Azerbaijani": "Asia",
    "Bahamian": "North America",
    "Bahraini": "Asia",
    "Bangladeshi": "Asia",
    "Barbadian": "North America",
    "Belarusian": "Europe",
    "Belgian": "Europe",
    "Belizean": "North America",
    "Beninese": "Africa",
    "Bhutanese": "Asia",
    "Bolivian": "South America",
    "Bosnian or Herzegovinian": "Europe",
    "Botswanan": "Africa",
    "Brazilian": "South America",
    "British": "Europe",
    "Bruneian": "Asia",
    "Bulgarian": "Europe",
    "Burkinabé": "Africa",
    "Burundian": "Africa",
    "Cabo Verdean": "Africa",
    "Cambodian": "Asia",
    "Cameroonian": "Africa",
    "Canadian": "North America",
    "Central African": "Africa",
    "Chadian": "Africa",
    "Chilean": "South America",
    "Chinese": "Asia",
    "Colombian": "South America",
    "Comoran": "Africa",
    "Congolese (Congo-Brazzaville)": "Africa",
    "Congolese (Congo-Kinshasa)": "Africa",
    "Costa Rican": "North America",
    "Croatian": "Europe",
    "Cuban": "North America",
    "Cypriot": "Asia",
    "Czech": "Europe",
    "Danish": "Europe",
    "Djiboutian": "Africa",
    "Dominican": "North America",
    "Dominican (Dominican Republic)": "North America",
    "Dutch": "Europe",
    "East Timorese": "Asia",
    "Ecuadorean": "South America",
    "Egyptian": "Africa",
    "Emirati": "Asia",
    "Equatorial Guinean": "Africa",
    "Eritrean": "Africa",
    "Estonian": "Europe",
    "Eswatini": "Africa",
    "Ethiopian": "Africa",
    "Fijian": "Australia",
    "Filipino": "Asia",
    "Finnish": "Europe",
    "French": "Europe",
    "Gabonese": "Africa",
    "Gambian": "Africa",
    "Georgian": "Asia",
    "German": "Europe",
    "Ghanaian": "Africa",
    "Greek": "Europe",
    "Grenadian": "North America",
    "Guatemalan": "North America",
    "Guinean": "Africa",
    "Guinea-Bissauan": "Africa",
    "Guyanese": "South America",
    "Haitian": "North America",
    "Honduran": "North America",
    "Hungarian": "Europe",
    "Icelander": "Europe",
    "Indian": "Asia",
    "Indonesian": "Asia",
    "Iranian": "Asia",
    "Iraqi": "Asia",
    "Irish": "Europe",
    "Israeli": "Asia",
    "Italian": "Europe",
    "Ivorian": "Africa",
    "Jamaican": "North America",
    "Japanese": "Asia",
    "Jordanian": "Asia",
    "Kazakh": "Asia",
    "Kenyan": "Africa",
    "Kiribati": "Australia",
    "Kuwaiti": "Asia",
    "Kyrgyz": "Asia",
    "Laotian": "Asia",
    "Latvian": "Europe",
    "Lebanese": "Asia",
    "Lesotho": "Africa",
    "Liberian": "Africa",
    "Libyan": "Africa",
    "Liechtenstein": "Europe",
    "Lithuanian": "Europe",
    "Luxembourgish": "Europe",
    "Macedonian": "Europe",
    "Malagasy": "Africa",
    "Malawian": "Africa",
    "Malaysian": "Asia",
    "Maldivian": "Asia",
    "Malian": "Africa",
    "Maltese": "Europe",
    "Marshallese": "Australia",
    "Mauritanian": "Africa",
    "Mauritian": "Africa",
    "Mexican": "North America",
    "Micronesian": "Australia",
    "Moldovan": "Europe",
    "Monacan": "Europe",
    "Mongolian": "Asia",
    "Montenegrin": "Europe",
    "Moroccan": "Africa",
    "Mozambican": "Africa",
    "Namibian": "Africa",
    "Nauruan": "Australia",
    "Nepalese": "Asia",
    "New Zealander": "Australia",
    "Nicaraguan": "North America",
    "Nigerien": "Africa",
    "Nigerian": "Africa",
    "North Korean": "Asia",
    "Norwegian": "Europe",
    "Omani": "Asia",
    "Pakistani": "Asia",
    "Palauan": "Australia",
    "Palestinian": "Asia",
    "Panamanian": "North America",
    "Papua New Guinean": "Australia",
    "Paraguayan": "South America",
    "Peruvian": "South America",
    "Polish": "Europe",
    "Portuguese": "Europe",
    "Qatari": "Asia",
    "Romanian": "Europe",
    "Russian": "Europe",
    "Rwandan": "Africa",
    "Saint Kitts and Nevis": "North America",
    "Saint Lucian": "North America",
    "Saint Vincentian": "North America",
    "Samoan": "Australia",
    "San Marinese": "Europe",
    "Sao Tomean": "Africa",
    "Saudi": "Asia",
    "Senegalese": "Africa",
    "Serbian": "Europe",
    "Seychellois": "Africa",
    "Sierra Leonean": "Africa",
    "Singaporean": "Asia",
    "Slovak": "Europe",
    "Slovenian": "Europe",
    "Solomon Islander": "Australia",
    "Somali": "Africa",
    "South African": "Africa",
    "South Korean": "Asia",
    "South Sudanese": "Africa",
    "Spanish": "Europe",
    "Sri Lankan": "Asia",
    "Sudanese": "Africa",
    "Surinamese": "South America",
    "Swazi": "Africa",
    "Swedish": "Europe",
    "Swiss": "Europe",
    "Syrian": "Asia",
    "Taiwanese": "Asia",
    "Tajik": "Asia",
    "Tanzanian": "Africa",
    "Thai": "Asia",
    "Togolese": "Africa",
    "Tongan": "Australia",
    "Trinidadian or Tobagonian": "North America",
    "Tunisian": "Africa",
    "Turkish": "Asia",
    "Turkmen": "Asia",
    "Tuvaluan": "Australia",
    "Ugandan": "Africa",
    "Ukrainian": "Europe",
    "Uruguayan": "South America",
    "Uzbek": "Asia",
    "Vanuatuan": "Australia",
    "Venezuelan": "South America",
    "Vietnamese": "Asia",
    "Yemeni": "Asia",
    "Zambian": "Africa",
    "Zimbabwean": "Africa"
};

const getContinentFromNationality = (nationality: string): string => {
  return nationalityToContinent[nationality] || 'Unknown';
}

  const personalDetails: Array<{ label: string; name: keyof IApplicationForm; type: string; options?: string[]; placeholder?: string; required?: boolean }> = [
    { label: 'Full Name', name: 'fullName', type: 'text', placeholder: 'John Doe', required: true },
    { label: 'Date of Birth', name: 'dateOfBirth', type: 'date', placeholder: 'YYYY-MM-DD', required: true },
    { label: 'Gender', name: 'gender', type: 'select', options: ['Male', 'Female', 'Other'], required: true },
    { label: 'Nationality', name: 'nationality', type: 'select', options: nationalities, required: true },
    { label: 'Continent of Nationality', name: 'continent', type: 'text', placeholder:'ex: Europe', required: true },
    { label: 'Country of Residence', name: 'residenceCountry',type: 'select', options: nations, required: true },
    { label: 'By checking this box, I confirm I am a student throughout the academic year 2024-2025', name: 'isStudent', type: 'checkbox', required: true },
    { label: 'What do you study?', name: 'studyField', type: 'text', placeholder: 'ex. Infomatics', required: true },
    { label: 'Name of your University/Institute', name: 'university', type: 'text', placeholder: 'ex. Norwegian University of Science and Technology', required: true },
    { label: 'Your University/Institute website address (optional)', name: 'universityWebsite', type: 'text', placeholder: 'ex. https://youruniversity.edu' },
    { label: 'Please upload your student certificate as a PDF', name: 'studentCertificate', type: 'file', required: true },
    { label: 'By checking this box, I confirm I am able to communicate in English', name: 'isEnglishSpeaker', type: 'checkbox', required: true },
    { label: 'What is your T-Shirt size?', name: 'tShirtSize', type: 'select', options: ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL'], required: true },
    { label: 'I am applying as', name: 'applyingAs', type: 'select', options: ['Regular participant', 'SOrCE', 'Coastal Carolina University', 'Dialogue Project'], required: true },
  ];

  const themeSection: Array<{ label: string; name: keyof IApplicationForm; type: string; placeholder?: string; required?: boolean }> = [
    { label: "When considering the theme of 'POWER' for ISFiT25, what aspects or dimensions of power come to your mind first?", name: 'themePowerThoughts', type: 'textarea', placeholder: 'When I think of power I think of ...', required: true },
    { label: "Reflecting on your country's context, can you identify a specific power issue? How does this issue manifest, and what are its consequences?", name: 'countryPowerIssue', type: 'textarea', placeholder: 'When reflecting on my country\'s context, an issue regarding power is ...', required: true },
    { label: 'What is your motivation for attending ISFiT25? How do you envision contributing to discussions and activities surrounding this theme during the festival?', name: 'motivation', type: 'textarea', placeholder: 'My motivation for attending ISFiT25 is ...', required: true },
  ];

  const financialSupportSection: Array<{ label: string; name: keyof IApplicationForm; type: string; options?: string[]; placeholder?: string; required?: boolean }> = [
    { label: 'Some of the participants get financial support for their trip to participate in ISFiT25. Why do you think that you should be considered for this financial support?', name: 'financialSupportReason', type: 'textarea', placeholder: 'I should be considered to get financial support because ...' },
    { label: 'How many dependents do you have?', name: 'dependents', type: 'number', placeholder: 'Number of dependents' },
    { label: 'What is your family´s monthly income?', name: 'familyIncome', type: 'text', placeholder: 'Your family income' },
    { label: 'I can participate in ISFiT25', name: 'canParticipate', type: 'select', options: ['without any financial support', 'if I get partial financial support', 'if I get full financial support'] },
  ];

  const consentSection: Array<{ label: string; name: keyof IApplicationForm; type: string; placeholder?: string; required?: boolean }> = [
    { label: 'I have to apply for a visa if I get accepted as a participant', name: 'consentVisa', type: 'checkbox', required: true },
    { label: 'I am aware that I have to book a flight to Norway on my own even if I get financial support', name: 'consentFlight', type: 'checkbox', required: true },
    { label: 'I agree that ISFiT can keep my personal details to be used later in the festival', name: 'consentPersonalDetails', type: 'checkbox', required: true },
    { label: 'I am aware that a participation certificate will be given only if I attend all days of the workshop and mandatory events', name: 'consentAttendance', type: 'checkbox', required: true },
    { label: 'I agree that ISFiT can share pictures and videos of me taken during the festival on social media', name: 'consentMedia', type: 'checkbox', required: true },
  ];

  const renderInput = ({
    label,
    name,
    type,
    options,
    placeholder,
    required,
  }: {
    label: string;
    name: keyof IApplicationForm;
    type: string;
    options?: string[];
    placeholder?: string;
    required?: boolean;
  }) => {
    if (name === "continent") {
      const nationality = formValues['nationality']
      const continent = getContinentFromNationality(nationality)
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
      )
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
        return financialSupportSection;
      case 3:
        return consentSection;
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
        </div>
      ) : (
        <>
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
            <div className="outerContainer">
              <h1 className="applicationSectionHeader">{steps[currentStep]}</h1>
              {renderStep()}
            </div>
          </form>
  
          <div className="navigationButtons" >
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
        </>
      )}
    </div>
  )
}

export default ApplicationForm;
