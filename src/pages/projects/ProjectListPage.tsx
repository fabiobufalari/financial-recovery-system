import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectList from '../../components/projects/ProjectList';

/**
 * Project List Page
 * 
 * EN: Page component that displays the list of projects.
 * Serves as a container for the ProjectList component and handles page-level layout.
 * 
 * PT: Componente de página que exibe a lista de projetos.
 * Serve como um contêiner para o componente ProjectList e lida com o layout no nível da página.
 */
const ProjectListPage: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <ProjectList />
    </Container>
  );
};

export default ProjectListPage;
