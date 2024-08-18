import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import axios from 'axios';
import { IApplicationForm } from '../../types/types';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const [applications, setApplications] = useState<IApplicationForm[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState<boolean>(true);


  const token = JSON.parse(localStorage.getItem('authTokens') || '');


  const fetchApplications = async (): Promise<IApplicationForm[]> => {
    try {
      const response = await axios.get('http://localhost:4000/api/application/applications', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate,
          endDate,
        },
      });

      const applications = response.data;
      return applications;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  };

  useEffect(() => {
      const getApplications = async () => {
        setLoading(true);
        const data = await fetchApplications();
        setApplications(data);
        setLoading(false);
      }
      getApplications();
  }
  , [startDate, endDate]);


  const exportToCSV = () => {
    const csvRows = [
      [
        'Full Name', 
        'Date of Birth (DD/MM/YYYY)', 
        'Gender', 
        'Nationality', 
        'Continent', 
        'Country of Residence', 
        'Is Student', 
        'Study Field', 
        'University', 
        'University Website', 
        'Is English Speaker', 
        'T-Shirt Size', 
        'Applying As', 
        'Theme Power Thoughts', 
        'Country Power Issue', 
        'Motivation', 
        'First Priority', 
        'First Priority Reason', 
        'Second Priority', 
        'Second Priority Reason', 
        'Third Priority', 
        'Third Priority Reason', 
        'Workshop Mandatory', 
        'Financial Support Reason', 
        'Dependents', 
        'Family Income', 
        'Can Participate', 
        'Consent Visa', 
        'Consent Flight', 
        'Consent Personal Details', 
        'Consent Attendance', 
        'Consent Media',
        'Application Date (DD/MM/YYYY)'
      ],
      ...applications.map(app => [
        app.fullName,
        new Date(app.dateOfBirth).toLocaleDateString('en-GB'),
        app.gender,
        app.nationality,
        app.continent,
        app.residenceCountry,
        app.isStudent ? 'Yes' : 'No',
        app.studyField,
        app.university,
        app.universityWebsite || 'N/A',
        app.isEnglishSpeaker ? 'Yes' : 'No',
        app.tShirtSize,
        app.applyingAs,
        app.themePowerThoughts,
        app.countryPowerIssue,
        app.motivation,
        app.firstPriority,
        app.firstPriorityReason,
        app.secondPriority || 'N/A',
        app.secondPriorityReason || 'N/A',
        app.thirdPriority || 'N/A',
        app.thirdPriorityReason || 'N/A',
        app.workshopMandatory ? 'Yes' : 'No',
        app.financialSupportReason,
        app.dependents.toString(),
        app.familyIncome,
        app.canParticipate,
        app.consentVisa ? 'Yes' : 'No',
        app.consentFlight ? 'Yes' : 'No',
        app.consentPersonalDetails ? 'Yes' : 'No',
        app.consentAttendance ? 'Yes' : 'No',
        app.consentMedia ? 'Yes' : 'No',
        app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : 'N/A'
      ])
    ];
  
    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'applications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className='adminOuter'>
      <div>
        <Header linkTo="/homepage" />
        <h1 className={loading ? 'adminLoading' : ''}>Admin page</h1>
      </div>
      <div>
        <h2>Applicants</h2>
        <div className="filterContainer">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
        </div>
        <button onClick={exportToCSV}>Export to CSV</button>
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Nationality</th>
                <th>Continent</th>
                <th>Country of Residence</th>
                <th>Is Student</th>
                <th>Study Field</th>
                <th>University</th>
                <th>University Website</th>
                <th>Is English Speaker</th>
                <th>T-Shirt Size</th>
                <th>Applying As</th>
                <th>Theme Power Thoughts</th>
                <th>Country Power Issue</th>
                <th>Motivation</th>
                <th>First Priority</th>
                <th>First Priority Reason</th>
                <th>Second Priority</th>
                <th>Second Priority Reason</th>
                <th>Third Priority</th>
                <th>Third Priority Reason</th>
                <th>Workshop Mandatory</th>
                <th>Financial Support Reason</th>
                <th>Dependents</th>
                <th>Family Income</th>
                <th>Can Participate</th>
                <th>Consent Visa</th>
                <th>Consent Flight</th>
                <th>Consent Personal Details</th>
                <th>Consent Attendance</th>
                <th>Consent Media</th>
                <th>Application Date</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application) => (
                <tr key={application._id}>
                  <td>{application.fullName}</td>
                  <td>{new Date(application.dateOfBirth).toLocaleDateString()}</td>
                  <td>{application.gender}</td>
                  <td>{application.nationality}</td>
                  <td>{application.continent}</td>
                  <td>{application.residenceCountry}</td>
                  <td>{application.isStudent ? 'Yes' : 'No'}</td>
                  <td>{application.studyField}</td>
                  <td>{application.university}</td>
                  <td>{application.universityWebsite || 'N/A'}</td>
                  <td>{application.isEnglishSpeaker ? 'Yes' : 'No'}</td>
                  <td>{application.tShirtSize}</td>
                  <td>{application.applyingAs}</td>
                  <td>{application.themePowerThoughts}</td>
                  <td>{application.countryPowerIssue}</td>
                  <td>{application.motivation}</td>
                  <td>{application.firstPriority}</td>
                  <td>{application.firstPriorityReason}</td>
                  <td>{application.secondPriority || 'N/A'}</td>
                  <td>{application.secondPriorityReason || 'N/A'}</td>
                  <td>{application.thirdPriority || 'N/A'}</td>
                  <td>{application.thirdPriorityReason || 'N/A'}</td>
                  <td>{application.workshopMandatory ? 'Yes' : 'No'}</td>
                  <td>{application.financialSupportReason}</td>
                  <td>{application.dependents}</td>
                  <td>{application.familyIncome}</td>
                  <td>{application.canParticipate}</td>
                  <td>{application.consentVisa ? 'Yes' : 'No'}</td>
                  <td>{application.consentFlight ? 'Yes' : 'No'}</td>
                  <td>{application.consentPersonalDetails ? 'Yes' : 'No'}</td>
                  <td>{application.consentAttendance ? 'Yes' : 'No'}</td>
                  <td>{application.consentMedia ? 'Yes' : 'No'}</td>
                  <td>{application.createdAt ? new Date(application.createdAt).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;