import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './adminhome';
import './UserManagement.css';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({ username: '', email: '', role: '', password: '' });
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({ username: '', email: '', role: '', password: '' });
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8080/login');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users', error);
      }
    };

    fetchUsers();
  }, []);

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:8080/login/${userId}`);
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user', error);
    }
  };

  const addUser = async () => {
    try {
      const response = await axios.post('http://localhost:8080/login', newUser);
      setUsers([...users, response.data.login]);
      setNewUser({ username: '', email: '', role: '', password: '' });
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding user', error);
    }
  };

  const updateUser = async () => {
    try {
      await axios.put(`http://localhost:8080/login/${editingUser.id}`, editForm);
      setUsers(users.map(user => (user.id === editingUser.id ? { ...user, ...editForm } : user)));
      setEditingUser(null);
      setEditForm({ username: '', email: '', role: '', password: '' });
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user', error);
    }
  };

  return (
    <Layout>
      <div className="header-container">
        <h1>Manage Users</h1>
        <button onClick={() => setShowAddModal(true)} className="open-modal-button">Add User</button>
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Add User</h2>
            <input
              type="text"
              placeholder="Username"
              value={newUser.username}
              onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
            />
            <button onClick={addUser}>Add User</button>
            <button onClick={() => setShowAddModal(false)} className="close-modal-button">Close</button>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2>Edit User</h2>
            <input
              type="text"
              placeholder="Username"
              value={editForm.username}
              onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              value={editForm.email}
              onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="Role"
              value={editForm.role}
              onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              value={editForm.password}
              onChange={(e) => setEditForm({ ...editForm, password: e.target.value })}
            />
            <button onClick={updateUser}>Update User</button>
            <button onClick={() => setShowEditModal(false)} className="close-modal-button">Close</button>
          </div>
        </div>
      )}

      <table className="user-table">
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button 
                    className="edit-button" 
                    onClick={() => { 
                      setEditingUser(user); 
                      setEditForm({ username: user.username, email: user.email, role: user.role, password: '' }); 
                      setShowEditModal(true);
                    }}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => deleteUser(user.id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No users found</td>
            </tr>
          )}
        </tbody>
      </table>
    </Layout>
  );
};

export default UserManagement;
