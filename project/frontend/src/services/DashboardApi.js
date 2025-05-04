import axios from './apiClient';

export const getCourses = async () => {
  return (await axios.get('/mock/courses.json')).data;
};

export const getTodoList = async () => {
  return (await axios.get('/mock/todo.json')).data;
};

export const getComingUpList = async () => {
  return (await axios.get('/mock/comingup.json')).data;
};
