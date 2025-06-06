import React from 'react';
import { Box } from '@chakra-ui/react';
import PersonForm from '../../components/people/PersonForm';

const PersonEditPage: React.FC = () => {
  return (
    <Box>
      <PersonForm isEdit={true} />
    </Box>
  );
};

export default PersonEditPage;
