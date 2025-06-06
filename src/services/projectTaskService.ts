import axios from 'axios';
import { ProjectTask, ProjectTaskFormData } from '../types/projectTypes';

// API base URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

/**
 * Project Task Service
 * 
 * EN: Service for interacting with the Project Task Management API.
 * Provides methods for CRUD operations on project tasks.
 * 
 * PT: Serviço para interação com a API de Gerenciamento de Tarefas de Projeto.
 * Fornece métodos para operações CRUD em tarefas de projeto.
 */

/**
 * EN: Fetch all tasks
 * PT: Buscar todas as tarefas
 * 
 * @returns EN: Promise with array of tasks / PT: Promise com array de tarefas
 */
export const fetchTasks = async (): Promise<ProjectTask[]> => {
  try {
    const response = await axios.get(`${API_URL}/tasks`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
};

/**
 * EN: Fetch tasks by project
 * PT: Buscar tarefas por projeto
 * 
 * @param projectId EN: Project ID / PT: ID do projeto
 * @returns EN: Promise with array of tasks / PT: Promise com array de tarefas
 */
export const fetchTasksByProject = async (projectId: string): Promise<ProjectTask[]> => {
  try {
    const response = await axios.get(`${API_URL}/tasks/project/${projectId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId}:`, error);
    throw error;
  }
};

/**
 * EN: Fetch a task by ID
 * PT: Buscar uma tarefa por ID
 * 
 * @param id EN: Task ID / PT: ID da tarefa
 * @returns EN: Promise with task data / PT: Promise com dados da tarefa
 */
export const fetchTaskById = async (id: string): Promise<ProjectTask> => {
  try {
    const response = await axios.get(`${API_URL}/tasks/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw error;
  }
};

/**
 * EN: Create a new task
 * PT: Criar uma nova tarefa
 * 
 * @param task EN: Task data / PT: Dados da tarefa
 * @returns EN: Promise with created task / PT: Promise com tarefa criada
 */
export const createTask = async (task: ProjectTaskFormData): Promise<ProjectTask> => {
  try {
    const response = await axios.post(`${API_URL}/tasks`, task);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
};

/**
 * EN: Update an existing task
 * PT: Atualizar uma tarefa existente
 * 
 * @param id EN: Task ID / PT: ID da tarefa
 * @param task EN: Updated task data / PT: Dados atualizados da tarefa
 * @returns EN: Promise with updated task / PT: Promise com tarefa atualizada
 */
export const updateTask = async (id: string, task: ProjectTaskFormData): Promise<ProjectTask> => {
  try {
    const response = await axios.put(`${API_URL}/tasks/${id}`, task);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw error;
  }
};

/**
 * EN: Delete a task
 * PT: Excluir uma tarefa
 * 
 * @param id EN: Task ID / PT: ID da tarefa
 * @returns EN: Promise with void / PT: Promise sem retorno
 */
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/tasks/${id}`);
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw error;
  }
};

/**
 * EN: Fetch tasks by assignee
 * PT: Buscar tarefas por responsável
 * 
 * @param assigneeId EN: Assignee ID / PT: ID do responsável
 * @returns EN: Promise with array of tasks / PT: Promise com array de tarefas
 */
export const fetchTasksByAssignee = async (assigneeId: string): Promise<ProjectTask[]> => {
  try {
    const response = await axios.get(`${API_URL}/tasks/assignee/${assigneeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for assignee ${assigneeId}:`, error);
    throw error;
  }
};

/**
 * EN: Fetch tasks by status
 * PT: Buscar tarefas por status
 * 
 * @param status EN: Task status / PT: Status da tarefa
 * @returns EN: Promise with array of tasks / PT: Promise com array de tarefas
 */
export const fetchTasksByStatus = async (status: string): Promise<ProjectTask[]> => {
  try {
    const response = await axios.get(`${API_URL}/tasks/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks with status ${status}:`, error);
    throw error;
  }
};

/**
 * EN: Fetch tasks by project and status
 * PT: Buscar tarefas por projeto e status
 * 
 * @param projectId EN: Project ID / PT: ID do projeto
 * @param status EN: Task status / PT: Status da tarefa
 * @returns EN: Promise with array of tasks / PT: Promise com array de tarefas
 */
export const fetchTasksByProjectAndStatus = async (projectId: string, status: string): Promise<ProjectTask[]> => {
  try {
    const response = await axios.get(`${API_URL}/tasks/project/${projectId}/status/${status}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for project ${projectId} with status ${status}:`, error);
    throw error;
  }
};
