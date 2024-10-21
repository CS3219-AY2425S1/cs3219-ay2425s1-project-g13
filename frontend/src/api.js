import axios from "axios";

// Instance for the Question Service
export const questionAPI = axios.create({
  baseURL: "http://localhost:8080/api",
});

// Instance for the User Service
export const userAPI = axios.create({
  baseURL: "http://localhost:8081/",
});