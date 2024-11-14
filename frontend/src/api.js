import axios from "axios";

// Instance for the Question Service
export const questionAPI = axios.create({
  baseURL: import.meta.env.VITE_QUESTION_URL,
});

// Instance for the User Service
export const userAPI = axios.create({
  baseURL: import.meta.env.VITE_USER_URL,
});