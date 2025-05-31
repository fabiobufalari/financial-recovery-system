import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Badge,
  VStack,
  HStack,
  Button,
  Divider,
  Spinner
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { useParams, useNavigate } from 'react-router-dom';
import { NotificationDTO, NotificationStatus, NotificationType } from '../../types/notificationTypes';
import { notificationService } from '../../services/notificationService';
import { format } from 'date-fns';

const NotificationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [notification, setNotification] = useState<NotificationDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (id) {
      fetchNotification(parseInt(id));
    }
  }, [id]);

  const fetchNotification = async (notificationId: number) => {
    try {
      const data = await notificationService.getNotificationById(notificationId);
      setNotification(data);
    } catch (error) {
      toast({
        title: 'Error fetching notification',
        description: 'There was an error loading the notification details.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error fetching notification:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!notification) return;
    
    try {
      await notificationService.deleteNotification(notification.id);
      toast({
        title: 'Notification deleted',
        description: 'The notification has been successfully deleted.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/notifications');
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

  const handleBack = () => {
    navigate('/notifications');
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

  if (loading) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center" height="300px">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (!notification) {
    return (
      <Box p={4}>
        <Heading size="md" mb={4}>Notification not found</Heading>
        <Button onClick={handleBack}>Back to Notifications</Button>
      </Box>
    );
  }

  return (
    <Box p={4}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading size="lg">Notification Details</Heading>
        <Button onClick={handleBack} variant="outline">
          Back to List
        </Button>
      </HStack>

      <VStack spacing={4} align="stretch" bg="white" p={6} borderRadius="md" boxShadow="sm">
        <HStack justifyContent="space-between">
          <Heading size="md">ID: {notification.id}</Heading>
          <HStack>
            <Badge colorScheme={getTypeBadgeColor(notification.type)} fontSize="md" px={2} py={1}>
              {notification.type}
            </Badge>
            <Badge colorScheme={getStatusBadgeColor(notification.status)} fontSize="md" px={2} py={1}>
              {notification.status}
            </Badge>
          </HStack>
        </HStack>

        <Divider />

        <Box>
          <Text fontWeight="bold">Recipient:</Text>
          <Text>{notification.recipient}</Text>
        </Box>

        {notification.subject && (
          <Box>
            <Text fontWeight="bold">Subject:</Text>
            <Text>{notification.subject}</Text>
          </Box>
        )}

        <Box>
          <Text fontWeight="bold">Content:</Text>
          <Box p={3} bg="gray.50" borderRadius="md" whiteSpace="pre-wrap">
            {notification.content}
          </Box>
        </Box>

        {notification.errorMessage && (
          <Box>
            <Text fontWeight="bold" color="red.500">Error Message:</Text>
            <Text color="red.500">{notification.errorMessage}</Text>
          </Box>
        )}

        <Divider />

        <VStack spacing={2} align="stretch">
          <HStack>
            <Text fontWeight="bold" minWidth="120px">Created At:</Text>
            <Text>{notification.createdAt ? format(new Date(notification.createdAt), 'yyyy-MM-dd HH:mm:ss') : '-'}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold" minWidth="120px">Updated At:</Text>
            <Text>{notification.updatedAt ? format(new Date(notification.updatedAt), 'yyyy-MM-dd HH:mm:ss') : '-'}</Text>
          </HStack>
          <HStack>
            <Text fontWeight="bold" minWidth="120px">Sent At:</Text>
            <Text>{notification.sentAt ? format(new Date(notification.sentAt), 'yyyy-MM-dd HH:mm:ss') : '-'}</Text>
          </HStack>
        </VStack>

        <Divider />

        <Box display="flex" justifyContent="flex-end">
          <Button colorScheme="red" onClick={handleDelete}>
            Delete Notification
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default NotificationDetailPage;
