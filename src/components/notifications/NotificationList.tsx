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

const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<NotificationDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    fetchNotifications();
  }, []);

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

  const handleViewDetails = (id: number) => {
    navigate(`/notifications/${id}`);
  };

  const handleCreateNew = () => {
    navigate('/notifications/create');
  };

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

  const handleFilterChange = () => {
    fetchNotifications();
  };

  const resetFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    fetchNotifications();
  };

  return (
    <Box p={4}>
      <Flex justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Notifications</Heading>
        <Button colorScheme="blue" onClick={handleCreateNew}>
          Create New Notification
        </Button>
      </Flex>

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
