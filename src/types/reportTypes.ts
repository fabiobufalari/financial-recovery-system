import { ReportType, ReportFormat, ParameterType } from "./enums"; // Assuming enums are defined here

// Exporting interfaces and types
export interface ReportParameter {
    id?: string;
    name: string;
    displayName?: string;
    description?: string;
    type: ParameterType;
    defaultValue?: string;
    value?: string; // Value used during generation
    required: boolean;
    validationRegex?: string;
    validationMessage?: string;
    listValues?: string[];
    minValue?: number;
    maxValue?: number;
    displayOrder?: number;
}

export interface Report {
    id: string;
    name: string;
    description?: string;
    type: ReportType;
    format?: ReportFormat;
    startDate?: string; // ISO Date string
    endDate?: string; // ISO Date string
    filePath?: string;
    fileSize?: number;
    scheduled: boolean;
    scheduleCron?: string;
    lastGenerated?: string; // ISO Date string
    nextGeneration?: string; // ISO Date string
    totalAmount?: number;
    currencyCode?: string;
    projectId?: string;
    clientId?: string;
    isPublic: boolean;
    status?: string; // e.g., PENDING, GENERATING, COMPLETED, FAILED
    createdAt: string; // ISO Date string
    createdBy?: string;
    updatedAt?: string; // ISO Date string
    updatedBy?: string;
    templateId?: string;
    templateName?: string;
    parameters?: ReportParameter[];
}

export interface ReportCreateDTO {
    name: string;
    description?: string;
    type: ReportType;
    format?: ReportFormat;
    startDate?: string; // ISO Date string
    endDate?: string; // ISO Date string
    scheduled?: boolean;
    scheduleCron?: string;
    totalAmount?: number;
    currencyCode?: string;
    templateId?: string;
    projectId?: string;
    clientId?: string;
    isPublic?: boolean;
    parameters?: ReportParameterDTO[]; // Use DTO for creation
}

export interface ReportUpdateDTO {
    name?: string;
    description?: string;
    type?: ReportType;
    format?: ReportFormat;
    startDate?: string; // ISO Date string
    endDate?: string; // ISO Date string
    scheduled?: boolean;
    scheduleCron?: string;
    totalAmount?: number;
    currencyCode?: string;
    templateId?: string;
    projectId?: string;
    clientId?: string;
    isPublic?: boolean;
    parameters?: ReportParameterDTO[]; // Use DTO for update
}

// DTO for parameters might be slightly different if needed for creation/update
export interface ReportParameterDTO {
    name: string;
    value: string; // Only value might be needed for generation/update
    // Include other fields if needed for parameter definition within report creation/update
    displayName?: string;
    description?: string;
    type?: ParameterType;
    defaultValue?: string;
    required?: boolean;
    validationRegex?: string;
    validationMessage?: string;
    listValues?: string[];
    minValue?: number;
    maxValue?: number;
    displayOrder?: number;
}

export interface ReportGenerationDTO {
    reportId?: string; // Generate existing report
    templateId?: string; // Generate using a template
    name?: string; // Name for ad-hoc report
    type?: ReportType; // Type for ad-hoc report
    format: ReportFormat;
    parameters: { [key: string]: any }; // Key-value pairs for parameters
    // Add other relevant fields like startDate, endDate if needed for ad-hoc generation
}

