import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Switch,
  FormErrorMessage,
  VStack,
  Heading,
  useToast,
  Flex,
  Spinner,
  InputGroup,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { PersonFormData } from '../../types/peopleTypes';
import peopleService from '../../services/peopleService';

interface PersonFormProps {
  isEdit?: boolean;
}

const PersonForm: React.FC<PersonFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<PersonFormData>({
    name: '',
    cpf: '',
    rg: '',
    birthDate: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    mobilePhone: '',
    email: '',
    profession: '',
    notes: '',
    active: true
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchPerson(id);
    }
  }, [isEdit, id]);

  const fetchPerson = async (personId: string) => {
    try {
      setLoading(true);
      const data = await peopleService.getPersonById(personId);
      setFormData(data);
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    
    if (!formData.cpf.trim()) {
      newErrors.cpf = 'CPF é obrigatório';
    } else {
      // Validate CPF format (XXX.XXX.XXX-XX)
      const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
      if (!cpfRegex.test(formData.cpf)) {
        newErrors.cpf = 'CPF deve estar no formato XXX.XXX.XXX-XX';
      }
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      
      if (isEdit && id) {
        await peopleService.updatePerson(id, formData);
        toast({
          title: 'Pessoa atualizada',
          description: 'A pessoa foi atualizada com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await peopleService.createPerson(formData);
        toast({
          title: 'Pessoa criada',
          description: 'A pessoa foi criada com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      
      navigate('/people');
    } catch (error) {
      toast({
        title: isEdit ? 'Erro ao atualizar pessoa' : 'Erro ao criar pessoa',
        description: 'Ocorreu um erro. Por favor, tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error submitting person:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Flex justifyContent="center" my={8}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>
        {isEdit ? 'Editar Pessoa' : 'Nova Pessoa'}
      </Heading>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Nome Completo</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl isRequired isInvalid={!!errors.cpf}>
                <FormLabel>CPF</FormLabel>
                <Input
                  name="cpf"
                  value={formData.cpf}
                  onChange={handleChange}
                  placeholder="XXX.XXX.XXX-XX"
                />
                <FormErrorMessage>{errors.cpf}</FormErrorMessage>
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>RG</FormLabel>
                <Input
                  name="rg"
                  value={formData.rg || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <FormControl>
            <FormLabel>Data de Nascimento</FormLabel>
            <Input
              name="birthDate"
              type="date"
              value={formData.birthDate || ''}
              onChange={handleChange}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Endereço</FormLabel>
            <Input
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </FormControl>
          
          <Grid templateColumns="repeat(3, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Cidade</FormLabel>
                <Input
                  name="city"
                  value={formData.city || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Estado</FormLabel>
                <Input
                  name="state"
                  value={formData.state || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>CEP</FormLabel>
                <Input
                  name="zipCode"
                  value={formData.zipCode || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <Grid templateColumns="repeat(2, 1fr)" gap={4}>
            <GridItem>
              <FormControl>
                <FormLabel>Telefone</FormLabel>
                <Input
                  name="phone"
                  value={formData.phone || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
            
            <GridItem>
              <FormControl>
                <FormLabel>Celular</FormLabel>
                <Input
                  name="mobilePhone"
                  value={formData.mobilePhone || ''}
                  onChange={handleChange}
                />
              </FormControl>
            </GridItem>
          </Grid>
          
          <FormControl isInvalid={!!errors.email}>
            <FormLabel>Email</FormLabel>
            <Input
              name="email"
              type="email"
              value={formData.email || ''}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.email}</FormErrorMessage>
          </FormControl>
          
          <FormControl>
            <FormLabel>Profissão</FormLabel>
            <Input
              name="profession"
              value={formData.profession || ''}
              onChange={handleChange}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>Observações</FormLabel>
            <Textarea
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              rows={4}
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="active" mb="0">
              Pessoa Ativa
            </FormLabel>
            <Switch
              id="active"
              name="active"
              isChecked={formData.active}
              onChange={handleSwitchChange}
            />
          </FormControl>
          
          <Flex gap={4} mt={4}>
            <Button
              colorScheme="gray"
              onClick={() => navigate('/people')}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={submitting}
              loadingText="Salvando..."
            >
              {isEdit ? 'Atualizar' : 'Criar'}
            </Button>
          </Flex>
        </VStack>
      </Box>
    </Box>
  );
};

export default PersonForm;
