import React from 'react';
import { Tabs, Typography } from 'antd';
import BimFileUpload from '../../components/bim/BimFileUpload';
import BimProcessingDashboard from '../../components/bim/BimProcessingDashboard';
import './BimManagementPage.css';

/**
 * BIM Management Page
 * 
 * EN: Main page for BIM file management and processing.
 * Provides tabs for file upload, processing dashboard, and visualization.
 * 
 * PT: Página principal para gerenciamento e processamento de arquivos BIM.
 * Fornece abas para upload de arquivos, dashboard de processamento e visualização.
 */
const BimManagementPage = ({ match }) => {
  const { TabPane } = Tabs;
  const { Title } = Typography;
  
  // Extract project ID from URL parameters
  const projectId = match.params.projectId;

  return (
    <div className="bim-management-page">
      <div className="page-header">
        <Title level={2}>
          BIM Management / Gerenciamento BIM
        </Title>
        <Typography.Paragraph>
          EN: Upload, process, and visualize BIM files for your construction projects.<br />
          PT: Faça upload, processe e visualize arquivos BIM para seus projetos de construção.
        </Typography.Paragraph>
      </div>
      
      <Tabs defaultActiveKey="dashboard" type="card">
        <TabPane 
          tab="Dashboard / Painel" 
          key="dashboard"
        >
          <BimProcessingDashboard projectId={projectId} />
        </TabPane>
        
        <TabPane 
          tab="File Upload / Upload de Arquivos" 
          key="upload"
        >
          <BimFileUpload projectId={projectId} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default BimManagementPage;
