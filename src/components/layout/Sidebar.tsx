import React from 'react';
import { Box, Flex, Icon, Link, Text, Stack, Divider } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { 
  FiHome, 
  FiBriefcase, 
  FiBell, 
  FiFileText, 
  FiUsers, 
  FiTrello,
  FiDollarSign,
  FiCreditCard,
  FiShoppingBag,
  FiDatabase
} from 'react-icons/fi';

/**
 * Navigation Item Component
 * 
 * EN: This component represents a single navigation item in the sidebar.
 * It highlights the active route and provides visual feedback on hover.
 * 
 * PT: Este componente representa um único item de navegação na barra lateral.
 * Ele destaca a rota ativa e fornece feedback visual ao passar o mouse.
 */
interface NavItemProps {
  icon: React.ElementType;
  children: React.ReactNode;
  to: string;
  isActive?: boolean;
}

/**
 * Navigation Item Component
 * 
 * EN: Renders a navigation link with icon and text, with visual indication of active state.
 * Designed for optimal usability with clear visual feedback.
 * 
 * PT: Renderiza um link de navegação com ícone e texto, com indicação visual do estado ativo.
 * Projetado para usabilidade ideal com feedback visual claro.
 */
const NavItem = ({ icon, children, to, isActive }: NavItemProps) => {
  return (
    <Link
      as={RouterLink}
      to={to}
      style={{ textDecoration: 'none' }}
      _focus={{ boxShadow: 'none' }}
    >
      <Flex
        align="center"
        p="4"
        mx="4"
        borderRadius="lg"
        role="group"
        cursor="pointer"
        bg={isActive ? 'blue.400' : 'transparent'}
        color={isActive ? 'white' : 'inherit'}
        _hover={{
          bg: isActive ? 'blue.500' : 'blue.50',
          color: isActive ? 'white' : 'blue.500',
        }}
      >
        <Icon
          mr="4"
          fontSize="16"
          as={icon}
        />
        <Text fontSize="md">{children}</Text>
      </Flex>
    </Link>
  );
};

/**
 * Sidebar Component
 * 
 * EN: This component provides the main navigation sidebar for the application.
 * It organizes navigation links into logical categories and highlights the current active route.
 * The design focuses on minimizing clicks needed to access key functionality.
 * 
 * PT: Este componente fornece a barra lateral de navegação principal para a aplicação.
 * Ele organiza os links de navegação em categorias lógicas e destaca a rota ativa atual.
 * O design se concentra em minimizar os cliques necessários para acessar funcionalidades principais.
 */
const Sidebar = () => {
  const location = useLocation();
  
  /**
   * Check if a path is active
   * 
   * EN: Determines if the current location matches the given path.
   * PT: Determina se a localização atual corresponde ao caminho fornecido.
   * 
   * @param path - The path to check
   * @returns True if the current location starts with the given path
   */
  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <Box
      bg="white"
      borderRight="1px"
      borderRightColor="gray.200"
      w={{ base: 'full', md: 60 }}
      pos="fixed"
      h="full"
      overflowY="auto"
    >
      {/* 
        Application logo and title
        EN: Displays the application name at the top of the sidebar
        PT: Exibe o nome da aplicação no topo da barra lateral
      */}
      <Flex h="20" alignItems="center" mx="8" justifyContent="space-between">
        <Text fontSize="2xl" fontWeight="bold">
          BuildSystem
        </Text>
      </Flex>
      
      <Stack spacing={0}>
        {/* 
          Dashboard link - main entry point
          EN: Primary navigation item for the dashboard/home page
          PT: Item de navegação principal para a página inicial/dashboard
        */}
        <NavItem icon={FiHome} to="/" isActive={location.pathname === '/'}>
          Dashboard
        </NavItem>
        
        {/* 
          Management section
          EN: Navigation items for entity management (companies, people, projects, etc.)
          PT: Itens de navegação para gerenciamento de entidades (empresas, pessoas, projetos, etc.)
        */}
        <Divider my={2} />
        <Text px="8" py="2" fontSize="xs" fontWeight="semibold" color="gray.500">
          GERENCIAMENTO
        </Text>
        
        <NavItem icon={FiBriefcase} to="/companies" isActive={isActive('/companies')}>
          Empresas
        </NavItem>
        <NavItem icon={FiUsers} to="/people" isActive={isActive('/people')}>
          Pessoas
        </NavItem>
        <NavItem icon={FiTrello} to="/projects" isActive={isActive('/projects')}>
          Projetos
        </NavItem>
        <NavItem icon={FiUsers} to="/employees" isActive={isActive('/employees')}>
          Funcionários
        </NavItem>
        <NavItem icon={FiShoppingBag} to="/suppliers" isActive={isActive('/suppliers')}>
          Fornecedores
        </NavItem>
        
        {/* 
          Financial section
          EN: Navigation items for financial management (cash flow, receivables, payables, etc.)
          PT: Itens de navegação para gestão financeira (fluxo de caixa, contas a receber, contas a pagar, etc.)
        */}
        <Divider my={2} />
        <Text px="8" py="2" fontSize="xs" fontWeight="semibold" color="gray.500">
          FINANCEIRO
        </Text>
        
        <NavItem icon={FiDollarSign} to="/cashflow" isActive={isActive('/cashflow')}>
          Fluxo de Caixa
        </NavItem>
        <NavItem icon={FiCreditCard} to="/receivables" isActive={isActive('/receivables')}>
          Contas a Receber
        </NavItem>
        <NavItem icon={FiCreditCard} to="/payables" isActive={isActive('/payables')}>
          Contas a Pagar
        </NavItem>
        <NavItem icon={FiDatabase} to="/bank" isActive={isActive('/bank')}>
          Integração Bancária
        </NavItem>
        
        {/* 
          System section
          EN: Navigation items for system functions (reports, notifications)
          PT: Itens de navegação para funções do sistema (relatórios, notificações)
        */}
        <Divider my={2} />
        <Text px="8" py="2" fontSize="xs" fontWeight="semibold" color="gray.500">
          SISTEMA
        </Text>
        
        <NavItem icon={FiFileText} to="/reports" isActive={isActive('/reports')}>
          Relatórios
        </NavItem>
        <NavItem icon={FiBell} to="/notifications" isActive={isActive('/notifications')}>
          Notificações
        </NavItem>
      </Stack>
    </Box>
  );
};

export default Sidebar;
