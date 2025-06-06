import axios from 'axios';
import { Project, ProjectFormData, ProjectTask } from '../types/projectTypes';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Project Service
 * 
 * EN: Service for interacting with the Project Management API.
 * Provides methods for CRUD operations on projects and related entities.
 * 
 * PT: Serviço para interação com a API de Gerenciamento de Projetos.
 * Fornece métodos para operações CRUD em projetos e entidades relacionadas.
 */

/**
 * EN: Fetch all projects
 * PT: Buscar todos os projetos
 * 
 * @returns EN: Promise with array of projects / PT: Promise com array de projetos
 */
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_URL}/projects`);
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw error;
  }
};

/**
 * EN: Fetch a project by ID
 * PT: Buscar um projeto por ID
 * 
 * @param id EN: Project ID / PT: ID do projeto
 * @returns EN: Promise with project data / PT: Promise com dados do projeto
 */
export const fetchProjectById = async (id: string): Promise<Project> => {
  try {
    const response = await axios.get(`${API_URL}/projects/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching project with ID ${id}:`, error);
    throw error;
  }
};

/**
 * EN: Create a new project
 * PT: Criar um novo projeto
 * 
 * @param project EN: Project data / PT: Dados do projeto
 * @returns EN: Promise with created project / PT: Promise com projeto criado
 */
export const createProject = async (project: ProjectFormData): Promise<Project> => {
  try {
    const response = await axios.post(`${API_URL}/projects`, project);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * EN: Update an existing project
 * PT: Atualizar um projeto existente
 * 
 * @param id EN: Project ID / PT: ID do projeto
 * @param project EN: Updated project data / PT: Dados atualizados do projeto
 * @returns EN: Promise with updated project / PT: Promise com projeto atualizado
 */
export const updateProject = async (id: string, project: ProjectFormData): Promise<Project> => {
  try {
    const response = await axios.put(`${API_URL}/projects/${id}`, project);
    return response.data;
  } catch (error) {
    console.error(`Error updating project with ID ${id}:`, error);
    throw error;
  }
};

/**
 * EN: Delete a project
 * PT: Excluir um projeto
 * 
 * @param id EN: Project ID / PT: ID do projeto
 * @returns EN: Promise with void / PT: Promise sem retorno
 */
export const deleteProject = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/projects/${id}`);
  } catch (error) {
    console.error(`Error deleting project with ID ${id}:`, error);
    throw error;
  }
};

/**
 * EN: Fetch projects by company
 * PT: Buscar projetos por empresa
 * 
 * @param companyId EN: Company ID / PT: ID da empresa
 * @returns EN: Promise with array of projects / PT: Promise com array de projetos
 */
export const fetchProjectsByCompany = async (companyId: string): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_URL}/projects/company/${companyId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for company ${companyId}:`, error);
    throw error;
  }
};

/**
 * EN: Fetch projects by manager
 * PT: Buscar projetos por gerente
 * 
 * @param managerId EN: Manager ID / PT: ID do gerente
 * @returns EN: Promise with array of projects / PT: Promise com array de projetos
 */
export const fetchProjectsByManager = async (managerId: string): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_URL}/projects/manager/${managerId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects for manager ${managerId}:`, error);
    throw error;
  }
};

/**
 * EN: Fetch projects by status
 * PT: Buscar projetos por status
 * 
 * @param status EN: Project status / PT: Status do projeto
 * @returns EN: Promise with array of projects / PT: Promise com array de projetos
 */
export const fetchProjectsByStatus = async (status: string): Promise<Project[]> => {
  try {
    const response = await axios.get(`${API_URL}/projects/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching projects with status ${status}:`, error);
    throw error;
  }
};
