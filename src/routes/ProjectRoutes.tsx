import React from 'react';
import { Container } from 'react-bootstrap';
import { Routes, Route } from 'react-router-dom';
import ProjectListPage from './pages/projects/ProjectListPage';
import ProjectDetailPage from './pages/projects/ProjectDetailPage';
import ProjectCreatePage from './pages/projects/ProjectCreatePage';
import ProjectEditPage from './pages/projects/ProjectEditPage';
import ProjectTasksPage from './pages/projects/ProjectTasksPage';

/**
 * Project Routes Component
 * 
 * EN: Component that defines all routes related to the Project Management module.
 * Handles routing for project listing, details, creation, editing, and task management.
 * 
 * PT: Componente que define todas as rotas relacionadas ao módulo de Gerenciamento de Projetos.
 * Lida com o roteamento para listagem, detalhes, criação, edição e gerenciamento de tarefas de projetos.
 */
const ProjectRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ProjectListPage />} />
      <Route path="/:id" element={<ProjectDetailPage />} />
      <Route path="/create" element={<ProjectCreatePage />} />
      <Route path="/:id/edit" element={<ProjectEditPage />} />
      <Route path="/:projectId/tasks" element={<ProjectTasksPage />} />
    </Routes>
  );
};

export default ProjectRoutes;
