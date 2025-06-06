import React from 'react';
import { Box } from '@chakra-ui/react';
import CompanyForm from '../../components/companies/CompanyForm';

const CompanyEditPage: React.FC = () => {
  return (
    <Box>
      <CompanyForm isEdit={true} />
    </Box>
  );
};

export default CompanyEditPage;
