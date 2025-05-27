import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReportForm from '../../components/reports/ReportForm';
import reportService from '../../services/reportService';
// Import both DTOs
import { Report, ReportUpdateDTO, ReportCreateDTO } from '../../types/reportTypes'; 
// Removed unused Template import
// import { Template } from '../../types/templateTypes'; // Assuming template types are defined
import { SubmitHandler } from 'react-hook-form'; // Import SubmitHandler

const ReportEditPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [report, setReport] = useState<Report | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    // TODO: Fetch templates if needed for the form
    // const [templates, setTemplates] = useState<Template[]>([]);

    useEffect(() => {
        const fetchReportAndTemplates = async () => {
            if (!id) {
                setError("Report ID is missing.");
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            setError(null);
            try {
                // Fetch report details
                const reportData = await reportService.getReportById(id);
                setReport(reportData);

                // TODO: Fetch templates if needed
                // const templateData = await reportService.getTemplates(0, 100);
                // setTemplates(templateData.content || []);

            } catch (err) {
                console.error("Error fetching report data:", err);
                setError("Failed to load report data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchReportAndTemplates();
    }, [id]);

    // Use SubmitHandler with the combined type expected by ReportForm
    const handleUpdateReport: SubmitHandler<ReportUpdateDTO | ReportCreateDTO> = async (data) => {
        if (!id) return;
        // Type assertion or check if needed, though in edit context it will be ReportUpdateDTO
        const updateData = data as ReportUpdateDTO;

        setIsSubmitting(true);
        setError(null);
        try {
            // Convert date strings if necessary before sending
            const payload: ReportUpdateDTO = {
                ...updateData,
                startDate: updateData.startDate ? new Date(updateData.startDate).toISOString() : undefined,
                endDate: updateData.endDate ? new Date(updateData.endDate).toISOString() : undefined,
                // Ensure boolean values are sent correctly
                scheduled: updateData.scheduled ?? false,
                isPublic: updateData.isPublic ?? false,
            };
            await reportService.updateReport(id, payload);
            navigate(`/reports/view/${id}`); // Redirect to the view page after successful update
        } catch (err) {
            console.error("Error updating report:", err);
            setError("Failed to update report. Please check the details and try again.");
            setIsSubmitting(false);
        }
         // No need to set isSubmitting to false if navigation occurs on success
    };

    if (isLoading) {
        return <p className="container mx-auto p-4">Loading report data for editing...</p>;
    }

    if (error && !report) { // Show error only if report couldn't be loaded
        return <p className="container mx-auto p-4 text-red-500">{error}</p>;
    }

    if (!report) {
        return <p className="container mx-auto p-4">Report not found.</p>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Edit Financial Report: {report.name}</h1>
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>} {/* Show update errors here */}
            <ReportForm 
                onSubmit={handleUpdateReport} 
                initialData={report} 
                // templates={templates} 
                isLoading={isSubmitting} 
            />
        </div>
    );
};

export default ReportEditPage;

