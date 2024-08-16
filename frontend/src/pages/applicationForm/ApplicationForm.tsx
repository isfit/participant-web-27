import React, { useEffect, useState } from 'react';
import { Button } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import Header from '../../components/Header/Header';
import './ApplicationForm.css';
import Dropdown from '../../components/Menus/Dropdown.tsx';

/*

Application values:

PERSONAL DETAILS
- Full name
- Date of birth
- Gender
- Nationality
- Continent of Nationality
- Country of residence
- I am a student throughout the academic year 2024-2025
- What do you study?
- Name of your University/Institute
- Your University/Institute website address (optional)
- Please upload your student certificate. 
- I am able to communicate in English
- What is your T-Shirt size?
- I am applying as:

THEME:
- When considering the theme of 'POWER' for ISFiT25, what aspects or dimensions of power come to your mind first?
- Reflecting on your country's context, can you identify a specific power issue? How does this issue manifest, and what are its consequences?
- What is your motivation for attending ISFiT25? How do you envision contributing to discussions and activities surrounding this theme during the festival?

WORKSHOP:
- Select your first priority 
- Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Polarization.
- Select your second priority 
- Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Power. (optional)
- Select your third priority
- Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Power . (optional)
- I am aware it is mandatory to participate in the given workshop even if I don´t get any of my priorities

FINANCIAL SUPPORT:
- Some of the participants get financial support for their trip to participate in ISFiT25. Why do you think that you should be considered for this financial support?
- How many dependents do you have?
- What is your family´s monthly income?
- I can participate in ISFiT25
- I can participate in ISFiT25

CONSENT:
- I have to apply for a visa if i get accepted as a participant 
- I am aware that I have to book a flight to Norway on my own even if I get financial support 
- I agree that ISFiT can keep my personal details to be used later in the festival
- I am aware that participation certificate will be given only if I attend all days of the workshop and mandatory events.
- I agree that ISFiT can share pictures and videoes of me taken during the festival on social media 

*/

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
  canParticipate: boolean;
  consentVisa: boolean;
  consentFlight: boolean;
  consentPersonalDetails: boolean;
  consentAttendance: boolean;
  consentMedia: boolean;
}

