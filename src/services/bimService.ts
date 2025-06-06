import axios from 'axios';
import { BimFile, BimProcessingStats, BimErrorDetail } from '../types/bimTypes';

/**
 * BIM Service
 * 
 * EN: Service for interacting with the BIM Processing Microservice API.
 * Handles file uploads, retrievals, and processing operations.
 * 
 * PT: Serviço para interação com a API do Microserviço de Processamento BIM.
 * Gerencia uploads de arquivos, recuperações e operações de processamento.
 */

const API_URL = process.env.REACT_APP_BIM_API_URL || '/api/bim';

/**
 * EN: Upload a BIM file to the server
 * PT: Enviar um arquivo BIM para o servidor
 */
export const uploadBimFile = async (file: File, projectId: string): Promise<BimFile> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('projectId', projectId);
  
  const response = await axios.post(`${API_URL}/files/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  
  return response.data;
};

/**
 * EN: Get all BIM files for a project
 * PT: Obter todos os arquivos BIM de um projeto
 */
export const getBimFilesByProject = async (projectId: string): Promise<BimFile[]> => {
  const response = await axios.get(`${API_URL}/files/project/${projectId}`);
  return response.data;
};

/**
 * EN: Get a specific BIM file by ID
 * PT: Obter um arquivo BIM específico por ID
 */
export const getBimFileById = async (fileId: string): Promise<BimFile> => {
  const response = await axios.get(`${API_URL}/files/${fileId}`);
  return response.data;
};

/**
 * EN: Delete a BIM file
 * PT: Excluir um arquivo BIM
 */
export const deleteBimFile = async (fileId: string): Promise<void> => {
  await axios.delete(`${API_URL}/files/${fileId}`);
};

/**
 * EN: Get processing statistics for a project
 * PT: Obter estatísticas de processamento para um projeto
 */
export const getBimProcessingStats = async (projectId: string): Promise<BimProcessingStats> => {
  const response = await axios.get(`${API_URL}/stats/project/${projectId}`);
  return response.data;
};

/**
 * EN: Get error details for failed BIM files in a project
 * PT: Obter detalhes de erro para arquivos BIM com falha em um projeto
 */
export const getBimErrorsByProject = async (projectId: string): Promise<BimErrorDetail[]> => {
  const response = await axios.get(`${API_URL}/files/project/${projectId}/errors`);
  return response.data;
};

/**
 * EN: Get the URL for viewing a processed BIM file
 * PT: Obter a URL para visualizar um arquivo BIM processado
 */
export const getBimViewUrl = (fileId: string): string => {
  return `${API_URL}/files/${fileId}/view`;
};

/**
 * EN: Get the URL for downloading a BIM file
 * PT: Obter a URL para baixar um arquivo BIM
 */
export const getBimDownloadUrl = (fileId: string): string => {
  return `${API_URL}/files/${fileId}/download`;
};

/**
 * EN: Retry processing a failed BIM file
 * PT: Tentar novamente o processamento de um arquivo BIM com falha
 */
export const retryBimProcessing = async (fileId: string): Promise<BimFile> => {
  const response = await axios.post(`${API_URL}/files/${fileId}/retry`);
  return response.data;
};
