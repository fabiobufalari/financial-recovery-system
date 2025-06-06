import React from 'react';
import { Container } from 'react-bootstrap';
import ProjectTaskList from '../../components/projects/ProjectTaskList';

/**
 * Project Tasks Page
 * 
 * EN: Page component that displays the list of tasks for a specific project.
 * Serves as a container for the ProjectTaskList component and handles page-level layout.
 * 
 * PT: Componente de página que exibe a lista de tarefas para um projeto específico.
 * Serve como um contêiner para o componente ProjectTaskList e lida com o layout no nível da página.
 */
const ProjectTasksPage: React.FC = () => {
  return (
    <Container fluid className="py-4">
      <ProjectTaskList />
    </Container>
  );
};

export default ProjectTasksPage;
