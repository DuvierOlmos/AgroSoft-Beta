// features/users/services/userService.js
import axios from "axios";
const API_URL = "http://localhost:4000/api/pqrs"; 

//  ver 
export async function getPqrs(search = "") {
  let url = API_URL;
  if (search) {
    url += `?search=${encodeURIComponent(search)}`;
  }
  const response = await fetch(url);
  if (!response.ok) throw new Error("Error al obtener pqrs");
  const data = await response.json();
  return data.data; // Retornamos el array que está dentro de la propiedad data
}

//  Actualizar 
export const updatePqrs = async (id, pqrs) => {
    
    const alertIdentifier = pqrs.id_estado_pqrs || `ID ${id}`;     
    try { 
        const response = await axios.put(`${API_URL}/${id}`, pqrs); 
        alert(` PQRS ${alertIdentifier} respondida/actualizada con éxito.`); 
        return response.data;

    } catch (error) {         
        let errorMessage = "Ocurrió un error inesperado al intentar actualizar la PQRS.";    
        if (error.response) {
            const status = error.response.status;          
            if (status === 404) {
                errorMessage = `PQRS con ID ${id} no encontrada en el servidor.`;
            }else if (status === 400) {          
                errorMessage = error.response.data.message || 'Datos inválidos. Verifica el estado o la respuesta.';
            }             
            else {
                errorMessage = error.response.data.message || 
                 `Fallo del servidor (Status: ${status}).`;
            }            
        }     
        else if (error.request) { 
            errorMessage = "No se pudo conectar al servidor. Verifique que la API esté activa y el puerto sea correcto.";
        }     
        alert(` Error al responder la PQRS ${alertIdentifier}: ${errorMessage}`); 
       
        throw new Error(errorMessage);
    }
};
