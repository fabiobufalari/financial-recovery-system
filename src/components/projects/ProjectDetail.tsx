import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Spinner, Table, Button } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { Project } from '../../types/projectTypes';
import { fetchProjectById } from '../../services/projectService';
import { fetchCompanyById } from '../../services/companyService';
import { fetchPersonById } from '../../services/peopleService';
import { fetchTasksByProject } from '../../services/projectTaskService';
import { Company } from '../../types/companyTypes';
import { Person } from '../../types/peopleTypes';
import { ProjectTask } from '../../types/projectTypes';
import { FaEdit, FaTasks, FaArrowLeft } from 'react-icons/fa';
import './ProjectDetail.css';

/**
 * Project Detail Component
 * 
 * EN: Displays detailed information about a specific construction project.
 * Shows project metadata, progress, tasks, and related entities.
 * 
 * PT: Exibe informações detalhadas sobre um projeto de construção específico.
 * Mostra metadados do projeto, progresso, tarefas e entidades relacionadas.
 */
const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // State variables
  const [project, setProject] = useState<Project | null>(null);
  const [company, setCompany] = useState<Company | null>(null);
  const [manager, setManager] = useState<Person | null>(null);
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * EN: Load project and related data on component mount
   * PT: Carregar projeto e dados relacionados ao montar o componente
   */
  useEffect(() => {
    const loadProjectData = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const projectData = await fetchProjectById(id);
        setProject(projectData);
        
        // Load related entities
        if (projectData.companyId) {
          const companyData = await fetchCompanyById(projectData.companyId);
          setCompany(companyData);
        }
        
        if (projectData.managerId) {
          const managerData = await fetchPersonById(projectData.managerId);
          setManager(managerData);
        }
        
        // Load project tasks
        const tasksData = await fetchTasksByProject(id);
        setTasks(tasksData);
        
        setError(null);
      } catch (err) {
        console.error('Error loading project data:', err);
        setError('Failed to load project details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProjectData();
  }, [id]);

  /**
   * EN: Get status badge color based on project status
   * PT: Obter cor do badge com base no status do projeto
   */
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'planning':
        return 'primary';
      case 'in_progress':
        return 'warning';
      case 'completed':
        return 'success';
      case 'on_hold':
        return 'secondary';
      case 'cancelled':
        return 'danger';
      default:
        return 'info';
    }
  };

  /**
   * EN: Format date for display
   * PT: Formatar data para exibição
   */
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  /**
   * EN: Format currency for display
   * PT: Formatar moeda para exibição
   */
  const formatCurrency = (amount: number | undefined) => {
    if (amount === undefined) return '-';
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD'
    }).format(amount);
  };

  /**
   * EN: Calculate days remaining until estimated end date
   * PT: Calcular dias restantes até a data estimada de término
   */
  const getDaysRemaining = (estimatedEndDate: string | undefined) => {
    if (!estimatedEndDate) return null;
    
    const today = new Date();
    const endDate = new Date(estimatedEndDate);
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  };

  /**
   * EN: Get task status counts for summary
   * PT: Obter contagens de status de tarefas para resumo
   */
  const getTaskStatusCounts = () => {
    const counts = {
      total: tasks.length,
      completed: 0,
      inProgress: 0,
      notStarted: 0
    };
    
    tasks.forEach(task => {
      if (task.status === 'completed') {
        counts.completed++;
      } else if (task.status === 'in_progress') {
        counts.inProgress++;
      } else {
        counts.notStarted++;
      }
    });
    
    return counts;
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!project) {
    return <div className="alert alert-warning">Project not found.</div>;
  }

  const taskCounts = getTaskStatusCounts();

  return (
    <div className="project-detail-container">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to="/projects" className="btn btn-outline-secondary">
          <FaArrowLeft className="me-1" /> Back to Projects
        </Link>
        <div>
          <Link to={`/projects/${id}/tasks`} className="btn btn-info me-2">
            <FaTasks className="me-1" /> Manage Tasks
          </Link>
          <Link to={`/projects/${id}/edit`} className="btn btn-warning">
            <FaEdit className="me-1" /> Edit Project
          </Link>
        </div>
      </div>
      
      <Card className="mb-4">
        <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
          <span>{project.name}</span>
          <Badge bg={getStatusBadge(project.status || '')}>
            {project.status || 'Unknown'}
          </Badge>
        </Card.Header>
        <Card.Body>
          {project.description && (
            <div className="project-description mb-4">
              <h6>Description</h6>
              <p>{project.description}</p>
            </div>
          )}
          
          <Row className="mb-4">
            <Col md={6}>
              <h6>Project Details</h6>
              <Table className="details-table">
                <tbody>
                  <tr>
                    <th>Start Date</th>
                    <td>{formatDate(project.startDate)}</td>
                  </tr>
                  <tr>
                    <th>Estimated End Date</th>
                    <td>
                      {formatDate(project.estimatedEndDate)}
                      {project.estimatedEndDate && project.status !== 'completed' && (
                        <span className="days-remaining ms-2">
                          ({getDaysRemaining(project.estimatedEndDate)} days remaining)
                        </span>
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Budget</th>
                    <td>{formatCurrency(project.budget)}</td>
                  </tr>
                  <tr>
                    <th>Location</th>
                    <td>{project.location || '-'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            
            <Col md={6}>
              <h6>Associated Entities</h6>
              <Table className="details-table">
                <tbody>
                  <tr>
                    <th>Company</th>
                    <td>
                      {company ? (
                        <Link to={`/companies/${company.id}`}>
                          {company.name}
                        </Link>
                      ) : (
                        'Not assigned'
                      )}
                    </td>
                  </tr>
                  <tr>
                    <th>Project Manager</th>
                    <td>
                      {manager ? (
                        <Link to={`/people/${manager.id}`}>
                          {manager.firstName} {manager.lastName}
                        </Link>
                      ) : (
                        'Not assigned'
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          
          <h6>Project Progress</h6>
          <div className="progress-section mb-4">
            <div className="progress mb-2">
              <div
                className="progress-bar"
                role="progressbar"
                style={{ width: `${project.completionPercentage || 0}%` }}
                aria-valuenow={project.completionPercentage || 0}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                {project.completionPercentage || 0}%
              </div>
            </div>
            <div className="progress-stats">
              <div className="stat-item">
                <span className="stat-label">Tasks:</span>
                <span className="stat-value">{taskCounts.total}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Completed:</span>
                <span className="stat-value">{taskCounts.completed}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">In Progress:</span>
                <span className="stat-value">{taskCounts.inProgress}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Not Started:</span>
                <span className="stat-value">{taskCounts.notStarted}</span>
              </div>
            </div>
          </div>
          
          <h6>Recent Tasks</h6>
          {tasks.length === 0 ? (
            <p>No tasks have been added to this project yet.</p>
          ) : (
            <div className="table-responsive">
              <Table hover className="tasks-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Due Date</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.slice(0, 5).map(task => (
                    <tr key={task.id}>
                      <td>
                        <Link to={`/projects/${id}/tasks/${task.id}`}>
                          {task.name}
                        </Link>
                      </td>
                      <td>
                        <Badge bg={getStatusBadge(task.status || '')}>
                          {task.status || 'Not Started'}
                        </Badge>
                      </td>
                      <td>{formatDate(task.dueDate)}</td>
                      <td>
                        {task.assignedToName || 'Unassigned'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
          
          {tasks.length > 5 && (
            <div className="text-center mt-3">
              <Link to={`/projects/${id}/tasks`} className="btn btn-outline-primary">
                View All {tasks.length} Tasks
              </Link>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectDetail;
