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
import { Person } from '../../types/peopleTypes';
import peopleService from '../../services/peopleService';

/**
 * People List Component
 * 
 * EN: This component displays a list of people with options to view details,
 * edit, or delete each person. It also provides functionality to add new people.
 * The component optimizes usability by minimizing clicks required for common actions.
 * 
 * PT: Este componente exibe uma lista de pessoas com opções para visualizar detalhes,
 * editar ou excluir cada pessoa. Também fornece funcionalidade para adicionar novas pessoas.
 * O componente otimiza a usabilidade minimizando os cliques necessários para ações comuns.
 */
const PeopleList: React.FC = () => {
  // State management
  // EN: State hooks for storing people data and loading status
  // PT: Hooks de estado para armazenar dados de pessoas e status de carregamento
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * EN: Fetch people data when component mounts
   * PT: Busca dados de pessoas quando o componente é montado
   */
  useEffect(() => {
    fetchPeople();
  }, []);

  /**
   * Fetch all people from the API
   * 
   * EN: Retrieves the list of people from the backend service
   * and updates the component state accordingly.
   * 
   * PT: Recupera a lista de pessoas do serviço de backend
   * e atualiza o estado do componente de acordo.
   */
  const fetchPeople = async () => {
    try {
      setLoading(true);
      const data = await peopleService.getAllPeople();
      setPeople(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar pessoas',
        description: 'Não foi possível carregar a lista de pessoas.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching people:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle person deletion
   * 
   * EN: Confirms with the user before deleting a person and refreshes
   * the list upon successful deletion.
   * 
   * PT: Confirma com o usuário antes de excluir uma pessoa e atualiza
   * a lista após a exclusão bem-sucedida.
   * 
   * @param id - The ID of the person to delete
   */
  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta pessoa?')) {
      try {
        await peopleService.deletePerson(id);
        toast({
          title: 'Pessoa excluída',
          description: 'A pessoa foi excluída com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchPeople();
      } catch (error) {
        toast({
          title: 'Erro ao excluir pessoa',
          description: 'Não foi possível excluir a pessoa.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error deleting person:', error);
      }
    }
  };

  return (
    <Box p={4}>
      {/* 
        Header section with title and add button
        EN: Displays the page title and provides a button to add new people
        PT: Exibe o título da página e fornece um botão para adicionar novas pessoas
      */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Pessoas</Heading>
        <Button 
          leftIcon={<AddIcon />} 
          colorScheme="blue" 
          onClick={() => navigate('/people/new')}
        >
          Nova Pessoa
        </Button>
      </Flex>

      {/* 
        Content section - shows spinner while loading or table when data is available
        EN: Displays a loading spinner or the people table based on loading state
        PT: Exibe um spinner de carregamento ou a tabela de pessoas com base no estado de carregamento
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
              <Th>CPF</Th>
              <Th>Email</Th>
              <Th>Telefone</Th>
              <Th>Status</Th>
              <Th>Ações</Th>
            </Tr>
          </Thead>
          <Tbody>
            {people.length > 0 ? (
              people.map((person) => (
                <Tr key={person.id}>
                  <Td>{person.name}</Td>
                  <Td>{person.cpf}</Td>
                  <Td>{person.email || '-'}</Td>
                  <Td>{person.phone || person.mobilePhone || '-'}</Td>
                  <Td>
                    <Badge colorScheme={person.active ? 'green' : 'red'}>
                      {person.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </Td>
                  <Td>
                    {/* 
                      Action buttons for each person
                      EN: Provides quick access to view, edit, and delete functions with minimal clicks
                      PT: Fornece acesso rápido às funções de visualizar, editar e excluir com cliques mínimos
                    */}
                    <IconButton
                      aria-label="Ver detalhes"
                      icon={<ViewIcon />}
                      size="sm"
                      mr={2}
                      onClick={() => navigate(`/people/${person.id}`)}
                    />
                    <IconButton
                      aria-label="Editar"
                      icon={<EditIcon />}
                      size="sm"
                      mr={2}
                      onClick={() => navigate(`/people/${person.id}/edit`)}
                    />
                    <IconButton
                      aria-label="Excluir"
                      icon={<DeleteIcon />}
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(person.id)}
                    />
                  </Td>
                </Tr>
              ))
            ) : (
              <Tr>
                <Td colSpan={6} textAlign="center">
                  Nenhuma pessoa encontrada
                </Td>
              </Tr>
            )}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default PeopleList;
