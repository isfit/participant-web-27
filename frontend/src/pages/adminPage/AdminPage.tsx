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

  const handleLogout = () => {
    localStorage.removeItem('authTokens');
    window.location.reload();
  }

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
        'Phone number',
        'Date of Birth (DD/MM/YYYY)', 
        'Gender', 
        'Nationality', 
        'Continent', 
        'Country of Residence', 
        'Is Student', 
        'Study Field', 
        'University', 
        'Student Certificate',
        'University Website', 
        'Is English Speaker', 
        'Applying As', 
        'Theme Power Thoughts', 
        'Country Power Issue', 
        'Motivation', 
        'Financial Support Reason', 
        'Full or partial funding',
        'Dependents', 
        'Family Income', 
        'Can Participate', 
        'Traveling to Trondheim from',
        'Other funding info',
        'Consent Visa', 
        'Consent Flight', 
        'Consent Norwegian law',
        'Consent Return',
        'Consent Personal Details', 
        'Consent Attendance', 
        'Consent Media',
        'Application Date (DD/MM/YYYY)'
      ],
      ...applications.map(app => {
     
        return [
        app.fullName,
        app.phoneNumber,
        new Date(app.dateOfBirth).toLocaleDateString('en-GB'),
        app.gender,
        app.nationality,
        app.continent,
        app.residenceCountry,
        app.isStudent ? 'Yes' : 'No',
        app.studyField,
        app.university,
        app.studentCertificate,
        app.universityWebsite || 'N/A',
        app.isEnglishSpeaker ? 'Yes' : 'No',
        app.applyingAs,
        app.themePowerThoughts,
        app.countryPowerIssue,
        app.motivation,
        app.financialSupportReason,
        app.fullOrPartialFunding,
        app.dependents.toString(),
        app.familyIncome,
        app.canParticipate,
        app.countryTravelingFrom,
        app.otherFundingInfo,
        app.consentVisa,
        app.consentFlight ? 'Yes' : 'No',
        app.consentNorwegianLaw ? 'Yes' : 'No',
        app.consentReturn ? 'Yes' : 'No',
        app.consentPersonalDetails ? 'Yes' : 'No',
        app.consentAttendance ? 'Yes' : 'No',
        app.consentMedia,
        app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : 'N/A'
      ];})
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

  const downloadPDF = async (id: string) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/application/certificate/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'student_certificate.pdf'); 
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
    }
  };

  return (
    <div className='adminOuter'>
      <div>
        <Header linkTo="/homepage" />
        <h1 className={loading ? 'adminLoading' : ''}>Admin page</h1>
      </div>
      <div className='topRight'>
        <button onClick={handleLogout}>Logout</button>
      </div>
      <div>
        <div className="filterContainer">
          <label>
            Start Date
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              />
          </label>
          <label>
            End Date
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              />
          </label>
        </div>
        <button onClick={exportToCSV}>Export to CSV</button>
              <h2>Applicants</h2>
        <div className='tableContainer'>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Phone number</th>
                <th>Date of Birth</th>
                <th>Gender</th>
                <th>Nationality</th>
                <th>Continent</th>
                <th>Country of Residence</th>
                <th>Is Student</th>
                <th>Study Field</th>
                <th>University</th>
                <th>Student Certificate</th>
                <th>University Website</th>
                <th>Is English Speaker</th>
                <th>Applying As</th>
                <th>Theme Power Thoughts</th>
                <th>Country Power Issue</th>
                <th>Motivation</th>
                <th>Financial Support Reason</th>
                <th>Full or partial funding</th>
                <th>Dependents</th>
                <th>Family Income</th>
                <th>Can Participate</th>
                <th>Traveling to Trondheim from</th>
                <th>Other funding info</th>
                <th>Consent Visa</th>
                <th>Consent Flight</th>
                <th>Consent Norwegian law</th>
                <th>Consent return</th>
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
                  <td>{application.phoneNumber}</td>
                  <td>{new Date(application.dateOfBirth).toLocaleDateString()}</td>
                  <td>{application.gender}</td>
                  <td>{application.nationality}</td>
                  <td>{application.continent}</td>
                  <td>{application.residenceCountry}</td>
                  <td>{application.isStudent ? 'Yes' : 'No'}</td>
                  <td>{application.studyField}</td>
                  <td>{application.university}</td>
                  <td>{application.studentCertificate ? <button onClick={() => downloadPDF(application?._id)}>Download Certificate</button> : 'N/A'}</td>            
                  <td>{application.universityWebsite || 'N/A'}</td>
                  <td>{application.isEnglishSpeaker ? 'Yes' : 'No'}</td>
                  <td>{application.applyingAs}</td>
                  <td>{application.themePowerThoughts}</td>
                  <td>{application.countryPowerIssue}</td>
                  <td>{application.motivation}</td>
                  <td>{application.financialSupportReason}</td>
                  <td>{application.fullOrPartialFunding}</td>
                  <td>{application.dependents}</td>
                  <td>{application.familyIncome}</td>
                  <td>{application.canParticipate}</td>
                  <td>{application.countryTravelingFrom}</td>
                  <td>{application.otherFundingInfo}</td>
                  <td>{application.consentVisa}</td>
                  <td>{application.consentFlight ? 'Yes' : 'No'}</td>
                  <td>{application.consentNorwegianLaw ? 'Yes' : 'No'}</td>
                  <td>{application.consentReturn ? 'Yes' : 'No'}</td>
                  <td>{application.consentPersonalDetails ? 'Yes' : 'No'}</td>
                  <td>{application.consentAttendance ? 'Yes' : 'No'}</td>
                  <td>{application.consentMedia}</td>
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