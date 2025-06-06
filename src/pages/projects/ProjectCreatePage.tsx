import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectForm from '../../components/projects/ProjectForm';

/**
 * Project Create Page
 * 
 * EN: Page component that displays the form for creating a new project.
 * Serves as a container for the ProjectForm component and handles page-level layout.
 * 
 * PT: Componente de página que exibe o formulário para criar um novo projeto.
 * Serve como um contêiner para o componente ProjectForm e lida com o layout no nível da página.
 */
const ProjectCreatePage: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <ProjectForm isEditing={false} />
    </Container>
  );
};

export default ProjectCreatePage;
