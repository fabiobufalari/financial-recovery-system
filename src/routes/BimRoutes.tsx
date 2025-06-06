import React from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import BimManagementPage from '../pages/bim/BimManagementPage';
import BimFileDetailPage from '../pages/bim/BimFileDetailPage';

/**
 * BIM Routes Component
 * 
 * EN: Defines the routing structure for BIM-related pages.
 * Handles navigation between BIM management and file detail views.
 * 
 * PT: Define a estrutura de rotas para páginas relacionadas ao BIM.
 * Gerencia a navegação entre as visualizações de gerenciamento BIM e detalhes de arquivos.
 */
const BimRoutes = () => {
  const { path } = useRouteMatch();
  
  return (
    <Switch>
      <Route exact path={`${path}/project/:projectId`} component={BimManagementPage} />
      <Route path={`${path}/files/:fileId`} component={BimFileDetailPage} />
    </Switch>
  );
};

export default BimRoutes;
