import React from 'react';
import { Box } from '@chakra-ui/react';
import PeopleList from '../../components/people/PeopleList';

const PeopleListPage: React.FC = () => {
  return (
    <Box>
      <PeopleList />
    </Box>
  );
};

export default PeopleListPage;
