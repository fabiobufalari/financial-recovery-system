import React from 'react';
import {
  Box,
  Heading,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import NotificationForm from '../../components/notifications/NotificationForm';

const NotificationCreatePage: React.FC = () => {
  return (
    <Box p={4}>
      <Breadcrumb mb={6}>
        <BreadcrumbItem>
          <BreadcrumbLink as={RouterLink} to="/notifications">
            Notifications
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink>Create Notification</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>

      <Heading size="lg" mb={6}>Create New Notification</Heading>
      
      <Box bg="white" p={6} borderRadius="md" boxShadow="sm">
        <NotificationForm />
      </Box>
    </Box>
  );
};

export default NotificationCreatePage;
