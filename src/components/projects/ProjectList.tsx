import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Project } from '../../types/projectTypes';
import { fetchProjects, deleteProject } from '../../services/projectService';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaTasks } from 'react-icons/fa';
import './ProjectList.css';

/**
 * Project List Component
 * 
 * EN: Displays a list of construction projects with filtering and sorting capabilities.
 * Provides options to view details, edit, or delete projects.
 * 
 * PT: Exibe uma lista de projetos de construção com capacidades de filtragem e ordenação.
 * Fornece opções para visualizar detalhes, editar ou excluir projetos.
 */
const ProjectList: React.FC = () => {
  // State variables
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof Project>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  /**
   * EN: Fetch projects on component mount
   * PT: Buscar projetos ao montar o componente
   */
  useEffect(() => {
    loadProjects();
  }, []);

  /**
   * EN: Load projects from the API
   * PT: Carregar projetos da API
   */
  const loadProjects = async () => {
    try {
      setLoading(true);
      const data = await fetchProjects();
      setProjects(data);
      setError(null);
    } catch (err) {
      setError('Failed to load projects. Please try again later.');
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * EN: Handle project deletion
   * PT: Lidar com a exclusão de projetos
   */
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
        setProjects(projects.filter(project => project.id !== id));
      } catch (err) {
        setError('Failed to delete project. Please try again.');
        console.error('Error deleting project:', err);
      }
    }
  };

  /**
   * EN: Handle sorting change
   * PT: Lidar com a mudança de ordenação
   */
  const handleSort = (field: keyof Project) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

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
   * EN: Filter and sort projects based on current filters and sort settings
   * PT: Filtrar e ordenar projetos com base nas configurações atuais de filtros e ordenação
   */
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (project.description && project.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || project.status?.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      const fieldA = a[sortField] || '';
      const fieldB = b[sortField] || '';
      
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sortDirection === 'asc' 
          ? fieldA.localeCompare(fieldB) 
          : fieldB.localeCompare(fieldA);
      }
      
      if (typeof fieldA === 'number' && typeof fieldB === 'number') {
        return sortDirection === 'asc' 
          ? fieldA - fieldB 
          : fieldB - fieldA;
      }
      
      return 0;
    });

  /**
   * EN: Format date for display
   * PT: Formatar data para exibição
   */
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
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

  return (
    <div className="project-list-container">
      <Card className="mb-4">
        <Card.Header as="h5">
          {/* EN: Projects / PT: Projetos */}
          Projects
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="on_hold">On Hold</option>
                <option value="cancelled">Cancelled</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <Link to="/projects/create">
                <Button variant="primary">
                  <FaPlus className="me-1" /> New Project
                </Button>
              </Link>
            </Col>
          </Row>

          {error && <div className="alert alert-danger">{error}</div>}

          {loading ? (
            <div className="text-center my-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : (
            <>
              {filteredAndSortedProjects.length === 0 ? (
                <div className="text-center my-5">
                  <p>No projects found. Create a new project to get started.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="project-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')} className="sortable-header">
                          Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('status')} className="sortable-header">
                          Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('startDate')} className="sortable-header">
                          Start Date {sortField === 'startDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('estimatedEndDate')} className="sortable-header">
                          Est. End Date {sortField === 'estimatedEndDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('completionPercentage')} className="sortable-header">
                          Progress {sortField === 'completionPercentage' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedProjects.map((project) => (
                        <tr key={project.id}>
                          <td>
                            <Link to={`/projects/${project.id}`} className="project-name-link">
                              {project.name}
                            </Link>
                            {project.description && (
                              <div className="project-description-preview">
                                {project.description.length > 100
                                  ? `${project.description.substring(0, 100)}...`
                                  : project.description}
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(project.status || '')}>
                              {project.status || 'Unknown'}
                            </Badge>
                          </td>
                          <td>{formatDate(project.startDate)}</td>
                          <td>
                            {formatDate(project.estimatedEndDate)}
                            {project.estimatedEndDate && project.status !== 'completed' && (
                              <div className="days-remaining">
                                {getDaysRemaining(project.estimatedEndDate)} days remaining
                              </div>
                            )}
                          </td>
                          <td>
                            <div className="progress">
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
                          </td>
                          <td>
                            <div className="action-buttons">
                              <Link to={`/projects/${project.id}/tasks`} className="btn btn-sm btn-info me-1">
                                <FaTasks /> Tasks
                              </Link>
                              <Link to={`/projects/${project.id}/edit`} className="btn btn-sm btn-warning me-1">
                                <FaEdit /> Edit
                              </Link>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(project.id)}
                              >
                                <FaTrash /> Delete
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectList;
