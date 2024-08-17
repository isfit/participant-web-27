import { useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import axios from 'axios';
import { User } from '../../types/types';
import './AdminPage.css';

const AdminPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  //remove quotes from token to get rid of the error
  const token = JSON.parse(localStorage.getItem('authTokens') || '');

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
          const data = await fetchUsers();
          setUsers(data);
  }
  getUsers();
  }, []);


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