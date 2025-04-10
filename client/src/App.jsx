const API = import.meta.env.VITE_API_URL;
import { useEffect, useState } from "react";
import axios from "axios";
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({ name: "", reg_no: "", dept: "", year: "", mail: "" });

  // Fetch all users
  useEffect(() => {
    getAllUsers();
}, []);

  const getAllUsers = () => {
    // axios.get("http://localhost:8000/users"),
    axios.get(`${API}/users`)
        .then(response => {
            console.log("Fetched Users:", response.data);  // Debugging log
            setUsers(response.data);
            setFilteredUsers(response.data); // Update UI
        })
        .catch(error => console.error("Error fetching users:", error));
};

  // Search function
  const handleSearchChange = (e) => {
    const searchText = e.target.value.toLowerCase();
    const filtered = users.filter((user) =>
      user.name.toLowerCase().includes(searchText) ||
      user.reg_no.toLowerCase().includes(searchText) ||
      user.dept.toLowerCase().includes(searchText) ||
      user.mail.toLowerCase().includes(searchText)
    );
    setFilteredUsers(filtered);
  };

  // Delete user function
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this user?");
    if (isConfirmed) {
      try {
        await axios.delete(`${API}/users/${id}`);
        getAllUsers();
      } catch (error) {
        console.error("Error deleting user:", error);
        alert("Failed to delete user.");
      }
    }
  }
  // Open modal for editing
  const handleEdit = (user) => {
    console.log("Editing User:", user);  // ✅ Debugging
    setUserData({ ...user, id: user.id }); // Ensure ID is set
    setIsModalOpen(true);
};



  // Open modal for inserting new user
  const handleInsert = () => {
    setUserData({ name: "", reg_no: "", dept: "", year: "", mail: "" });
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle input changes
  const handleData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Submit form (Insert/Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Data:", userData); // ✅ Debug Log

    try {
        if (userData.id) {
            console.log(`Updating user with ID: ${userData.id}`);  // ✅ Debug Log
            await axios.patch(`${API}/users/${userData.id}`, userData);

        } else {
            console.log("Inserting new user..."); // ✅ Debug Log
            await axios.post(`${API}/users`, userData);

        }

        setUserData({ name: "", reg_no: "", dept: "", year: "", mail: "" });
        setIsModalOpen(false);
        getAllUsers();  // ✅ Refresh user list

    } catch (error) {
        console.error("❌ Error submitting user data:", error.response ? error.response.data : error.message);
        alert("Failed to submit data. Check console for errors.");
    }
};




  return (
    <>
      <div className='container'>
        <h3>CRUD Application using React.js Frontend and Node.js Backend</h3>
        <div className='input-search'>
          <input type="search" placeholder="Search..." onChange={handleSearchChange} />
          <button className='btn-insert' onClick={handleInsert}>Insert</button>
        </div>
        <div className="main">
          <table className='table'>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Reg_no</th>
                <th>Department</th>
                <th>Year</th>
                <th>Mail_id</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr key={user.id}>
                  <td>{index + 1}</td>
                  <td>{user.name}</td>
                  <td>{user.reg_no}</td>
                  <td>{user.dept}</td>
                  <td>{user.year}</td>
                  <td>{user.mail}</td>
                  <td><button className='btn-green' onClick={() => handleEdit(user)}>Edit</button></td>
                  <td><button className='btn-red' onClick={() => handleDelete(user.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>{userData.id ? "Edit User" : "Add User"}</h2>
                <div className="input-group">
                  <label>Name</label>
                  <input type="text" name="name" value={userData.name} onChange={handleData} required />

                  <label>Reg No</label>
                  <input type="text" name="reg_no" value={userData.reg_no} onChange={handleData} required />

                  <label>Department</label>
                  <input type="text" name="dept" value={userData.dept} onChange={handleData} required />

                  <label>Year</label>
                  <input type="number" name="year" value={userData.year} onChange={handleData} required />

                  <label>Mail</label>
                  <input type="email" name="mail" value={userData.mail} onChange={handleData} required />

                  <button className="btn-submit" onClick={handleSubmit}>
                    {userData.id ? "Update" : "Submit"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
export default App;