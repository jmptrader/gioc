import axios from "axios";

const API_URL = "/api/process"; // Cambiado de localhost a backend
const API_URL_A = "/api/errorsA";
const API_URL_B = "/api/errorsB";
const API_URL_C = "/api/errorsC";
//const API_URL = "http://localhost:8080/api/process"; // prueba local

export const sendData = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};


export const sendDataErrores1 = async (data) => {
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

export const sendDataErrores2 = async (data) => {
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

export const sendDataErrores3 = async (data) => {
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