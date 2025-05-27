import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ReportForm from '../../components/reports/ReportForm';
import reportService from '../../services/reportService';
import { ReportCreateDTO, ReportUpdateDTO } from '../../types/reportTypes'; // Import both DTOs
import { SubmitHandler } from 'react-hook-form'; // Import SubmitHandler

const ReportCreatePage: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // TODO: Fetch templates if needed for the form
    // const [templates, setTemplates] = useState<Template[]>([]);

    // useEffect(() => {
    //     const fetchTemplates = async () => {
    //         try {
    //             const templateData = await reportService.getTemplates(0, 100); // Fetch all templates for selection
    //             setTemplates(templateData.content || []);
    //         } catch (err) {
    //             console.error("Error fetching templates:", err);
    //             // Handle error fetching templates (optional)
    //         }
    //     };
    //     fetchTemplates();
    // }, []);

    // Use SubmitHandler with the combined type expected by ReportForm
    const handleCreateReport: SubmitHandler<ReportCreateDTO | ReportUpdateDTO> = async (data) => {
        // Type assertion or check if needed, though in create context it will be ReportCreateDTO
        const createData = data as ReportCreateDTO;
        
        setIsLoading(true);
        setError(null);
        try {
            // Convert date strings if necessary before sending
            const payload: ReportCreateDTO = {
                ...createData,
                startDate: createData.startDate ? new Date(createData.startDate).toISOString() : undefined,
                endDate: createData.endDate ? new Date(createData.endDate).toISOString() : undefined,
                // Ensure boolean values are sent correctly
                scheduled: createData.scheduled ?? false,
                isPublic: createData.isPublic ?? false,
            };
            await reportService.createReport(payload);
            navigate('/reports'); // Redirect to the list page after successful creation
        } catch (err) {
            console.error("Error creating report:", err);
            setError("Failed to create report. Please check the details and try again.");
            setIsLoading(false);
        }
        // No need to set isLoading to false if navigation occurs on success
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create New Financial Report</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}
            <ReportForm 
                onSubmit={handleCreateReport} 
                // templates={templates} 
                isLoading={isLoading} 
            />
        </div>
    );
};

export default ReportCreatePage;

