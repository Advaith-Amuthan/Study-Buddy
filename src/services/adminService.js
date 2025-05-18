// src/services/adminService.js
import axios from 'axios';

export const registerStudent = async (studentData) => {
  return axios.post('/admin/register-student', studentData);
};

export const registerTeacher = async (teacherData) => {
  return axios.post('/admin/register-teacher', teacherData);
};

export const addSubject = async (subjectData) => {
  return axios.post('/admin/subjects', subjectData);
};

export const addChapter = async (subjectId, chapterData) => {
  return axios.post(`/admin/subjects/${subjectId}/chapters`, chapterData);
};

export const getTeachers = async () => {
  return axios.get('/admin/teachers');
};

export const getStudents = async () => {
  return axios.get('/admin/students');
};

export const getSubjects = async () => {
  return axios.get('/admin/subjects');
};
