// src/services/authService.js
import axios from 'axios';

export const loginStudent = async (email, password) => {
  return axios.post('/auth/student/login', { email, password });
};

export const loginTeacher = async (email, password) => {
  return axios.post('/auth/teacher/login', { email, password });
};

export const loginAdmin = async (email, password) => {
  return axios.post('/admin/login', { email, password });
};

export const logoutStudent = async () => {
  return axios.post('/auth/student/logout');
};

export const logoutTeacher = async () => {
  return axios.post('/auth/teacher/logout');
};

export const logoutAdmin = async () => {
  return axios.post('/admin/logout');
};
