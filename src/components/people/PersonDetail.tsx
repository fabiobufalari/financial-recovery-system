import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Flex,
  Badge,
  Button,
  Grid,
  GridItem,
  Divider,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { Person } from '../../types/peopleTypes';
import peopleService from '../../services/peopleService';

const PersonDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (id) {
      fetchPerson(id);
    }
  }, [id]);

  const fetchPerson = async (personId: string) => {
    try {
      setLoading(true);
      const data = await peopleService.getPersonById(personId);
      setPerson(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar pessoa',
        description: 'Não foi possível carregar os dados da pessoa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching person:', error);
      navigate('/people');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await peopleService.deletePerson(id);
      toast({
        title: 'Pessoa excluída',
        description: 'A pessoa foi excluída com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/people');
    } catch (error) {
      toast({
        title: 'Erro ao excluir pessoa',
        description: 'Não foi possível excluir a pessoa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error deleting person:', error);
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" my={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (!person) {
    return (
      <Box p={4}>
        <Text>Pessoa não encontrada</Text>
        <Button mt={4} onClick={() => navigate('/people')}>
          Voltar para lista
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">{person.name}</Heading>
        <Flex>
          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            mr={2}
            onClick={() => navigate(`/people/${id}/edit`)}
          >
            Editar
          </Button>
          <Button
            leftIcon={<DeleteIcon />}
            colorScheme="red"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            Excluir
          </Button>
        </Flex>
      </Flex>

      <Badge colorScheme={person.active ? 'green' : 'red'} mb={4}>
        {person.active ? 'Ativo' : 'Inativo'}
      </Badge>

      <Grid templateColumns="repeat(12, 1fr)" gap={6} mt={6}>
        <GridItem colSpan={12}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading size="md" mb={4}>Informações Pessoais</Heading>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text fontWeight="bold">CPF</Text>
                <Text>{person.cpf}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">RG</Text>
                <Text>{person.rg || 'Não informado'}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">Data de Nascimento</Text>
                <Text>{person.birthDate ? new Date(person.birthDate).toLocaleDateString('pt-BR') : 'Não informada'}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">Profissão</Text>
                <Text>{person.profession || 'Não informada'}</Text>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>

        <GridItem colSpan={12}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading size="md" mb={4}>Contato</Heading>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text fontWeight="bold">Email</Text>
                <Text>{person.email || 'Não informado'}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">Telefone</Text>
                <Text>{person.phone || 'Não informado'}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">Celular</Text>
                <Text>{person.mobilePhone || 'Não informado'}</Text>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>

        <GridItem colSpan={12}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading size="md" mb={4}>Endereço</Heading>
            
            <Text>{person.address || 'Endereço não informado'}</Text>
            {(person.city || person.state) && (
              <Text mt={2}>
                {[person.city, person.state].filter(Boolean).join(' - ')}
                {person.zipCode && `, CEP: ${person.zipCode}`}
              </Text>
            )}
          </Box>
        </GridItem>

        {person.notes && (
          <GridItem colSpan={12}>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
              <Heading size="md" mb={4}>Observações</Heading>
              <Text>{person.notes}</Text>
            </Box>
          </GridItem>
        )}
      </Grid>

      <Divider my={6} />

      <Button onClick={() => navigate('/people')}>
        Voltar para lista
      </Button>

      <AlertDialog
        isOpen={isDeleteDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Excluir Pessoa
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir {person.name}? Esta ação não pode ser desfeita.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDeleteDialogOpen(false)}>
                Cancelar
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Excluir
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  );
};

export default PersonDetail;
