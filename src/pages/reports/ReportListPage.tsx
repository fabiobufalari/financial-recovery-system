import React, { useState, useEffect } from 'react';
import reportService from '../../services/reportService';
import { Report } from '../../types/reportTypes';
import { Link } from 'react-router-dom';

const ReportListPage: React.FC = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            setError(null);
            try {
                // Assuming the service returns pagination info like { content: [], totalPages: X }
                const response = await reportService.getReports(page, 10);
                setReports(response.content || []); // Adjust based on actual API response structure
                setTotalPages(response.totalPages || 0); // Adjust based on actual API response structure
            } catch (err) {
                console.error("Error fetching reports:", err);
                setError("Failed to fetch reports. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, [page]);

    const handlePreviousPage = () => {
        setPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    const handleNextPage = () => {
        setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this report?")) {
            try {
                await reportService.deleteReport(id);
                // Refresh the list after deletion
                setReports(reports.filter(report => report.id !== id));
                // Potentially refetch the current page if items are removed
            } catch (err) {
                console.error("Error deleting report:", err);
                setError("Failed to delete report.");
            }
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Financial Reports</h1>
            
            <Link to="/reports/new" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block">
                Create New Report
            </Link>

            {loading && <p>Loading reports...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {!loading && !error && (
                <>
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Name</th>
                                <th className="py-2 px-4 border-b">Type</th>
                                <th className="py-2 px-4 border-b">Format</th>
                                <th className="py-2 px-4 border-b">Status</th>
                                <th className="py-2 px-4 border-b">Last Generated</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reports.length > 0 ? (
                                reports.map((report) => (
                                    <tr key={report.id}>
                                        <td className="py-2 px-4 border-b">{report.name}</td>
                                        <td className="py-2 px-4 border-b">{report.type}</td>
                                        <td className="py-2 px-4 border-b">{report.format || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{report.status || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b">{report.lastGenerated ? new Date(report.lastGenerated).toLocaleDateString() : 'Never'}</td>
                                        <td className="py-2 px-4 border-b">
                                            <Link to={`/reports/view/${report.id}`} className="text-blue-500 hover:underline mr-2">View</Link>
                                            <Link to={`/reports/edit/${report.id}`} className="text-yellow-500 hover:underline mr-2">Edit</Link>
                                            <button onClick={() => handleDelete(report.id)} className="text-red-500 hover:underline">Delete</button>
                                            {/* Add Download button if applicable */}
                                            {report.filePath && (
                                                <button onClick={() => reportService.downloadReport(report.id).then(blob => {
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    // Extract filename or use a default
                                                    const filename = report.filePath?.split('/').pop() || `report-${report.id}.${report.format?.toLowerCase() || 'bin'}`;
                                                    a.download = filename;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    a.remove();
                                                    window.URL.revokeObjectURL(url);
                                                })} className="text-green-500 hover:underline ml-2">Download</button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="py-4 px-4 text-center text-gray-500">No reports found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex justify-between items-center">
                            <button 
                                onClick={handlePreviousPage} 
                                disabled={page === 0}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span>Page {page + 1} of {totalPages}</span>
                            <button 
                                onClick={handleNextPage} 
                                disabled={page >= totalPages - 1}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ReportListPage;

