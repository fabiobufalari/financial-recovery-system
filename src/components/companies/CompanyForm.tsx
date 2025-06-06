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
  InputLeftAddon
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import { CompanyFormData } from '../../types/companyTypes';
import companyService from '../../services/companyService';

interface CompanyFormProps {
  isEdit?: boolean;
}

const CompanyForm: React.FC<CompanyFormProps> = ({ isEdit = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    cnpj: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    logo: '',
    active: true
  });

  useEffect(() => {
    if (isEdit && id) {
      fetchCompany(id);
    }
  }, [isEdit, id]);

  const fetchCompany = async (companyId: string) => {
    try {
      setLoading(true);
      const data = await companyService.getCompanyById(companyId);
      setFormData(data);
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
      newErrors.name = 'Nome da empresa é obrigatório';
    }
    
    if (!formData.cnpj.trim()) {
      newErrors.cnpj = 'CNPJ é obrigatório';
    } else {
      // Validate CNPJ format (XX.XXX.XXX/XXXX-XX)
      const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
      if (!cnpjRegex.test(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ deve estar no formato XX.XXX.XXX/XXXX-XX';
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
        await companyService.updateCompany(id, formData);
        toast({
          title: 'Empresa atualizada',
          description: 'A empresa foi atualizada com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } else {
        await companyService.createCompany(formData);
        toast({
          title: 'Empresa criada',
          description: 'A empresa foi criada com sucesso.',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }
      
      navigate('/companies');
    } catch (error) {
      toast({
        title: isEdit ? 'Erro ao atualizar empresa' : 'Erro ao criar empresa',
        description: 'Ocorreu um erro. Por favor, tente novamente.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error submitting company:', error);
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
        {isEdit ? 'Editar Empresa' : 'Nova Empresa'}
      </Heading>
      
      <Box as="form" onSubmit={handleSubmit}>
        <VStack spacing={4} align="stretch">
          <FormControl isRequired isInvalid={!!errors.name}>
            <FormLabel>Nome da Empresa</FormLabel>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
            <FormErrorMessage>{errors.name}</FormErrorMessage>
          </FormControl>
          
          <FormControl isRequired isInvalid={!!errors.cnpj}>
            <FormLabel>CNPJ</FormLabel>
            <Input
              name="cnpj"
              value={formData.cnpj}
              onChange={handleChange}
              placeholder="XX.XXX.XXX/XXXX-XX"
            />
            <FormErrorMessage>{errors.cnpj}</FormErrorMessage>
          </FormControl>
          
          <FormControl>
            <FormLabel>Endereço</FormLabel>
            <Input
              name="address"
              value={formData.address || ''}
              onChange={handleChange}
            />
          </FormControl>
          
          <Flex gap={4}>
            <FormControl>
              <FormLabel>Cidade</FormLabel>
              <Input
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Estado</FormLabel>
              <Input
                name="state"
                value={formData.state || ''}
                onChange={handleChange}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>CEP</FormLabel>
              <Input
                name="zipCode"
                value={formData.zipCode || ''}
                onChange={handleChange}
              />
            </FormControl>
          </Flex>
          
          <FormControl>
            <FormLabel>Telefone</FormLabel>
            <Input
              name="phone"
              value={formData.phone || ''}
              onChange={handleChange}
            />
          </FormControl>
          
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
            <FormLabel>Website</FormLabel>
            <InputGroup>
              <InputLeftAddon>https://</InputLeftAddon>
              <Input
                name="website"
                value={formData.website || ''}
                onChange={handleChange}
                placeholder="www.exemplo.com.br"
              />
            </InputGroup>
          </FormControl>
          
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <Textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
            />
          </FormControl>
          
          <FormControl>
            <FormLabel>URL do Logo</FormLabel>
            <Input
              name="logo"
              value={formData.logo || ''}
              onChange={handleChange}
              placeholder="https://exemplo.com/logo.png"
            />
          </FormControl>
          
          <FormControl display="flex" alignItems="center">
            <FormLabel htmlFor="active" mb="0">
              Empresa Ativa
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
              onClick={() => navigate('/companies')}
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

export default CompanyForm;
