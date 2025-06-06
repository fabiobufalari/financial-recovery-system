import { Company, CompanyFormData } from '../types/companyTypes';
import apiClient from './apiClient';

/**
 * Company Service
 * 
 * EN: This service provides methods for interacting with the company API endpoints,
 * including retrieving, creating, updating, and deleting company records.
 * 
 * PT: Este serviço fornece métodos para interagir com os endpoints da API de empresas,
 * incluindo recuperação, criação, atualização e exclusão de registros de empresas.
 */

const BASE_URL = '/api/v1/companies';

export const companyService = {
  /**
   * Get all companies
   * 
   * EN: Retrieves a list of all companies from the API.
   * PT: Recupera uma lista de todas as empresas da API.
   * 
   * @returns Promise resolving to an array of Company objects
   */
  getAllCompanies: async (): Promise<Company[]> => {
    const response = await apiClient.get(BASE_URL);
    return response.data;
  },

  /**
   * Get company by ID
   * 
   * EN: Retrieves a specific company by its unique identifier.
   * PT: Recupera uma empresa específica pelo seu identificador único.
   * 
   * @param id - The unique identifier of the company
   * @returns Promise resolving to a Company object
   */
  getCompanyById: async (id: string): Promise<Company> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  /**
   * Create a new company
   * 
   * EN: Creates a new company record with the provided data.
   * PT: Cria um novo registro de empresa com os dados fornecidos.
   * 
   * @param company - The company data to create
   * @returns Promise resolving to the created Company object
   */
  createCompany: async (company: CompanyFormData): Promise<Company> => {
    const response = await apiClient.post(BASE_URL, company);
    return response.data;
  },

  /**
   * Update an existing company
   * 
   * EN: Updates an existing company record with the provided data.
   * PT: Atualiza um registro de empresa existente com os dados fornecidos.
   * 
   * @param id - The unique identifier of the company to update
   * @param company - The updated company data
   * @returns Promise resolving to the updated Company object
   */
  updateCompany: async (id: string, company: CompanyFormData): Promise<Company> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, company);
    return response.data;
  },

  /**
   * Delete a company
   * 
   * EN: Deletes a company record with the specified ID.
   * PT: Exclui um registro de empresa com o ID especificado.
   * 
   * @param id - The unique identifier of the company to delete
   * @returns Promise resolving when deletion is complete
   */
  deleteCompany: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
  }
};

export default companyService;
