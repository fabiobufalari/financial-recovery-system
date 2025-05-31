import React from 'react';
import { Box, Heading } from '@chakra-ui/react';
import NotificationList from '../../components/notifications/NotificationList';

const NotificationListPage: React.FC = () => {
  return (
    <Box p={4}>
      <Heading size="lg" mb={6}>Notification Management</Heading>
      <NotificationList />
    </Box>
  );
};

export default NotificationListPage;
