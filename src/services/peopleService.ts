import { Person, PersonFormData } from '../types/peopleTypes';
import apiClient from './apiClient';

/**
 * People Service
 * 
 * EN: This service provides methods for interacting with the people API endpoints,
 * including retrieving, creating, updating, and deleting person records.
 * 
 * PT: Este serviço fornece métodos para interagir com os endpoints da API de pessoas,
 * incluindo recuperação, criação, atualização e exclusão de registros de pessoas.
 */

const BASE_URL = '/api/v1/people';

export const peopleService = {
  /**
   * Get all people
   * 
   * EN: Retrieves a list of all people from the API.
   * PT: Recupera uma lista de todas as pessoas da API.
   * 
   * @returns Promise resolving to an array of Person objects
   */
  getAllPeople: async (): Promise<Person[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  /**
   * Get person by ID
   * 
   * EN: Retrieves a specific person by their unique identifier.
   * PT: Recupera uma pessoa específica pelo seu identificador único.
   * 
   * @param id - The unique identifier of the person
   * @returns Promise resolving to a Person object
   */
  getPersonById: async (id: string): Promise<Person> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new person
   * 
   * EN: Creates a new person record with the provided data.
   * PT: Cria um novo registro de pessoa com os dados fornecidos.
   * 
   * @param person - The person data to create
   * @returns Promise resolving to the created Person object
   */
  createPerson: async (person: PersonFormData): Promise<Person> => {
    const response = await apiClient.post(BASE_URL, person);
    return response.data;
  },

  /**
   * Update an existing person
   * 
   * EN: Updates an existing person record with the provided data.
   * PT: Atualiza um registro de pessoa existente com os dados fornecidos.
   * 
   * @param id - The unique identifier of the person to update
   * @param person - The updated person data
   * @returns Promise resolving to the updated Person object
   */
  updatePerson: async (id: string, person: PersonFormData): Promise<Person> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, person);
    return response.data;
  },

  /**
   * Delete a person
   * 
   * EN: Deletes a person record with the specified ID.
   * PT: Exclui um registro de pessoa com o ID especificado.
   * 
   * @param id - The unique identifier of the person to delete
   * @returns Promise resolving when deletion is complete
   */
  deletePerson: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  }
};

export default peopleService;
