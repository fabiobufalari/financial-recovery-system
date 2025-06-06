import React from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import ProjectDetail from '../../components/projects/ProjectDetail';

/**
 * Project Detail Page
 * 
 * EN: Page component that displays detailed information about a specific project.
 * Serves as a container for the ProjectDetail component and handles page-level layout.
 * 
 * PT: Componente de página que exibe informações detalhadas sobre um projeto específico.
 * Serve como um contêiner para o componente ProjectDetail e lida com o layout no nível da página.
 */
const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <Container fluid className="py-4">
      <ProjectDetail />
    </Container>
  );
};

export default ProjectDetailPage;
