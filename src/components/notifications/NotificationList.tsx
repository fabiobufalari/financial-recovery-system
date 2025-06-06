import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Table, 
  Thead, 
  Tbody, 
  Tr, 
  Th, 
  Td, 
  Heading, 
  Button, 
  Badge, 
  Flex, 
  Select,
  HStack,
  Text
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useNavigate } from 'react-router-dom';
import { NotificationDTO, NotificationStatus, NotificationType } from '../../types/notificationTypes';
import { notificationService } from '../../services/notificationService';
import { format } from 'date-fns';

/**
 * Notification List Component
 * 
 * EN: This component displays a list of notifications with filtering capabilities
 * by status and type. It provides options to view details and delete notifications.
 * The interface is designed to minimize clicks for common actions.
 * 
 * PT: Este componente exibe uma lista de notificações com capacidades de filtragem
 * por status e tipo. Fornece opções para visualizar detalhes e excluir notificações.
 * A interface é projetada para minimizar cliques para ações comuns.
 */
const NotificationList: React.FC = () => {
  // State management
  // EN: State hooks for storing notifications data, loading status, and filter values
  // PT: Hooks de estado para armazenar dados de notificações, status de carregamento e valores de filtro
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const navigate = useNavigate();
  const toast = useToast();

  /**
   * EN: Fetch notifications when component mounts
   * PT: Busca notificações quando o componente é montado
   */
  useEffect(() => {
    fetchNotifications();
  }, []);

  /**
   * Fetch notifications from the API
   * 
   * EN: Retrieves notifications from the backend service based on applied filters.
   * Updates the component state with the fetched data.
   * 
   * PT: Recupera notificações do serviço de backend com base nos filtros aplicados.
   * Atualiza o estado do componente com os dados obtidos.
   */
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      let result: NotificationDTO[];
      
      if (statusFilter && !typeFilter) {
        result = await notificationService.getNotificationsByStatus(statusFilter);
      } else if (typeFilter && !statusFilter) {
        result = await notificationService.getNotificationsByType(typeFilter);
      } else {
        result = await notificationService.getAllNotifications();
      }
      
      setNotifications(result);
    } catch (error) {
      toast({
        title: 'Error fetching notifications',
        description: 'There was an error loading the notifications.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle notification deletion
   * 
   * EN: Deletes a notification by its ID and updates the UI accordingly.
   * Provides feedback to the user about the operation result.
   * 
   * PT: Exclui uma notificação pelo seu ID e atualiza a interface de acordo.
   * Fornece feedback ao usuário sobre o resultado da operação.
   * 
   * @param id - The ID of the notification to delete
   */
  const handleDelete = async (id: number) => {
    try {
      await notificationService.deleteNotification(id);
      setNotifications(notifications.filter(notification => notification.id !== id));
      toast({
        title: 'Notification deleted',
        description: 'The notification has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error deleting notification',
        description: 'There was an error deleting the notification.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error deleting notification:', error);
    }
  };

  /**
   * Navigate to notification details
   * 
   * EN: Navigates to the details page for a specific notification.
   * PT: Navega para a página de detalhes de uma notificação específica.
   * 
   * @param id - The ID of the notification to view
   */
  const handleViewDetails = (id: number) => {
    navigate(`/notifications/${id}`);
  };

  /**
   * Navigate to create notification page
   * 
   * EN: Navigates to the page for creating a new notification.
   * PT: Navega para a página de criação de uma nova notificação.
   */
  const handleCreateNew = () => {
    navigate('/notifications/create');
  };

  /**
   * Get badge color for notification status
   * 
   * EN: Returns the appropriate color scheme for a status badge based on the notification status.
   * PT: Retorna o esquema de cores apropriado para um badge de status com base no status da notificação.
   * 
   * @param status - The notification status
   * @returns The color scheme name for the badge
   */
  const getStatusBadgeColor = (status: NotificationStatus) => {
    switch (status) {
      case NotificationStatus.PENDING:
        return 'yellow';
      case NotificationStatus.SENT:
        return 'green';
      case NotificationStatus.DELIVERED:
        return 'blue';
      case NotificationStatus.READ:
        return 'purple';
      case NotificationStatus.FAILED:
        return 'red';
      default:
        return 'gray';
    }
  };

  /**
   * Get badge color for notification type
   * 
   * EN: Returns the appropriate color scheme for a type badge based on the notification type.
   * PT: Retorna o esquema de cores apropriado para um badge de tipo com base no tipo da notificação.
   * 
   * @param type - The notification type
   * @returns The color scheme name for the badge
   */
  const getTypeBadgeColor = (type: NotificationType) => {
    switch (type) {
      case NotificationType.EMAIL:
        return 'blue';
      case NotificationType.SMS:
        return 'green';
      case NotificationType.IN_APP:
        return 'purple';
      default:
        return 'gray';
    }
  };

  /**
   * Apply filters and fetch notifications
   * 
   * EN: Applies the selected filters and fetches notifications based on them.
   * PT: Aplica os filtros selecionados e busca notificações com base neles.
   */
  const handleFilterChange = () => {
    fetchNotifications();
  };

  /**
   * Reset all filters and fetch all notifications
   * 
   * EN: Clears all applied filters and fetches all notifications.
   * PT: Limpa todos os filtros aplicados e busca todas as notificações.
   */
  const resetFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    fetchNotifications();
  };

  return (
    <Box p={4}>
      {/* 
        Header section with title and create button
        EN: Displays the page title and provides a button to create new notifications
        PT: Exibe o título da página e fornece um botão para criar novas notificações
      */}
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Notifications</Heading>
        <Button colorScheme="blue" onClick={handleCreateNew}>
          Create New Notification
        </Button>
      </Flex>

      {/* 
        Filter controls
        EN: Provides dropdown selects and buttons for filtering notifications
        PT: Fornece seletores dropdown e botões para filtrar notificações
      */}
      <HStack spacing={4} mb={6}>
        <Select 
          placeholder="Filter by Status" 
          value={statusFilter} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
          maxW="200px"
        >
          {Object.values(NotificationStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </Select>
        <Select 
          placeholder="Filter by Type" 
          value={typeFilter} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTypeFilter(e.target.value)}
          maxW="200px"
        >
          {Object.values(NotificationType).map(type => (
            <option key={type} value={type}>{type}</option>
          ))}
        </Select>
        <Button onClick={handleFilterChange} colorScheme="blue" size="md">
          Apply Filters
        </Button>
        <Button onClick={resetFilters} variant="outline" size="md">
          Reset
        </Button>
      </HStack>

      {/* 
        Content section - shows loading text, empty state, or notifications table
        EN: Displays appropriate content based on loading state and data availability
        PT: Exibe conteúdo apropriado com base no estado de carregamento e disponibilidade de dados
      */}
      {loading ? (
        <Text>Loading notifications...</Text>
      ) : notifications.length === 0 ? (
        <Text>No notifications found.</Text>
      ) : (
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Recipient</Th>
              <Th>Type</Th>
              <Th>Subject</Th>
              <Th>Status</Th>
              <Th>Created At</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {notifications.map((notification) => (
              <Tr key={notification.id}>
                <Td>{notification.id}</Td>
                <Td>{notification.recipient}</Td>
                <Td>
                  <Badge colorScheme={getTypeBadgeColor(notification.type)}>
                    {notification.type}
                  </Badge>
                </Td>
                <Td>{notification.subject || '-'}</Td>
                <Td>
                  <Badge colorScheme={getStatusBadgeColor(notification.status)}>
                    {notification.status}
                  </Badge>
                </Td>
                <Td>
                  {notification.createdAt ? format(new Date(notification.createdAt), 'yyyy-MM-dd HH:mm') : '-'}
                </Td>
                <Td>
                  {/* 
                    Action buttons for each notification
                    EN: Provides quick access to view and delete functions with minimal clicks
                    PT: Fornece acesso rápido às funções de visualizar e excluir com cliques mínimos
                  */}
                  <HStack spacing={2}>
                    <Button size="sm" onClick={() => handleViewDetails(notification.id)}>
                      View
                    </Button>
                    <Button size="sm" colorScheme="red" onClick={() => handleDelete(notification.id)}>
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      )}
    </Box>
  );
};

export default NotificationList;
