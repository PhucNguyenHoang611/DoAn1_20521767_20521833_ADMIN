import axios from 'axios';

export const mainApi = axios.create({
    baseURL: "http://localhost:5000/api",
});