import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { Project } from '../../types/projectTypes';
import { fetchProjectById, updateProject, createProject } from '../../services/projectService';
import { fetchCompanies } from '../../services/companyService';
import { fetchPeople } from '../../services/peopleService';
import { Company } from '../../types/companyTypes';
import { Person } from '../../types/peopleTypes';
import './ProjectForm.css';

/**
 * Project Form Component
 * 
 * EN: Form component for creating and editing construction projects.
 * Handles validation, submission, and integration with company and people services.
 * 
 * PT: Componente de formulário para criar e editar projetos de construção.
 * Lida com validação, envio e integração com serviços de empresas e pessoas.
 */
const ProjectForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  // Form state
  const [project, setProject] = useState<Partial<Project>>({
    name: '',
    description: '',
    status: 'planning',
    startDate: '',
    estimatedEndDate: '',
    budget: 0,
    completionPercentage: 0,
    location: '',
    companyId: '',
    managerId: ''
  });
  
  // Supporting data
  const [companies, setCompanies] = useState<Company[]>([]);
  const [people, setPeople] = useState<Person[]>([]);
  
  // UI state
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [validated, setValidated] = useState<boolean>(false);

  /**
   * EN: Load project data and supporting entities on component mount
   * PT: Carregar dados do projeto e entidades de suporte ao montar o componente
   */
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load companies and people for dropdowns
        const [companiesData, peopleData] = await Promise.all([
          fetchCompanies(),
          fetchPeople()
        ]);
        
        setCompanies(companiesData);
        setPeople(peopleData);
        
        // If editing, load project data
        if (isEditing && id) {
          const projectData = await fetchProjectById(id);
          setProject(projectData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load necessary data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [isEditing, id]);

  /**
   * EN: Handle form input changes
   * PT: Lidar com mudanças nos campos do formulário
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle numeric inputs
    if (type === 'number') {
      setProject({
        ...project,
        [name]: value === '' ? '' : Number(value)
      });
    } else {
      setProject({
        ...project,
        [name]: value
      });
    }
  };

  /**
   * EN: Handle form submission
   * PT: Lidar com o envio do formulário
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const form = e.currentTarget;
    
    // Form validation
    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    setSubmitting(true);
    
    try {
      if (isEditing && id) {
        await updateProject(id, project as Project);
      } else {
        await createProject(project as Project);
      }
      
      navigate('/projects');
    } catch (err) {
      console.error('Error saving project:', err);
      setError('Failed to save project. Please check your data and try again.');
      setSubmitting(false);
    }
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

  return (
    <div className="project-form-container">
      <Card>
        <Card.Header as="h5">
          {isEditing ? 'Edit Project' : 'Create New Project'}
        </Card.Header>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="projectName">
                  <Form.Label>Project Name</Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="name"
                    value={project.name || ''}
                    onChange={handleChange}
                    placeholder="Enter project name"
                  />
                  <Form.Control.Feedback type="invalid">
                    Project name is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="projectStatus">
                  <Form.Label>Status</Form.Label>
                  <Form.Select
                    name="status"
                    value={project.status || 'planning'}
                    onChange={handleChange}
                  >
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="projectDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={project.description || ''}
                onChange={handleChange}
                placeholder="Enter project description"
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="projectStartDate">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    required
                    type="date"
                    name="startDate"
                    value={project.startDate || ''}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    Start date is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="projectEndDate">
                  <Form.Label>Estimated End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="estimatedEndDate"
                    value={project.estimatedEndDate || ''}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="projectBudget">
                  <Form.Label>Budget</Form.Label>
                  <Form.Control
                    type="number"
                    name="budget"
                    value={project.budget || ''}
                    onChange={handleChange}
                    placeholder="Enter project budget"
                    min="0"
                    step="0.01"
                  />
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="projectCompletion">
                  <Form.Label>Completion Percentage</Form.Label>
                  <Form.Control
                    type="number"
                    name="completionPercentage"
                    value={project.completionPercentage || ''}
                    onChange={handleChange}
                    placeholder="Enter completion percentage"
                    min="0"
                    max="100"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3" controlId="projectLocation">
              <Form.Label>Location</Form.Label>
              <Form.Control
                type="text"
                name="location"
                value={project.location || ''}
                onChange={handleChange}
                placeholder="Enter project location"
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="projectCompany">
                  <Form.Label>Company</Form.Label>
                  <Form.Select
                    required
                    name="companyId"
                    value={project.companyId || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select a company</option>
                    {companies.map(company => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Company is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="projectManager">
                  <Form.Label>Project Manager</Form.Label>
                  <Form.Select
                    required
                    name="managerId"
                    value={project.managerId || ''}
                    onChange={handleChange}
                  >
                    <option value="">Select a manager</option>
                    {people.map(person => (
                      <option key={person.id} value={person.id}>
                        {person.firstName} {person.lastName}
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">
                    Project manager is required.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                className="me-2"
                onClick={() => navigate('/projects')}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button 
                variant="primary" 
                type="submit"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-1"
                    />
                    Saving...
                  </>
                ) : (
                  isEditing ? 'Update Project' : 'Create Project'
                )}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ProjectForm;
