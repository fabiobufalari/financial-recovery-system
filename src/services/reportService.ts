import { apiClient } from "./apiClient";
// Import ReportType from enums
import { ReportType } from "../types/enums"; 
import { Report, ReportCreateDTO, ReportUpdateDTO } from "../types/reportTypes"; // Assuming types are defined here
import { Template, TemplateCreateDTO } from "../types/templateTypes"; // Assuming types are defined here

const BASE_URL = "/api/reports"; // Adjust if the backend service runs on a different base URL
const TEMPLATE_URL = "/api/templates";

// --- Report Management ---

export const getReports = async (page: number = 0, size: number = 10): Promise<any> => {
    const response = await apiClient.get(`${BASE_URL}?page=${page}&size=${size}`);
    return response.data;
};

export const getReportById = async (id: string): Promise<Report> => {
    const response = await apiClient.get(`${BASE_URL}/${id}`);
    return response.data;
};

export const createReport = async (reportData: ReportCreateDTO): Promise<Report> => {
    const response = await apiClient.post(BASE_URL, reportData);
    return response.data;
};

export const updateReport = async (id: string, reportData: ReportUpdateDTO): Promise<Report> => {
    const response = await apiClient.put(`${BASE_URL}/${id}`, reportData);
    return response.data;
};

export const deleteReport = async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE_URL}/${id}`);
};

export const getReportsByType = async (type: ReportType): Promise<Report[]> => {
    const response = await apiClient.get(`${BASE_URL}/type/${type}`);
    return response.data;
};

// Add other report search/filter functions as needed (getClientReports, getProjectReports, searchReports, updateStatus, getPublicReport)

// --- Report Generation ---

export const generateReport = async (generationData: any): Promise<any> => { // Define ReportGenerationDTO type
    const response = await apiClient.post(`${BASE_URL}/generate`, generationData);
    return response.data; // Might return status or report ID
};

export const downloadReport = async (id: string): Promise<Blob> => {
    const response = await apiClient.get(`${BASE_URL}/generate/${id}/download`, {
        responseType: "blob",
    });
    return response.data;
};

// --- Template Management ---

export const getTemplates = async (page: number = 0, size: number = 10): Promise<any> => {
    const response = await apiClient.get(`${TEMPLATE_URL}?page=${page}&size=${size}`);
    return response.data;
};

export const getTemplateById = async (id: string): Promise<Template> => {
    const response = await apiClient.get(`${TEMPLATE_URL}/${id}`);
    return response.data;
};

export const createTemplate = async (templateData: TemplateCreateDTO): Promise<Template> => {
    const response = await apiClient.post(TEMPLATE_URL, templateData);
    return response.data;
};

export const updateTemplate = async (id: string, templateData: any): Promise<Template> => { // Define TemplateUpdateDTO type
    const response = await apiClient.put(`${TEMPLATE_URL}/${id}`, templateData);
    return response.data;
};

export const deleteTemplate = async (id: string): Promise<void> => {
    await apiClient.delete(`${TEMPLATE_URL}/${id}`);
};

// Add other template functions as needed (getTemplatesByType, getActiveTemplates etc.)

const reportService = {
    getReports,
    getReportById,
    createReport,
    updateReport,
    deleteReport,
    getReportsByType,
    generateReport,
    downloadReport,
    getTemplates,
    getTemplateById,
    createTemplate,
    updateTemplate,
    deleteTemplate,
};

export default reportService;

