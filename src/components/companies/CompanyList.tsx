import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Flex,
  Spinner,
  useToast,
  IconButton
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon, EditIcon, ViewIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import { Company } from '../../types/companyTypes';
import companyService from '../../services/companyService';

/**
 * Company List Component
 * 
 * EN: This component displays a list of companies with options to view details,
 * edit, or delete each company. It also provides functionality to add new companies.
 * The component optimizes usability by minimizing clicks required for common actions.
 * 
 * PT: Este componente exibe uma lista de empresas com opções para visualizar detalhes,
 * editar ou excluir cada empresa. Também fornece funcionalidade para adicionar novas empresas.
 * O componente otimiza a usabilidade minimizando os cliques necessários para ações comuns.
 */
const CompanyList: React.FC = () => {
  // State management
  // EN: State hooks for storing companies data and loading status
  // PT: Hooks de estado para armazenar dados de empresas e status de carregamento
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * EN: Fetch companies data when component mounts
   * PT: Busca dados de empresas quando o componente é montado
   */
  useEffect(() => {
    fetchCompanies();
  }, []);

  /**
   * Fetch all companies from the API
   * 
   * EN: Retrieves the list of companies from the backend service
   * and updates the component state accordingly.
   * 
   * PT: Recupera a lista de empresas do serviço de backend
   * e atualiza o estado do componente de acordo.
   */
  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await companyService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar empresas',
        description: 'Não foi possível carregar a lista de empresas.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle company deletion
   * 
   * EN: Confirms with the user before deleting a company and refreshes
   * the list upon successful deletion.
   * 
   * PT: Confirma com o usuário antes de excluir uma empresa e atualiza
   * a lista após a exclusão bem-sucedida.
   * 
   * @param id - The ID of the company to delete
   */
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta empresa?')) {
      try {
        await companyService.deleteCompany(id);
        toast({
          title: 'Empresa excluída',
          description: 'A empresa foi excluída com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchCompanies();
      } catch (error) {
        toast({
          title: 'Erro ao excluir empresa',
          description: 'Não foi possível excluir a empresa.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error deleting company:', error);
      }
    }
  };

  return (
    <Box p={4}>
      {/* 
        Header section with title and add button
        EN: Displays the page title and provides a button to add new companies
        PT: Exibe o título da página e fornece um botão para adicionar novas empresas
      */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Empresas</Heading>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="blue" 
          onClick={() => navigate('/companies/new')}
        >
          Nova Empresa
        </Button>
      </Flex>

      {/* 
        Content section - shows spinner while loading or table when data is available
        EN: Displays a loading spinner or the companies table based on loading state
        PT: Exibe um spinner de carregamento ou a tabela de empresas com base no estado de carregamento
      */}
      {loading ? (
        <Flex justifyContent="center" my={8}>
          <Spinner size="xl" />
        </Flex>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Nome</Th>
              <Th>CNPJ</Th>
              <Th>Email</Th>
              <Th>Telefone</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {companies.length > 0 ? (
              companies.map((company) => (
                <Tr key={company.id}>
                  <Td>{company.name}</Td>
                  <Td>{company.cnpj}</Td>
                  <Td>{company.email || '-'}</Td>
                  <Td>{company.phone || '-'}</Td>
                  <Td>
                    <Badge colorScheme={company.active ? 'green' : 'red'}>
                      {company.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Td>
                  <Td>
                    {/* 
                      Action buttons for each company
                      EN: Provides quick access to view, edit, and delete functions with minimal clicks
                      PT: Fornece acesso rápido às funções de visualizar, editar e excluir com cliques mínimos
                    */}
                    <IconButton
                      aria-label="Ver detalhes"
                      icon={<ViewIcon />}
                      size="sm"
                      mr={2}
                      onClick={() => navigate(`/companies/${company.id}`)}
                    />
                    <IconButton
                      aria-label="Editar"
                      icon={<EditIcon />}
                      size="sm"
                      mr={2}
                      onClick={() => navigate(`/companies/${company.id}/edit`)}
                    />
                    <IconButton
                      aria-label="Excluir"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(company.id)}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6} textAlign="center">
                  Nenhuma empresa encontrada
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default CompanyList;