const ApplicationForm: React.FC = () => {
  const [formValues, setFormValues] = useState<FormValues>({
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
    canParticipate: false,
    consentVisa: false,
    consentFlight: false,
    consentPersonalDetails: false,
    consentAttendance: false,
    consentMedia: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
  
    if (e.target instanceof HTMLInputElement && e.target.type === 'checkbox') {
      setFormValues(prevState => ({
        ...prevState,
        [name]: e.target.checked
      }));
    } else {
      setFormValues(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
  
  

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Form submitted:', formValues);
  };

  return (
    <div id='pageContainer'>
      <div className="topRight">
        <Link to="/login" style={{ color: 'white'}}><Button>Login</Button></Link>
        <Link to="/profilePage" style={{ color: 'white'}}><Button>My profile</Button></Link>
      </div>
      <Header linkTo='/homepage' />
      <div>
        <div className='applicationInfo'>
          <h2>Application Form For Participants</h2>
          <p>Tell us about yourself and your motivation for joining ISFiT</p>
        </div>
        <form className="applicationForm" onSubmit={handleSubmit}>
          <div id='applicationContainer'>
            {/* Personal Details */}
            <div>
              <label>Full Name:</label>
              <input type="text" name="fullName" value={formValues.fullName} onChange={handleChange} required />

              <label>Date of Birth:</label>
              <input type="date" name="dateOfBirth" value={formValues.dateOfBirth} onChange={handleChange} required />

              <label>Gender:</label>
              <input type="text" name="gender" value={formValues.gender} onChange={handleChange} required />

              <label>Nationality:</label>
              <input type="text" name="nationality" value={formValues.nationality} onChange={handleChange} required />

              <label>Continent of Nationality:</label>
              <input type="text" name="continent" value={formValues.continent} onChange={handleChange} required />

              <label>Country of Residence:</label>
              <input type="text" name="residenceCountry" value={formValues.residenceCountry} onChange={handleChange} required />

              <label>I am a student throughout the academic year 2024-2025:</label>
              <input type="checkbox" name="isStudent" checked={formValues.isStudent} onChange={handleChange} />

              <label>What do you study?</label>
              <input type="text" name="studyField" value={formValues.studyField} onChange={handleChange} required />

              <label>Name of your University/Institute:</label>
              <input type="text" name="university" value={formValues.university} onChange={handleChange} required />

              <label>Your University/Institute website address (optional):</label>
              <input type="text" name="universityWebsite" value={formValues.universityWebsite} onChange={handleChange} />

              <label>Please upload your student certificate:</label>
              <input type="file" name="studentCertificate" onChange={(e) => setFormValues({ ...formValues, studentCertificate: e.target.files?.[0] })} />

              <label>I am able to communicate in English:</label>
              <input type="checkbox" name="isEnglishSpeaker" checked={formValues.isEnglishSpeaker} onChange={handleChange} />

              <label>What is your T-Shirt size?</label>
              <input type="text" name="tShirtSize" value={formValues.tShirtSize} onChange={handleChange} required />

              <label>I am applying as:</label>
              <input type="text" name="applyingAs" value={formValues.applyingAs} onChange={handleChange} required />
            </div>

            {/* Theme */}
            <div>
              <label>When considering the theme of 'POWER' for ISFiT25, what aspects or dimensions of power come to your mind first?</label>
              <textarea name="themePowerThoughts" value={formValues.themePowerThoughts} onChange={handleChange} required />

              <label>Reflecting on your country's context, can you identify a specific power issue? How does this issue manifest, and what are its consequences?</label>
              <textarea name="countryPowerIssue" value={formValues.countryPowerIssue} onChange={handleChange} required />

              <label>What is your motivation for attending ISFiT25? How do you envision contributing to discussions and activities surrounding this theme during the festival?</label>
              <textarea name="motivation" value={formValues.motivation} onChange={handleChange} required />
            </div>

            {/* Workshop */}
            <div>
              <label>Select your first priority:</label>
              <input type="text" name="firstPriority" value={formValues.firstPriority} onChange={handleChange} required />

              <label>Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Polarization.</label>
              <textarea name="firstPriorityReason" value={formValues.firstPriorityReason} onChange={handleChange} required />

              <label>Select your second priority (optional):</label>
              <input type="text" name="secondPriority" value={formValues.secondPriority} onChange={handleChange} />

              <label>Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Power. (optional)</label>
              <textarea name="secondPriorityReason" value={formValues.secondPriorityReason} onChange={handleChange} />

              <label>Select your third priority (optional):</label>
              <input type="text" name="thirdPriority" value={formValues.thirdPriority} onChange={handleChange} />

              <label>Why do you want to attend this workshop? Please give examples of how this workshop relates to your life or to the theme Power. (optional)</label>
              <textarea name="thirdPriorityReason" value={formValues.thirdPriorityReason} onChange={handleChange} />

              <label>I am aware it is mandatory to participate in the given workshop even if I don´t get any of my priorities:</label>
              <input type="checkbox" name="workshopMandatory" checked={formValues.workshopMandatory} onChange={handleChange} />
            </div>

            {/* Financial Support */}
            <div>
              <label>Some of the participants get financial support for their trip to participate in ISFiT25. Why do you think that you should be considered for this financial support?</label>
              <textarea name="financialSupportReason" value={formValues.financialSupportReason} onChange={handleChange} required />

              <label>How many dependents do you have?</label>
              <input type="number" name="dependents" value={formValues.dependents} onChange={handleChange} required />

              <label>What is your family´s monthly income?</label>
              <input type="text" name="familyIncome" value={formValues.familyIncome} onChange={handleChange} required />

              <label>I can participate in ISFiT25:</label>
              <input type="checkbox" name="canParticipate" checked={formValues.canParticipate} onChange={handleChange} />
            </div>

            {/* Consent */}
            <div>
              <label>I have to apply for a visa if I get accepted as a participant:</label>
              <input type="checkbox" name="consentVisa" checked={formValues.consentVisa} onChange={handleChange} />

              <label>I am aware that I have to book a flight to Norway on my own even if I get financial support:</label>
              <input type="checkbox" name="consentFlight" checked={formValues.consentFlight} onChange={handleChange} />

              <label>I agree that ISFiT can keep my personal details to be used later in the festival:</label>
              <input type="checkbox" name="consentPersonalDetails" checked={formValues.consentPersonalDetails} onChange={handleChange} />

              <label>I am aware that a participation certificate will be given only if I attend all days of the workshop and mandatory events:</label>
              <input type="checkbox" name="consentAttendance" checked={formValues.consentAttendance} onChange={handleChange} />

              <label>I agree that ISFiT can share pictures and videos of me taken during the festival on social media:</label>
              <input type="checkbox" name="consentMedia" checked={formValues.consentMedia} onChange={handleChange} />
            </div>
          </div>
          <Button type="submit">Apply</Button>
        </form>
      </div>
    </div>
  );
};

export default ApplicationForm;
