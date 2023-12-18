import axios from 'axios';

export const mainApi = axios.create({
    baseURL: "https://nguyenshomefurniture-be.onrender.com/api"    // "https://nguyenshomefurniture-be.onrender.com/api" "http://localhost:5000/api"
});

export const baseURL = "https://nguyenshomefurniture-be.onrender.com/api";
export const hostURL = "https://nguyenshomefurniture-be.onrender.com"