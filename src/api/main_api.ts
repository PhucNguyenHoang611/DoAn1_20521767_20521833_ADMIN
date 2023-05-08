import axios from 'axios';

export const mainApi = axios.create({
    baseURL: "https://nguyenshomefurniture-be.onrender.com/api"    //"http://localhost:5000/api"
});