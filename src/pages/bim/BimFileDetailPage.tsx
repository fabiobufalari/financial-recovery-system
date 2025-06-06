import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from 'antd';
import BimFileDetail from '../../components/bim/BimFileDetail';
import './BimFileDetailPage.css';

/**
 * BIM File Detail Page
 * 
 * EN: Page for displaying detailed information about a specific BIM file.
 * Shows file metadata, processing status, and visualization options.
 * 
 * PT: Página para exibir informações detalhadas sobre um arquivo BIM específico.
 * Mostra metadados do arquivo, status de processamento e opções de visualização.
 */
const BimFileDetailPage = () => {
  const { fileId } = useParams();
  const { Title, Paragraph } = Typography;

  return (
    <div className="bim-file-detail-page">
      <div className="page-header">
        <Title level={2}>
          BIM File Details / Detalhes do Arquivo BIM
        </Title>
        <Paragraph>
          EN: View detailed information and processing results for this BIM file.<br />
          PT: Visualize informações detalhadas e resultados de processamento para este arquivo BIM.
        </Paragraph>
      </div>
      
      <BimFileDetail fileId={fileId} />
    </div>
  );
};

export default BimFileDetailPage;
