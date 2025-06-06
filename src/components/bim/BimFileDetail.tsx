import React, { useState, useEffect } from 'react';
import { Card, Tabs, Descriptions, Button, Typography, Spin, Empty, Alert, Tag, Divider } from 'antd';
import { FileOutlined, DownloadOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import './BimFileDetail.css';

/**
 * BIM File Detail Component
 * 
 * EN: Component for displaying detailed information about a BIM file.
 * Shows file metadata, processing status, and extracted information.
 * 
 * PT: Componente para exibir informações detalhadas sobre um arquivo BIM.
 * Mostra metadados do arquivo, status de processamento e informações extraídas.
 */
const BimFileDetail = ({ fileId }) => {
  const [fileDetails, setFileDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { Title, Text } = Typography;
  const { TabPane } = Tabs;

  /**
   * EN: Load BIM file details
   * PT: Carregar detalhes do arquivo BIM
   */
  const loadFileDetails = async () => {
    if (!fileId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/bim/files/${fileId}`);
      setFileDetails(response.data);
    } catch (err) {
      setError('Failed to load BIM file details / Falha ao carregar detalhes do arquivo BIM');
      console.error('Error loading BIM file details:', err);
    } finally {
      setLoading(false);
    }
  };

  // EN: Load file details when component mounts or fileId changes
  // PT: Carregar detalhes do arquivo quando o componente é montado ou o fileId muda
  useEffect(() => {
    loadFileDetails();
  }, [fileId]);

  /**
   * EN: Get status tag for file status
   * PT: Obter tag de status para o status do arquivo
   */
  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="blue">Pending / Pendente</Tag>;
      case 'PROCESSING':
        return <Tag color="orange">Processing / Processando</Tag>;
      case 'COMPLETED':
        return <Tag color="green">Completed / Concluído</Tag>;
      case 'FAILED':
        return <Tag color="red">Failed / Falhou</Tag>;
      case 'UNSUPPORTED_FORMAT':
        return <Tag color="red">Unsupported / Não suportado</Tag>;
      default:
        return <Tag>Unknown / Desconhecido</Tag>;
    }
  };

  /**
   * EN: Handle file download
   * PT: Manipular download do arquivo
   */
  const handleDownload = () => {
    window.open(`/api/bim/files/${fileId}/download`, '_blank');
  };

  /**
   * EN: Handle file deletion
   * PT: Manipular exclusão do arquivo
   */
  const handleDelete = async () => {
    try {
      await axios.delete(`/api/bim/files/${fileId}`);
      // Redirect to file list or notify parent component
      window.history.back();
    } catch (err) {
      setError('Failed to delete file / Falha ao excluir arquivo');
      console.error('Error deleting file:', err);
    }
  };

  /**
   * EN: Handle view processed output
   * PT: Manipular visualização da saída processada
   */
  const handleViewOutput = () => {
    window.open(`/api/bim/files/${fileId}/view`, '_blank');
  };

  if (loading) {
    return (
      <div className="bim-file-detail-loading">
        <Spin size="large" />
        <Text>Loading BIM file details / Carregando detalhes do arquivo BIM...</Text>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        message="Error / Erro"
        description={error}
        type="error"
        showIcon
      />
    );
  }

  if (!fileDetails) {
    return (
      <Empty 
        description="No file details available / Nenhum detalhe de arquivo disponível" 
        image={Empty.PRESENTED_IMAGE_SIMPLE}
      />
    );
  }

  return (
    <div className="bim-file-detail">
      <Card 
        title={
          <div className="file-detail-header">
            <FileOutlined className="file-icon" />
            <Title level={4}>{fileDetails.originalFilename}</Title>
            {getStatusTag(fileDetails.status)}
          </div>
        }
        extra={
          <div className="file-actions">
            <Button 
              icon={<DownloadOutlined />} 
              onClick={handleDownload}
            >
              Download
            </Button>
            {fileDetails.status === 'COMPLETED' && (
              <Button 
                type="primary" 
                icon={<EyeOutlined />} 
                onClick={handleViewOutput}
              >
                View / Visualizar
              </Button>
            )}
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              onClick={handleDelete}
            >
              Delete / Excluir
            </Button>
          </div>
        }
      >
        <Tabs defaultActiveKey="info">
          <TabPane tab="File Info / Informações do Arquivo" key="info">
            <Descriptions bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
              <Descriptions.Item label="File Name / Nome do Arquivo">
                {fileDetails.originalFilename}
              </Descriptions.Item>
              <Descriptions.Item label="Format / Formato">
                {fileDetails.fileExtension.toUpperCase()}
              </Descriptions.Item>
              <Descriptions.Item label="Size / Tamanho">
                {(fileDetails.fileSize / 1024 / 1024).toFixed(2)} MB
              </Descriptions.Item>
              <Descriptions.Item label="Content Type / Tipo de Conteúdo">
                {fileDetails.contentType}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {getStatusTag(fileDetails.status)}
              </Descriptions.Item>
              <Descriptions.Item label="Source Software / Software de Origem">
                {fileDetails.sourceSoftware || 'Unknown / Desconhecido'}
              </Descriptions.Item>
              <Descriptions.Item label="Upload Date / Data de Upload">
                {new Date(fileDetails.uploadedAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Processing Date / Data de Processamento">
                {fileDetails.processedAt ? new Date(fileDetails.processedAt).toLocaleString() : 'N/A'}
              </Descriptions.Item>
            </Descriptions>
            
            {fileDetails.status === 'FAILED' && fileDetails.errorMessage && (
              <div className="error-section">
                <Divider />
                <Title level={5}>Error Message / Mensagem de Erro</Title>
                <Alert
                  message="Processing Error / Erro de Processamento"
                  description={fileDetails.errorMessage}
                  type="error"
                  showIcon
                />
              </div>
            )}
          </TabPane>
          
          <TabPane tab="Extracted Data / Dados Extraídos" key="data">
            {fileDetails.status !== 'COMPLETED' ? (
              <Empty 
                description="Data not available - file processing not complete / Dados não disponíveis - processamento do arquivo não concluído" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="extracted-data">
                <Text>
                  EN: The extracted data is available for viewing in the visualization tab or by clicking the View button.<br />
                  PT: Os dados extraídos estão disponíveis para visualização na aba de visualização ou clicando no botão Visualizar.
                </Text>
                
                <div className="data-summary">
                  <Title level={5}>Data Summary / Resumo dos Dados</Title>
                  {/* This would be populated with actual extracted data in a real implementation */}
                  <Descriptions bordered>
                    <Descriptions.Item label="Elements / Elementos">247</Descriptions.Item>
                    <Descriptions.Item label="Layers / Camadas">15</Descriptions.Item>
                    <Descriptions.Item label="Materials / Materiais">32</Descriptions.Item>
                    <Descriptions.Item label="Total Area / Área Total">1,250 m²</Descriptions.Item>
                    <Descriptions.Item label="Total Volume / Volume Total">3,750 m³</Descriptions.Item>
                  </Descriptions>
                </div>
              </div>
            )}
          </TabPane>
          
          <TabPane tab="Visualization / Visualização" key="visualization">
            {fileDetails.status !== 'COMPLETED' ? (
              <Empty 
                description="Visualization not available - file processing not complete / Visualização não disponível - processamento do arquivo não concluído" 
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            ) : (
              <div className="visualization-container">
                <iframe 
                  src={`/api/bim/files/${fileId}/view`} 
                  title="BIM Visualization" 
                  className="visualization-frame"
                />
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default BimFileDetail;
