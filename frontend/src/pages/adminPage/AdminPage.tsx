import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import axios from 'axios';
import { User } from '../../types/types';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');


  const token = JSON.parse(localStorage.getItem('authTokens') || '');


  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          startDate : startDate || undefined,
          endDate : endDate || undefined,
        }
      });

      const users = response.data; 
      console.log("Fetched users:", users);
      return users;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };

  useEffect(() => {
      const getUsers = async () => {
        const users = await fetchUsers();
        setUsers(users);
      }
      getUsers();
  }
  , [startDate, endDate]);



  const exportToCSV = () => {
    const csvRows = [
        ['First Name', 'Last Name', 'Email', 'Address', 'Date of Birth', 'Role', 'Country'],
        ...users.map(user => [user.firstName, user.lastName, user.email, user.address, user.dateBirth, user.role, user.country,
        ]) 
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + csvRows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

  return (
    <div className='adminOuter'>
      <div>
        <Header linkTo="/homepage" />
        <h1>Admin page</h1>
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
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Country</th>
                <th>Date of Birth</th>
                <th>Role</th>
                <th>Phone</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.email}</td>
                  <td>{user.country}</td>
                  <td>{new Date(user.dateBirth).toLocaleDateString()}</td>
                  <td>{user.role}</td>
                  <td>{user.phone}</td>
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