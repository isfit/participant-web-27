import Header from '../../components/Header/Header';

function AdminPage() {
  console.log('Welcome to the admin page');
  return (
    <div>
      <Header linkTo="/homepage" />
      <h1>Welcome to the admin page</h1>
    </div>
  );
}

export default AdminPage;