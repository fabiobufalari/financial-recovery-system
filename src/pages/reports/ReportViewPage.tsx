import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import reportService from '../../services/reportService';
import { Report } from '../../types/reportTypes';

const ReportViewPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<Report | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchReport = async () => {
            if (!id) {
                setError("Report ID is missing.");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const data = await reportService.getReportById(id);
                setReport(data);
            } catch (err) {
                console.error("Error fetching report details:", err);
                setError("Failed to fetch report details. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    if (loading) {
        return <p className="container mx-auto p-4">Loading report details...</p>;
    }

    if (error) {
        return <p className="container mx-auto p-4 text-red-500">{error}</p>;
    }

    if (!report) {
        return <p className="container mx-auto p-4">Report not found.</p>;
    }

    const handleDownload = async () => {
        if (!report || !report.id || !report.filePath) return;
        try {
            const blob = await reportService.downloadReport(report.id);
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const filename = report.filePath?.split('/').pop() || `report-${report.id}.${report.format?.toLowerCase() || 'bin'}`;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("Error downloading report:", err);
            setError("Failed to download report.");
        }
    };

    return (
        <div className="container mx-auto p-4">
            <Link to="/reports" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Reports</Link>
            <h1 className="text-2xl font-bold mb-4">Report Details: {report.name}</h1>
            
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><strong className="block text-gray-700">ID:</strong> {report.id}</div>
                    <div><strong className="block text-gray-700">Name:</strong> {report.name}</div>
                    <div><strong className="block text-gray-700">Description:</strong> {report.description || 'N/A'}</div>
                    <div><strong className="block text-gray-700">Type:</strong> {report.type}</div>
                    <div><strong className="block text-gray-700">Format:</strong> {report.format || 'N/A'}</div>
                    <div><strong className="block text-gray-700">Status:</strong> {report.status || 'N/A'}</div>
                    <div><strong className="block text-gray-700">Start Date:</strong> {report.startDate ? new Date(report.startDate).toLocaleString() : 'N/A'}</div>
                    <div><strong className="block text-gray-700">End Date:</strong> {report.endDate ? new Date(report.endDate).toLocaleString() : 'N/A'}</div>
                    <div><strong className="block text-gray-700">Scheduled:</strong> {report.scheduled ? 'Yes' : 'No'}</div>
                    <div><strong className="block text-gray-700">Schedule Cron:</strong> {report.scheduleCron || 'N/A'}</div>
                    <div><strong className="block text-gray-700">Last Generated:</strong> {report.lastGenerated ? new Date(report.lastGenerated).toLocaleString() : 'Never'}</div>
                    <div><strong className="block text-gray-700">Next Generation:</strong> {report.nextGeneration ? new Date(report.nextGeneration).toLocaleString() : 'N/A'}</div>
                    <div><strong className="block text-gray-700">Total Amount:</strong> {report.totalAmount !== undefined ? `${report.currencyCode || '$'} ${report.totalAmount.toFixed(2)}` : 'N/A'}</div>
                    <div><strong className="block text-gray-700">Project ID:</strong> {report.projectId || 'N/A'}</div>
                    <div><strong className="block text-gray-700">Client ID:</strong> {report.clientId || 'N/A'}</div>
                    <div><strong className="block text-gray-700">Public:</strong> {report.isPublic ? 'Yes' : 'No'}</div>
                    <div><strong className="block text-gray-700">Template:</strong> {report.templateName ? `${report.templateName} (ID: ${report.templateId})` : 'N/A'}</div>
                    <div><strong className="block text-gray-700">Created At:</strong> {new Date(report.createdAt).toLocaleString()} by {report.createdBy || 'System'}</div>
                    <div><strong className="block text-gray-700">Updated At:</strong> {report.updatedAt ? `${new Date(report.updatedAt).toLocaleString()} by ${report.updatedBy || 'System'}` : 'N/A'}</div>
                </div>

                {report.parameters && report.parameters.length > 0 && (
                    <div className="mb-4">
                        <h2 className="text-xl font-semibold mb-2">Parameters Used</h2>
                        <ul className="list-disc pl-5">
                            {report.parameters.map((param, index) => (
                                <li key={param.id || index}>{param.displayName || param.name}: {param.value}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="flex items-center justify-between mt-6">
                    <Link to={`/reports/edit/${report.id}`} className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">
                        Edit Report
                    </Link>
                    {report.filePath && (
                        <button onClick={handleDownload} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Download Report
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReportViewPage;

