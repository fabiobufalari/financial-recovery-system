import React from 'react';
import { Box } from '@chakra-ui/react';
import CompanyList from '../../components/companies/CompanyList';

const CompanyListPage: React.FC = () => {
  return (
    <Box>
      <CompanyList />
    </Box>
  );
};

export default CompanyListPage;
