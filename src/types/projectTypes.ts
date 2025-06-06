export interface Project {
  /**
   * EN: Unique identifier for the project
   * PT: Identificador único para o projeto
   */
  id: string;
  
  /**
   * EN: Name of the project
   * PT: Nome do projeto
   */
  name: string;
  
  /**
   * EN: Detailed description of the project
   * PT: Descrição detalhada do projeto
   */
  description?: string;
  
  /**
   * EN: Current status of the project
   * PT: Status atual do projeto
   * 
   * Values: planning, in_progress, on_hold, completed, cancelled
   */
  status?: string;
  
  /**
   * EN: Date when the project started
   * PT: Data de início do projeto
   */
  startDate?: string;
  
  /**
   * EN: Estimated completion date of the project
   * PT: Data estimada de conclusão do projeto
   */
  estimatedEndDate?: string;
  
  /**
   * EN: Actual completion date of the project
   * PT: Data real de conclusão do projeto
   */
  actualEndDate?: string;
  
  /**
   * EN: Total budget allocated for the project
   * PT: Orçamento total alocado para o projeto
   */
  budget?: number;
  
  /**
   * EN: Current completion percentage of the project
   * PT: Percentual atual de conclusão do projeto
   */
  completionPercentage?: number;
  
  /**
   * EN: Physical location of the project
   * PT: Localização física do projeto
   */
  location?: string;
  
  /**
   * EN: ID of the company associated with the project
   * PT: ID da empresa associada ao projeto
   */
  companyId?: string;
  
  /**
   * EN: ID of the project manager
   * PT: ID do gerente do projeto
   */
  managerId?: string;
  
  /**
   * EN: Date when the project record was created
   * PT: Data em que o registro do projeto foi criado
   */
  createdAt?: string;
  
  /**
   * EN: Date when the project record was last updated
   * PT: Data em que o registro do projeto foi atualizado pela última vez
   */
  updatedAt?: string;
}

/**
 * EN: Interface for project task data
 * PT: Interface para dados de tarefas do projeto
 */
export interface ProjectTask {
  /**
   * EN: Unique identifier for the task
   * PT: Identificador único para a tarefa
   */
  id: string;
  
  /**
   * EN: Name of the task
   * PT: Nome da tarefa
   */
  name: string;
  
  /**
   * EN: Detailed description of the task
   * PT: Descrição detalhada da tarefa
   */
  description?: string;
  
  /**
   * EN: Current status of the task
   * PT: Status atual da tarefa
   * 
   * Values: not_started, in_progress, completed, blocked
   */
  status?: string;
  
  /**
   * EN: Priority level of the task
   * PT: Nível de prioridade da tarefa
   * 
   * Values: low, medium, high, critical
   */
  priority?: string;
  
  /**
   * EN: Due date for the task
   * PT: Data de vencimento da tarefa
   */
  dueDate?: string;
  
  /**
   * EN: ID of the project this task belongs to
   * PT: ID do projeto ao qual esta tarefa pertence
   */
  projectId: string;
  
  /**
   * EN: ID of the person assigned to this task
   * PT: ID da pessoa designada para esta tarefa
   */
  assignedToId?: string;
  
  /**
   * EN: Name of the person assigned to this task (for display purposes)
   * PT: Nome da pessoa designada para esta tarefa (para fins de exibição)
   */
  assignedToName?: string;
  
  /**
   * EN: Estimated hours to complete the task
   * PT: Horas estimadas para concluir a tarefa
   */
  estimatedHours?: number;
  
  /**
   * EN: Actual hours spent on the task
   * PT: Horas reais gastas na tarefa
   */
  actualHours?: number;
  
  /**
   * EN: Date when the task record was created
   * PT: Data em que o registro da tarefa foi criado
   */
  createdAt?: string;
  
  /**
   * EN: Date when the task record was last updated
   * PT: Data em que o registro da tarefa foi atualizado pela última vez
   */
  updatedAt?: string;
}

/**
 * EN: Interface for project form data
 * PT: Interface para dados do formulário de projeto
 */
export interface ProjectFormData {
  name: string;
  description?: string;
  status?: string;
  startDate?: string;
  estimatedEndDate?: string;
  budget?: number;
  completionPercentage?: number;
  location?: string;
  companyId?: string;
  managerId?: string;
}

/**
 * EN: Interface for project task form data
 * PT: Interface para dados do formulário de tarefa de projeto
 */
export interface ProjectTaskFormData {
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
  projectId: string;
  assignedToId?: string;
  estimatedHours?: number;
  actualHours?: number;
}
