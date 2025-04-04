import axios from "axios";

//const API_URL = "/api/process"; // Cambiado de localhost a backend
const API_URL = "http://localhost:8080/api/process"; // prueba local

export const sendData = async (data) => {
    try {
        const response = await axios.post(API_URL, data);
        return response.data;
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};
