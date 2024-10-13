import React, { useState, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import { IApplicationForm } from '../../types/types';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthenticationContext';
import styles from './AdminPage.module.css';
import { ROLES } from '../../config/roles';
import { Button } from '@radix-ui/themes';
import cross from '../../../public/cross.svg';
import axiosInstance from '../../api/axios';

const api_url: string = import.meta.env.VITE_API_URL;

const AdminPage: React.FC = () => {
  const [applications, setApplications] = useState<IApplicationForm[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const [numOfApplication, setNumOfApplication] = useState(0);
  const [page] = useState(1); // Pagination state
  const [limit] = useState(50); // Limit of applications per page

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem('authTokens');
    window.location.reload();
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const token = JSON.parse(localStorage.getItem('authTokens') || '');

  // Debounce function to reduce API calls
  const debounce = (func: Function, delay: number) => {
    let timeoutId: NodeJS.Timeout;
    return (...args: any) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  // Handle date changes with debounce
  const handleDateChange = debounce((field: string, value: string) => {
    if (field === 'startDate') setStartDate(value);
    else setEndDate(value);
  }, 500);

  // Fetch applications with pagination
  const fetchApplications = async (): Promise<IApplicationForm[]> => {
    try {
      const response = await axiosInstance.get(`${api_url}/api/application/applications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate,
          endDate,
          page,
          limit,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  };

  useEffect(() => {
    const getApplications = async () => {
      const data = await fetchApplications();
      setApplications(data);
      setNumOfApplication(data.length);
    };
    getApplications();
  }, [startDate, endDate, page]);

  // Export to CSV function
  const escapeCSV = (text: string) => {
    if (text == null) return 'N/A';
    return `"${text.replace(/"/g, '""')}"`;
  };

  const exportToCSV = () => {
    const csvRows = [
      [
        'Full Name',
        'Email',
        'Phone number',
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
        'Application Date (DD/MM/YYYY)',
      ],
      ...applications.map((app) => {
        return [
          escapeCSV(app.fullName),
          escapeCSV(app.email),
          escapeCSV(app.phoneNumber),
          app.dateOfBirth ? new Date(app.dateOfBirth).toLocaleDateString('en-GB') : 'N/A',
          escapeCSV(app.gender),
          escapeCSV(app.nationality),
          escapeCSV(app.continent),
          escapeCSV(app.residenceCountry),
          app.isStudent ? 'Yes' : 'No',
          escapeCSV(app.studyField),
          escapeCSV(app.university),
          app.universityWebsite ? escapeCSV(app.universityWebsite) : 'N/A',
          app.isEnglishSpeaker ? 'Yes' : 'No',
          escapeCSV(app.applyingAs),
          escapeCSV(app.themePowerThoughts),
          escapeCSV(app.countryPowerIssue),
          escapeCSV(app.motivation),
          escapeCSV(app.financialSupportReason),
          escapeCSV(app.fullOrPartialFunding),
          app.dependents != null ? escapeCSV(app.dependents.toString()) : 'N/A',
          escapeCSV(app.familyIncome),
          escapeCSV(app.canParticipate),
          escapeCSV(app.countryTravelingFrom),
          escapeCSV(app.otherFundingInfo),
          escapeCSV(app.consentVisa),
          app.consentFlight ? 'Yes' : 'No',
          app.consentNorwegianLaw ? 'Yes' : 'No',
          app.consentReturn ? 'Yes' : 'No',
          app.consentPersonalDetails ? 'Yes' : 'No',
          app.consentAttendance ? 'Yes' : 'No',
          escapeCSV(app.consentMedia),
          app.createdAt ? new Date(app.createdAt).toLocaleDateString('en-GB') : 'N/A',
        ];
      }),
    ];
    const csvContent = csvRows.map((e) => e.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'applications.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  /*const downloadPDF = async (url: string | undefined) => {
    if (url) window.open(url);
  };*/

  return (
    <div className={styles.adminOuter}>
      <div
        className={styles.hamburgerMenu}
        onClick={!menuOpen ? toggleMenu : undefined}
      >
        {!menuOpen ? (
          <>
            <div className={styles.hamburgerIconContainer}>
              <div className={styles.hamburgerIcon}></div>
              <div className={styles.hamburgerIcon}></div>
              <div className={styles.hamburgerIcon}></div>
            </div>
          </>
        ) : (
          <div className={styles.hamburgerIconClose}>
            <img src={cross} className={styles.hamburgerCross} alt="Close menu" />
          </div>
        )}
      </div>
      <div ref={menuRef} className={`${styles.sideMenu} ${menuOpen ? styles.open : ''}`}>
        <Link to="/faq">FAQ</Link>
        <Link to="/homePage">HomePage</Link>
        {user?.role === ROLES.ADMIN && <Link to="/admin">Admin</Link>}
        {!user && <Link to="/login">Login</Link>}
        {user && <Button onClick={handleLogout}>Logout</Button>}
      </div>
      <div>
        <Header linkTo="/homepage" />
      </div>
      <div>
        <div className={styles.filterContainer}>
          <label>
            Start Date
            <input type="date" value={startDate} onChange={(e) => handleDateChange('startDate', e.target.value)} />
          </label>
          <label>
            End Date
            <input type="date" value={endDate} onChange={(e) => handleDateChange('endDate', e.target.value)} />
          </label>
        </div>
        <button onClick={exportToCSV}>Export to CSV</button>
        <h2>Applicants - ({numOfApplication})</h2>
        <div className={styles.tableContainer}>
          <table>
            <thead>
              <tr>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone number</th>
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
                <th>Applying As</th>
                <th className={styles.textareaTable}>Theme Power Thoughts</th>
                <th className={styles.textareaTable}>Country Power Issue</th>
                <th className={styles.textareaTable}>Motivation</th>
                <th className={styles.textareaTable}>Financial Support Reason</th>
                <th>Full or partial funding</th>
                <th>Dependents</th>
                <th>Family Income</th>
                <th>Can Participate</th>
                <th>Traveling to Trondheim from</th>
                <th className={styles.textareaTable}>Other funding info</th>
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
                  <td>{application.email}</td>
                  <td>{application.phoneNumber}</td>
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
                  <td>{application.applyingAs}</td>
                  <td className={styles.textareaTable}>{application.themePowerThoughts}</td>
                  <td className={styles.textareaTable}>{application.countryPowerIssue}</td>
                  <td className={styles.textareaTable}>{application.motivation}</td>
                  <td className={styles.textareaTable}>{application.financialSupportReason}</td>
                  <td>{application.fullOrPartialFunding}</td>
                  <td>{application.dependents}</td>
                  <td>{application.familyIncome}</td>
                  <td>{application.canParticipate}</td>
                  <td>{application.countryTravelingFrom}</td>
                  <td className={styles.textareaTable}>{application.otherFundingInfo}</td>
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
};

export default AdminPage;
