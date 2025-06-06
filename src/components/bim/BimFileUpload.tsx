import React, { useState, useEffect } from 'react';
import { Card, Button, Upload, message, Table, Tag, Space, Typography, Spin } from 'antd';
import { UploadOutlined, FileOutlined, CheckCircleOutlined, CloseCircleOutlined, LoadingOutlined } from '@ant-design/icons';
import axios from 'axios';
import './BimFileUpload.css';

/**
 * BIM File Upload Component
 * 
 * EN: Component for uploading and managing BIM files.
 * Provides interface for file upload, status tracking, and file management.
 * 
 * PT: Componente para upload e gerenciamento de arquivos BIM.
 * Fornece interface para upload de arquivos, acompanhamento de status e gerenciamento de arquivos.
 */
const BimFileUpload = ({ projectId }) => {
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [bimFiles, setBimFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { Title, Text } = Typography;

  // EN: Supported file extensions for BIM files
  // PT: Extensões de arquivo suportadas para arquivos BIM
  const supportedExtensions = ['dwg', 'dxf', 'rvt', 'ifc', 'pln', 'skp'];

  /**
   * EN: Load BIM files for the current project
   * PT: Carregar arquivos BIM para o projeto atual
   */
  const loadBimFiles = async () => {
    if (!projectId) return;
    
    setLoading(true);
    try {
      const response = await axios.get(`/api/bim/files/project/${projectId}`);
      setBimFiles(response.data);
    } catch (error) {
      message.error('Failed to load BIM files / Falha ao carregar arquivos BIM');
      console.error('Error loading BIM files:', error);
    } finally {
      setLoading(false);
    }
  };

  // EN: Load files when component mounts or project changes
  // PT: Carregar arquivos quando o componente é montado ou o projeto muda
  useEffect(() => {
    loadBimFiles();
  }, [projectId]);

  /**
   * EN: Handle file upload
   * PT: Manipular upload de arquivo
   */
  const handleUpload = async () => {
    const formData = new FormData();
    
    // EN: Add files to form data
    // PT: Adicionar arquivos ao form data
    fileList.forEach(file => {
      formData.append('file', file);
    });
    
    formData.append('projectId', projectId);
    
    setUploading(true);
    
    try {
      await axios.post('/api/bim/files/upload', formData);
      
      setFileList([]);
      message.success('File uploaded successfully / Arquivo enviado com sucesso');
      loadBimFiles(); // Refresh file list
    } catch (error) {
      message.error('Upload failed / Falha no upload');
      console.error('Error uploading file:', error);
    } finally {
      setUploading(false);
    }
  };

  /**
   * EN: Handle file deletion
   * PT: Manipular exclusão de arquivo
   */
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/bim/files/${id}`);
      message.success('File deleted successfully / Arquivo excluído com sucesso');
      loadBimFiles(); // Refresh file list
    } catch (error) {
      message.error('Delete failed / Falha na exclusão');
      console.error('Error deleting file:', error);
    }
  };

  /**
   * EN: Get status tag for file status
   * PT: Obter tag de status para o status do arquivo
   */
  const getStatusTag = (status) => {
    switch (status) {
      case 'PENDING':
        return <Tag color="blue">Pending / Pendente</Tag>;
      case 'PROCESSING':
        return <Tag color="orange" icon={<LoadingOutlined spin />}>Processing / Processando</Tag>;
      case 'COMPLETED':
        return <Tag color="green" icon={<CheckCircleOutlined />}>Completed / Concluído</Tag>;
      case 'FAILED':
        return <Tag color="red" icon={<CloseCircleOutlined />}>Failed / Falhou</Tag>;
      case 'UNSUPPORTED_FORMAT':
        return <Tag color="red">Unsupported / Não suportado</Tag>;
      default:
        return <Tag>Unknown / Desconhecido</Tag>;
    }
  };

  // EN: Table columns configuration
  // PT: Configuração das colunas da tabela
  const columns = [
    {
      title: 'File Name / Nome do Arquivo',
      dataIndex: 'originalFilename',
      key: 'originalFilename',
      render: (text) => <span><FileOutlined /> {text}</span>,
    },
    {
      title: 'Format / Formato',
      dataIndex: 'fileExtension',
      key: 'fileExtension',
      render: (text) => text.toUpperCase(),
    },
    {
      title: 'Size / Tamanho',
      dataIndex: 'fileSize',
      key: 'fileSize',
      render: (size) => `${(size / 1024 / 1024).toFixed(2)} MB`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Upload Date / Data de Upload',
      dataIndex: 'uploadedAt',
      key: 'uploadedAt',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: 'Actions / Ações',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="link" 
            onClick={() => window.open(`/api/bim/files/${record.id}/view`, '_blank')}
            disabled={record.status !== 'COMPLETED'}
          >
            View / Visualizar
          </Button>
          <Button 
            type="link" 
            danger 
            onClick={() => handleDelete(record.id)}
          >
            Delete / Excluir
          </Button>
        </Space>
      ),
    },
  ];

  // EN: Upload component properties
  // PT: Propriedades do componente de upload
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      // EN: Check file extension
      // PT: Verificar extensão do arquivo
      const extension = file.name.split('.').pop().toLowerCase();
      if (!supportedExtensions.includes(extension)) {
        message.error(`${file.name} is not a supported BIM file format / não é um formato de arquivo BIM suportado`);
        return Upload.LIST_IGNORE;
      }
      
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  return (
    <div className="bim-file-upload-container">
      <Card title={<Title level={4}>BIM File Management / Gerenciamento de Arquivos BIM</Title>}>
        <div className="upload-section">
          <Text>
            EN: Upload BIM files (supported formats: DWG, DXF, RVT, IFC, PLN, SKP)<br />
            PT: Envie arquivos BIM (formatos suportados: DWG, DXF, RVT, IFC, PLN, SKP)
          </Text>
          <Upload {...uploadProps}>
            <Button icon={<UploadOutlined />}>Select File / Selecionar Arquivo</Button>
          </Upload>
          <Button
            type="primary"
            onClick={handleUpload}
            disabled={fileList.length === 0}
            loading={uploading}
            style={{ marginTop: 16 }}
          >
            {uploading ? 'Uploading / Enviando' : 'Start Upload / Iniciar Upload'}
          </Button>
        </div>
        
        <div className="files-section">
          <Title level={5}>Project BIM Files / Arquivos BIM do Projeto</Title>
          {loading ? (
            <div className="loading-container">
              <Spin size="large" />
              <Text>Loading files / Carregando arquivos...</Text>
            </div>
          ) : (
            <Table 
              columns={columns} 
              dataSource={bimFiles} 
              rowKey="id"
              pagination={{ pageSize: 5 }}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default BimFileUpload;
