import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
// Removed unused ReportParameterDTO import
import { ReportCreateDTO, ReportUpdateDTO, Report } from '../../types/reportTypes'; 
// Removed unused ParameterType import. ReportType and ReportFormat are used in selects.
import { ReportType, ReportFormat } from '../../types/enums'; 
import { Template } from '../../types/templateTypes'; // Assuming template types are defined

interface ReportFormProps {
    onSubmit: SubmitHandler<ReportCreateDTO | ReportUpdateDTO>;
    initialData?: Report; // For editing
    templates?: Template[]; // For template selection
    isLoading?: boolean;
}

// Combine DTOs for form type, making fields optional for update
type ReportFormData = Partial<ReportCreateDTO & ReportUpdateDTO>;

const ReportForm: React.FC<ReportFormProps> = ({ onSubmit, initialData, templates = [], isLoading = false }) => {
    // Removed unused 'control' from destructuring
    const { register, handleSubmit, watch, formState: { errors } } = useForm<ReportFormData>({
        defaultValues: initialData ? {
            ...initialData,
            // Ensure boolean values are handled correctly if they come as strings or null
            scheduled: initialData.scheduled ?? false,
            isPublic: initialData.isPublic ?? false,
            // Map parameters if needed for form structure
            parameters: initialData.parameters?.map(p => ({ name: p.name, value: p.value })) || []
        } : {
            scheduled: false,
            isPublic: false,
            parameters: []
        },
    });

    const isEditMode = !!initialData;
    const watchScheduled = watch("scheduled");

    // Removed unused 'renderParameterInput' function
    // const renderParameterInput = (param: ReportParameterDTO, index: number) => { ... };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            {/* Report Name */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Report Name *
                </label>
                <input
                    id="name"
                    type="text"
                    {...register("name", { required: "Report name is required" })}
                    className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message}</p>}
            </div>

            {/* Description */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                    Description
                </label>
                <textarea
                    id="description"
                    {...register("description")}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    rows={3}
                />
            </div>

            {/* Report Type */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="type">
                    Report Type *
                </label>
                <select
                    id="type"
                    {...register("type", { required: "Report type is required" })}
                    className={`shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.type ? 'border-red-500' : ''}`}
                >
                    <option value="">Select Type</option>
                    {Object.values(ReportType).map(type => (
                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                    ))}
                </select>
                {errors.type && <p className="text-red-500 text-xs italic">{errors.type.message}</p>}
            </div>

            {/* Report Format */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="format">
                    Format
                </label>
                <select
                    id="format"
                    {...register("format")}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select Format (Optional)</option>
                    {Object.values(ReportFormat).map(format => (
                        <option key={format} value={format}>{format}</option>
                    ))}
                </select>
            </div>

            {/* Template Selection */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="templateId">
                    Template (Optional)
                </label>
                <select
                    id="templateId"
                    {...register("templateId")}
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="">Select a Template</option>
                    {templates.map(template => (
                        <option key={template.id} value={template.id}>{template.name}</option>
                    ))}
                </select>
                {/* TODO: Add logic to load parameters based on selected template */} 
            </div>

            {/* Dates */}
            <div className="mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="startDate">
                        Start Date
                    </label>
                    <input
                        id="startDate"
                        type="datetime-local"
                        {...register("startDate")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div>
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endDate">
                        End Date
                    </label>
                    <input
                        id="endDate"
                        type="datetime-local"
                        {...register("endDate")}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
            </div>

            {/* Scheduling */}
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Scheduling
                </label>
                <div className="flex items-center mb-2">
                    <input
                        id="scheduled"
                        type="checkbox"
                        {...register("scheduled")}
                        className="mr-2 leading-tight"
                    />
                    <label htmlFor="scheduled" className="text-sm">
                        Enable Scheduled Generation
                    </label>
                </div>
                {watchScheduled && (
                    <div>
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="scheduleCron">
                            Schedule Cron Expression *
                        </label>
                        <input
                            id="scheduleCron"
                            type="text"
                            {...register("scheduleCron", { required: watchScheduled ? "Cron expression is required for scheduled reports" : false })}
                            className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.scheduleCron ? 'border-red-500' : ''}`}
                            placeholder="e.g., 0 0 * * *"
                        />
                        {errors.scheduleCron && <p className="text-red-500 text-xs italic">{errors.scheduleCron.message}</p>}
                    </div>
                )}
            </div>

            {/* Other Fields (Project ID, Client ID, Amount, Currency, Public) - Add as needed */}
            {/* Example: Public Toggle */}
             <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                    Visibility
                </label>
                <div className="flex items-center mb-2">
                    <input
                        id="isPublic"
                        type="checkbox"
                        {...register("isPublic")}
                        className="mr-2 leading-tight"
                    />
                    <label htmlFor="isPublic" className="text-sm">
                        Make Report Publicly Accessible (via token)
                    </label>
                </div>
            </div>

            {/* Parameters Section - Needs more robust implementation */}
            {/* Example: Display parameters if editing or based on selected template */}
            {/* {initialData?.parameters && initialData.parameters.length > 0 && (
                <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-2">Parameters</h3>
                    {initialData.parameters.map(renderParameterInput)}
                </div>
            )} */} 
            {/* TODO: Implement dynamic parameter loading and input rendering */} 

            {/* Submit Button */}
            <div className="flex items-center justify-between mt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
                >
                    {isLoading ? 'Saving...' : (isEditMode ? 'Update Report' : 'Create Report')}
                </button>
            </div>
        </form>
    );
};

export default ReportForm;

