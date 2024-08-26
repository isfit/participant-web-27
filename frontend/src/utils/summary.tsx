export function getSummary() {
    const savedForm = localStorage.getItem('applicationForm');
    
    if (!savedForm) {
      return 'No application data found.';
    }
    
    const formValues = JSON.parse(savedForm);
  
    return (
    <table style={{borderCollapse: "collapse", width: "100%"}}>
      <tr>
        <strong>Personal Details</strong>
      </tr>
      <tr>
        <td><strong>Your name:</strong></td>
        <td>{formValues.fullName}</td>
      </tr>
      <tr>
        <td><strong>Date of Birth:</strong></td>
        <td>{formValues.dateOfBirth}</td>
      </tr>
      <tr>
        <td><strong>Gender:</strong></td>
        <td>{formValues.gender}</td>
      </tr>
      <tr>
        <td><strong>Nationality:</strong></td>
        <td>{formValues.nationality}</td>
      </tr>
      <tr>
        <td><strong>Continent of Nationality:</strong></td>
        <td>{formValues.continent}</td>
      </tr>
      <tr>
        <td><strong>Country of Residence:</strong></td>
        <td>{formValues.residenceCountry}</td>
      </tr>
      <tr>
        <td><strong>Are you a student?:</strong></td>
        <td>{formValues.isStudent ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td><strong>Field of Study:</strong></td>
        <td>{formValues.studyField}</td>
      </tr>
      <tr>
        <td><strong>University/Institute:</strong></td>
        <td>{formValues.university}</td>
      </tr>
      <tr>
        <td><strong>University Website:</strong></td>
        <td>{formValues.universityWebsite || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Student Certificate Uploaded:</strong></td>
        <td>{formValues.studentCertificate ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td><strong>English Speaker:</strong></td>
        <td>{formValues.isEnglishSpeaker ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td><strong>T-Shirt Size:</strong></td>
        <td>{formValues.tShirtSize}</td>
      </tr>
      <tr>
        <td><strong>Applying As:</strong></td>
        <td>{formValues.applyingAs}</td>
      </tr>
      <tr><td colSpan={2}><br /></td></tr>
      <strong>Theme</strong>
      <tr>
        <td><strong>Thoughts on POWER Theme:</strong></td>
        <td>{formValues.themePowerThoughts}</td>
      </tr>
      <tr>
        <td><strong>Power Issue in Your Country:</strong></td>
        <td>{formValues.countryPowerIssue}</td>
      </tr>
      <tr>
        <td><strong>Motivation for Attending ISFiT25:</strong></td>
        <td>{formValues.motivation}</td>
      </tr>
      <tr><td colSpan={2}><br /></td></tr>
      <strong>Financial Support</strong>
      <tr>
        <td><strong>Reason for Financial Support:</strong></td>
        <td>{formValues.financialSupportReason || 'N/A'}</td>
      </tr>
      <tr>
        <td><strong>Number of Dependents:</strong></td>
        <td>{formValues.dependents}</td>
      </tr>
      <tr>
        <td><strong>Family Income:</strong></td>
        <td>{formValues.familyIncome}</td>
      </tr>
      <tr>
        <td><strong>Participation Condition:</strong></td>
        <td>{formValues.canParticipate}</td>
      </tr>
      <tr><td colSpan={2}><br /></td></tr>
      <strong>Consent</strong>
      <tr>
        <td><strong>Consent for Visa Application:</strong></td>
        <td>{formValues.consentVisa ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td><strong>Consent for Booking Flight:</strong></td>
        <td>{formValues.consentFlight ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td><strong>Consent for Personal Details:</strong></td>
        <td>{formValues.consentPersonalDetails ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td><strong>Consent for Attendance:</strong></td>
        <td>{formValues.consentAttendance ? 'Yes' : 'No'}</td>
      </tr>
      <tr>
        <td><strong>Consent for Media Use:</strong></td>
        <td>{formValues.consentMedia ? 'Yes' : 'No'}</td>
      </tr>
    </table>
    );
  }
  

  export default getSummary;