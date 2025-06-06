import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Row, Col, Badge, Spinner, Form, InputGroup } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { ProjectTask } from '../../types/projectTypes';
import { fetchTasksByProject, deleteTask } from '../../services/projectTaskService';
import { fetchProjectById } from '../../services/projectService';
import { FaEdit, FaTrash, FaSearch, FaPlus, FaArrowLeft } from 'react-icons/fa';
import './ProjectTaskList.css';

/**
 * Project Task List Component
 * 
 * EN: Displays a list of tasks for a specific project with filtering and sorting capabilities.
 * Provides options to view details, edit, or delete tasks.
 * 
 * PT: Exibe uma lista de tarefas para um projeto específico com capacidades de filtragem e ordenação.
 * Fornece opções para visualizar detalhes, editar ou excluir tarefas.
 */
const ProjectTaskList: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  
  // State variables
  const [tasks, setTasks] = useState<ProjectTask[]>([]);
  const [projectName, setProjectName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<keyof ProjectTask>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');

  /**
   * EN: Fetch tasks on component mount
   * PT: Buscar tarefas ao montar o componente
   */
  useEffect(() => {
    if (!projectId) return;
    
    const loadData = async () => {
      try {
        setLoading(true);
        const [tasksData, projectData] = await Promise.all([
          fetchTasksByProject(projectId),
          fetchProjectById(projectId)
        ]);
        
        setTasks(tasksData);
        setProjectName(projectData.name);
        setError(null);
      } catch (err) {
        setError('Failed to load tasks. Please try again later.');
        console.error('Error loading tasks:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [projectId]);

  /**
   * EN: Handle task deletion
   * PT: Lidar com a exclusão de tarefas
   */
  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        setError('Failed to delete task. Please try again.');
        console.error('Error deleting task:', err);
      }
    }
  };

  /**
   * EN: Handle sorting change
   * PT: Lidar com a mudança de ordenação
   */
  const handleSort = (field: keyof ProjectTask) => {
    const newDirection = field === sortField && sortDirection === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  /**
   * EN: Get status badge color based on task status
   * PT: Obter cor do badge com base no status da tarefa
   */
  const getStatusBadge = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'not_started':
        return 'secondary';
      case 'in_progress':
        return 'primary';
      case 'completed':
        return 'success';
      case 'blocked':
        return 'danger';
      default:
        return 'info';
    }
  };

  /**
   * EN: Get priority badge color based on task priority
   * PT: Obter cor do badge com base na prioridade da tarefa
   */
  const getPriorityBadge = (priority: string) => {
    switch (priority?.toLowerCase()) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'danger';
      case 'critical':
        return 'dark';
      default:
        return 'secondary';
    }
  };

  /**
   * EN: Filter and sort tasks based on current filters and sort settings
   * PT: Filtrar e ordenar tarefas com base nas configurações atuais de filtros e ordenação
   */
  const filteredAndSortedTasks = tasks
    .filter(task => {
      const matchesSearch = task.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || task.status?.toLowerCase() === statusFilter.toLowerCase();
      const matchesPriority = priorityFilter === 'all' || task.priority?.toLowerCase() === priorityFilter.toLowerCase();
      return matchesSearch && matchesStatus && matchesPriority;
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

  return (
    <div className="project-task-list-container">
      <Card className="mb-4">
        <Card.Header as="h5">
          {/* EN: Tasks for Project: {projectName} / PT: Tarefas para o Projeto: {projectName} */}
          Tasks for Project: {projectName}
        </Card.Header>
        <Card.Body>
          <div className="mb-3">
            <Link to={`/projects/${projectId}`} className="btn btn-outline-secondary">
              <FaArrowLeft className="me-1" /> Back to Project
            </Link>
          </div>
          
          <Row className="mb-3">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search tasks..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={2}>
              <Form.Select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Select 
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </Form.Select>
            </Col>
            <Col md={4} className="text-end">
              <Link to={`/projects/${projectId}/tasks/create`}>
                <Button variant="primary">
                  <FaPlus className="me-1" /> New Task
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
              {filteredAndSortedTasks.length === 0 ? (
                <div className="text-center my-5">
                  <p>No tasks found. Create a new task to get started.</p>
                </div>
              ) : (
                <div className="table-responsive">
                  <Table hover className="task-table">
                    <thead>
                      <tr>
                        <th onClick={() => handleSort('name')} className="sortable-header">
                          Name {sortField === 'name' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('status')} className="sortable-header">
                          Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('priority')} className="sortable-header">
                          Priority {sortField === 'priority' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('dueDate')} className="sortable-header">
                          Due Date {sortField === 'dueDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th onClick={() => handleSort('assignedToName')} className="sortable-header">
                          Assigned To {sortField === 'assignedToName' && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredAndSortedTasks.map((task) => (
                        <tr key={task.id}>
                          <td>
                            <Link to={`/projects/${projectId}/tasks/${task.id}`} className="task-name-link">
                              {task.name}
                            </Link>
                            {task.description && (
                              <div className="task-description-preview">
                                {task.description.length > 100
                                  ? `${task.description.substring(0, 100)}...`
                                  : task.description}
                              </div>
                            )}
                          </td>
                          <td>
                            <Badge bg={getStatusBadge(task.status || '')}>
                              {task.status || 'Not Started'}
                            </Badge>
                          </td>
                          <td>
                            <Badge bg={getPriorityBadge(task.priority || '')}>
                              {task.priority || 'Medium'}
                            </Badge>
                          </td>
                          <td>{formatDate(task.dueDate)}</td>
                          <td>{task.assignedToName || 'Unassigned'}</td>
                          <td>
                            <div className="action-buttons">
                              <Link to={`/projects/${projectId}/tasks/${task.id}/edit`} className="btn btn-sm btn-warning me-1">
                                <FaEdit /> Edit
                              </Link>
                              <Button
                                variant="danger"
                                size="sm"
                                onClick={() => handleDelete(task.id)}
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

export default ProjectTaskList;
