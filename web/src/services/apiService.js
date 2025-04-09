import axios from "axios";


//const API = "http://localhost:8080"; // Cambiado de localhost a backend
const API = ""; // para docker

const API_URL = `${API}/api/process`; // Cambiado de localhost a backend
const API_URL_A = `${API}/api/errorsA`;
const API_URL_B = `${API}/api/errorsB`;
const API_URL_C = `${API}/api/errorsC`;
const API_URL_D = `${API}/api/errorsD`;

export const sendData = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};

export const sendDataErrores0 = async (data) => {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.post(API_URL_A, data);
            resolve(response.data)
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error;
        }
    });
};

export const sendDataErrores1 = async (data) => {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.post(API_URL_B, data);
            resolve(response.data)
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error;
        }
    });
};

export const sendDataErrores2 = async (data) => {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.post(API_URL_C, data);
            resolve(response.data)
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error;
        }
    });
};

export const sendDataErrores3 = async (data) => {
    return new Promise(async (resolve) => {
        try {
            const response = await axios.post(API_URL_D, data);
            resolve(response.data)
        } catch (error) {
            console.error("Error en la solicitud:", error);
            throw error;
        }
    });
};