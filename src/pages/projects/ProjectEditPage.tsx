import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectForm from '../../components/projects/ProjectForm';

/**
 * Project Edit Page
 * 
 * EN: Page component that displays the form for editing an existing project.
 * Serves as a container for the ProjectForm component and handles page-level layout.
 * 
 * PT: Componente de página que exibe o formulário para editar um projeto existente.
 * Serve como um contêiner para o componente ProjectForm e lida com o layout no nível da página.
 */
const ProjectEditPage: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <ProjectForm isEditing={true} />
    </Container>
  );
};

export default ProjectEditPage;
