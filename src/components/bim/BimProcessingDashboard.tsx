import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Progress, Alert, Typography, Spin, Empty } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined, FileOutlined, WarningOutlined } from '@ant-design/icons';
import axios from 'axios';
import './BimProcessingDashboard.css';

/**
 * BIM Processing Dashboard Component
 * 
 * EN: Dashboard for monitoring BIM file processing status.
 * Provides overview of processing statistics and status for the current project.
 * 
 * PT: Dashboard para monitoramento do status de processamento de arquivos BIM.
 * Fornece visão geral das estatísticas de processamento e status para o projeto atual.
 */
const BimProcessingDashboard = ({ projectId }) => {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    processing: 0,
    completed: 0,
    failed: 0,
    unsupported: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recentErrors, setRecentErrors] = useState([]);
  const { Title, Text } = Typography;

  /**
   * EN: Load BIM processing statistics for the current project
   * PT: Carregar estatísticas de processamento BIM para o projeto atual
   */
  const loadStats = async () => {
    if (!projectId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`/api/bim/stats/project/${projectId}`);
      setStats(response.data);
      
      // Load recent errors
      const errorsResponse = await axios.get(`/api/bim/files/project/${projectId}/errors`);
      setRecentErrors(errorsResponse.data);
    } catch (err) {
      setError('Failed to load BIM processing statistics / Falha ao carregar estatísticas de processamento BIM');
      console.error('Error loading BIM stats:', err);
    } finally {
      setLoading(false);
    }
  };

  // EN: Load stats when component mounts or project changes
  // PT: Carregar estatísticas quando o componente é montado ou o projeto muda
  useEffect(() => {
    loadStats();
    
    // Set up polling for updates
    const interval = setInterval(() => {
      loadStats();
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, [projectId]);

  /**
   * EN: Calculate completion percentage
   * PT: Calcular porcentagem de conclusão
   */
  const getCompletionPercentage = () => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  /**
   * EN: Get status color based on completion percentage
   * PT: Obter cor de status com base na porcentagem de conclusão
   */
  const getStatusColor = (percentage) => {
    if (percentage < 30) return '#ff4d4f';
    if (percentage < 70) return '#faad14';
    return '#52c41a';
  };

  if (loading && stats.total === 0) {
    return (
      <div className="bim-dashboard-loading">
        <Spin size="large" />
        <Text>Loading BIM processing statistics / Carregando estatísticas de processamento BIM...</Text>
      </div>
    );
  }

  return (
    <div className="bim-processing-dashboard">
      <Card title={<Title level={4}>BIM Processing Dashboard / Dashboard de Processamento BIM</Title>}>
        {error && (
          <Alert
            message="Error / Erro"
            description={error}
            type="error"
            showIcon
            className="dashboard-alert"
          />
        )}
        
        {stats.total === 0 ? (
          <Empty 
            description="No BIM files found for this project / Nenhum arquivo BIM encontrado para este projeto" 
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <>
            <div className="completion-progress">
              <Progress
                type="circle"
                percent={getCompletionPercentage()}
                strokeColor={getStatusColor(getCompletionPercentage())}
                format={percent => `${percent}%`}
                size={120}
              />
              <div className="completion-text">
                <Title level={4}>Processing Completion / Conclusão do Processamento</Title>
                <Text>{stats.completed} of {stats.total} files processed / {stats.completed} de {stats.total} arquivos processados</Text>
              </div>
            </div>
            
            <Row gutter={16} className="stats-row">
              <Col xs={12} sm={8} md={4}>
                <Card className="stat-card">
                  <Statistic
                    title="Total Files / Total de Arquivos"
                    value={stats.total}
                    prefix={<FileOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="stat-card">
                  <Statistic
                    title="Pending / Pendentes"
                    value={stats.pending}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="stat-card">
                  <Statistic
                    title="Processing / Processando"
                    value={stats.processing}
                    valueStyle={{ color: '#faad14' }}
                    prefix={<LoadingOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="stat-card">
                  <Statistic
                    title="Completed / Concluídos"
                    value={stats.completed}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<CheckCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="stat-card">
                  <Statistic
                    title="Failed / Falhas"
                    value={stats.failed}
                    valueStyle={{ color: '#ff4d4f' }}
                    prefix={<CloseCircleOutlined />}
                  />
                </Card>
              </Col>
              <Col xs={12} sm={8} md={4}>
                <Card className="stat-card">
                  <Statistic
                    title="Unsupported / Não suportados"
                    value={stats.unsupported}
                    valueStyle={{ color: '#ff7a45' }}
                    prefix={<WarningOutlined />}
                  />
                </Card>
              </Col>
            </Row>
            
            {recentErrors.length > 0 && (
              <div className="recent-errors">
                <Title level={5}>Recent Errors / Erros Recentes</Title>
                {recentErrors.map((error, index) => (
                  <Alert
                    key={index}
                    message={`${error.originalFilename} (${error.fileExtension.toUpperCase()})`}
                    description={error.errorMessage}
                    type="error"
                    showIcon
                    className="error-alert"
                  />
                ))}
              </div>
            )}
          </>
        )}
        
        <div className="dashboard-footer">
          <Text type="secondary">
            EN: Last updated: {new Date().toLocaleString()}<br />
            PT: Última atualização: {new Date().toLocaleString()}
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default BimProcessingDashboard;
