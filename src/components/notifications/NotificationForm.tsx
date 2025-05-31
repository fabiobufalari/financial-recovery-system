import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  FormErrorMessage
} from '@chakra-ui/react';
import { useToast } from '@chakra-ui/toast';
import { NotificationType, NotificationRequestDTO } from '../../types/notificationTypes';
import { notificationService } from '../../services/notificationService';
import { useNavigate } from 'react-router-dom';

interface NotificationFormProps {
  onSubmitSuccess?: () => void;
}

const NotificationForm: React.FC<NotificationFormProps> = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState<NotificationRequestDTO>({
    recipient: '',
    type: NotificationType.EMAIL,
    subject: '',
    content: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.recipient) {
      newErrors.recipient = 'Recipient is required';
    } else if (formData.type === NotificationType.EMAIL && 
              !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipient)) {
      newErrors.recipient = 'Invalid email format';
    } else if (formData.type === NotificationType.SMS && 
              !/^\+?[0-9]{10,15}$/.test(formData.recipient)) {
      newErrors.recipient = 'Invalid phone number format';
    }

    if (formData.type === NotificationType.EMAIL && !formData.subject) {
      newErrors.subject = 'Subject is required for email notifications';
    }

    if (!formData.content) {
      newErrors.content = 'Content is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await notificationService.createNotification(formData);
      toast({
        title: 'Notification created',
        description: 'The notification has been successfully created.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        navigate('/notifications');
      }
    } catch (error) {
      toast({
        title: 'Error creating notification',
        description: 'There was an error creating the notification.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      console.error('Error creating notification:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/notifications');
  };

  return (
    <Box as="form" onSubmit={handleSubmit} width="100%">
      <VStack spacing={4} align="flex-start">
        <FormControl isInvalid={!!errors.recipient} isRequired>
          <FormLabel>Recipient</FormLabel>
          <Input
            name="recipient"
            value={formData.recipient}
            onChange={handleChange}
            placeholder={formData.type === NotificationType.EMAIL ? 'Email address' : 'Phone number'}
          />
          <FormErrorMessage>{errors.recipient}</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel>Type</FormLabel>
          <Select
            name="type"
            value={formData.type}
            onChange={handleChange}
          >
            {Object.values(NotificationType).map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </Select>
        </FormControl>

        <FormControl isInvalid={!!errors.subject} isRequired={formData.type === NotificationType.EMAIL}>
          <FormLabel>Subject {formData.type !== NotificationType.EMAIL && '(Optional)'}</FormLabel>
          <Input
            name="subject"
            value={formData.subject || ''}
            onChange={handleChange}
            placeholder="Notification subject"
          />
          <FormErrorMessage>{errors.subject}</FormErrorMessage>
        </FormControl>

        <FormControl isInvalid={!!errors.content} isRequired>
          <FormLabel>Content</FormLabel>
          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Notification content"
            rows={5}
          />
          <FormErrorMessage>{errors.content}</FormErrorMessage>
        </FormControl>

        <Box width="100%" pt={4} display="flex" justifyContent="space-between">
          <Button onClick={handleCancel} variant="outline">
            Cancel
          </Button>
          <Button 
            type="submit" 
            colorScheme="blue" 
            isLoading={isSubmitting}
            loadingText="Submitting"
          >
            Create Notification
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default NotificationForm;
