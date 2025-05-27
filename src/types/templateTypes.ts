import { ReportType, ReportFormat } from "./enums"; // Assuming enums are defined here

export interface Template {
    id: string;
    name: string;
    description?: string;
    type: ReportType;
    templatePath?: string;
    templateContent?: string; // Base64 encoded or similar
    defaultFormat?: ReportFormat;
    systemTemplate: boolean;
    active: boolean;
    version?: number;
    createdAt: string; // ISO Date string
    createdBy?: string;
    updatedAt?: string; // ISO Date string
    updatedBy?: string;
    // Add parameters definition if templates have associated parameters
}

export interface TemplateCreateDTO {
    name: string;
    description?: string;
    type: ReportType;
    templatePath?: string;
    templateContent?: string;
    defaultFormat?: ReportFormat;
    systemTemplate?: boolean;
    active?: boolean;
    version?: number;
}

// Define TemplateUpdateDTO if needed

