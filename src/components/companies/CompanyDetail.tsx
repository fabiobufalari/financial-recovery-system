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
  Image,
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
import { Company } from '../../types/companyTypes';
import companyService from '../../services/companyService';

const CompanyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [company, setCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (id) {
      fetchCompany(id);
    }
  }, [id]);

  const fetchCompany = async (companyId: string) => {
    try {
      setLoading(true);
      const data = await companyService.getCompanyById(companyId);
      setCompany(data);
    } catch (error) {
      toast({
        title: 'Erro ao carregar empresa',
        description: 'Não foi possível carregar os dados da empresa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching company:', error);
      navigate('/companies');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    
    try {
      await companyService.deleteCompany(id);
      toast({
        title: 'Empresa excluída',
        description: 'A empresa foi excluída com sucesso.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/companies');
    } catch (error) {
      toast({
        title: 'Erro ao excluir empresa',
        description: 'Não foi possível excluir a empresa.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error deleting company:', error);
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

  if (!company) {
    return (
      <Box p={4}>
        <Text>Empresa não encontrada</Text>
        <Button mt={4} onClick={() => navigate('/companies')}>
          Voltar para lista
        </Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">{company.name}</Heading>
        <Flex>
          <Button
            leftIcon={<EditIcon />}
            colorScheme="blue"
            mr={2}
            onClick={() => navigate(`/companies/${id}/edit`)}
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

      <Badge colorScheme={company.active ? 'green' : 'red'} mb={4}>
        {company.active ? 'Ativo' : 'Inativo'}
      </Badge>

      <Grid templateColumns="repeat(12, 1fr)" gap={6} mt={6}>
        {company.logo && (
          <GridItem colSpan={{ base: 12, md: 4 }}>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
              <Image
                src={company.logo}
                alt={`${company.name} logo`}
                fallbackSrc="https://via.placeholder.com/300x200?text=Logo+não+disponível"
                maxH="200px"
                mx="auto"
              />
            </Box>
          </GridItem>
        )}

        <GridItem colSpan={{ base: 12, md: company.logo ? 8 : 12 }}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading size="md" mb={4}>Informações da Empresa</Heading>
            
            <Grid templateColumns="repeat(2, 1fr)" gap={4}>
              <GridItem>
                <Text fontWeight="bold">CNPJ</Text>
                <Text>{company.cnpj}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">Email</Text>
                <Text>{company.email || 'Não informado'}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">Telefone</Text>
                <Text>{company.phone || 'Não informado'}</Text>
              </GridItem>
              
              <GridItem>
                <Text fontWeight="bold">Website</Text>
                <Text>
                  {company.website ? (
                    <a href={`https://${company.website}`} target="_blank" rel="noopener noreferrer">
                      {company.website}
                    </a>
                  ) : (
                    'Não informado'
                  )}
                </Text>
              </GridItem>
            </Grid>
          </Box>
        </GridItem>

        <GridItem colSpan={12}>
          <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
            <Heading size="md" mb={4}>Endereço</Heading>
            
            <Text>{company.address || 'Endereço não informado'}</Text>
            {(company.city || company.state) && (
              <Text mt={2}>
                {[company.city, company.state].filter(Boolean).join(' - ')}
                {company.zipCode && `, CEP: ${company.zipCode}`}
              </Text>
            )}
          </Box>
        </GridItem>

        {company.description && (
          <GridItem colSpan={12}>
            <Box borderWidth="1px" borderRadius="lg" overflow="hidden" p={4}>
              <Heading size="md" mb={4}>Descrição</Heading>
              <Text>{company.description}</Text>
            </Box>
          </GridItem>
        )}
      </Grid>

      <Divider my={6} />

      <Button onClick={() => navigate('/companies')}>
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
              Excluir Empresa
            </AlertDialogHeader>

            <AlertDialogBody>
              Tem certeza que deseja excluir a empresa {company.name}? Esta ação não pode ser desfeita.
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

export default CompanyDetail;
