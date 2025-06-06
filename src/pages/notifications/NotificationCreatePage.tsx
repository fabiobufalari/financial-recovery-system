import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import Sidebar from '../../components/layout/Sidebar';
import NotificationWidget from '../../components/notifications/NotificationWidget';

// Sidebar navigation items
const sidebarItems = [
  { name: 'Dashboard', icon: <FiArrowLeft />, path: '/dashboard' },
  { name: 'Notifications', icon: <FiArrowLeft />, path: '/notifications' },
];

const NotificationCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    type: 'EMAIL',
    subject: '',
    content: '',
    recipient: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.type) {
      newErrors.type = 'Type is required';
    }
    
    if (formData.type !== 'SMS' && !formData.subject) {
      newErrors.subject = 'Subject is required for this notification type';
    }
    
    if (!formData.content) {
      newErrors.content = 'Content is required';
    }
    
    if (!formData.recipient) {
      newErrors.recipient = 'Recipient is required';
    } else {
      // Validate recipient format based on type
      if (formData.type === 'EMAIL' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.recipient)) {
        newErrors.recipient = 'Invalid email format';
      } else if (formData.type === 'SMS' && !/^\+?[0-9]{10,15}$/.test(formData.recipient)) {
        newErrors.recipient = 'Invalid phone number format';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setSubmitting(false);
      setSuccess(true);
      
      // Redirect after success
      setTimeout(() => {
        navigate('/notifications');
      }, 1500);
    }, 1000);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Component */}
      <Sidebar items={sidebarItems} />

      {/* Main Content */}
      <div className="flex-1 ml-20 lg:ml-64 transition-all duration-300">
        <header className="bg-white shadow-sm p-4 flex justify-between items-center">
          <div className="flex items-center">
            <button 
              onClick={() => navigate('/notifications')}
              className="mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <FiArrowLeft />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">Create Notification</h1>
          </div>
          <div className="flex items-center space-x-4">
            <NotificationWidget />
            {/* Add other header elements like user profile dropdown */}
          </div>
        </header>

        <main className="p-6">
          <div className="bg-white rounded shadow overflow-hidden">
            {success ? (
              <div className="p-8 text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <FiSend className="text-green-500 text-2xl" />
                </div>
                <h2 className="text-xl font-semibold mb-2">Notification Created Successfully</h2>
                <p className="text-gray-500 mb-4">Your notification has been queued for delivery.</p>
                <p className="text-sm text-gray-400">Redirecting to notifications list...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
                      Notification Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className={`w-full border rounded px-3 py-2 ${errors.type ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={submitting}
                    >
                      <option value="EMAIL">Email</option>
                      <option value="SMS">SMS</option>
                      <option value="IN_APP">In-App</option>
                    </select>
                    {errors.type && <p className="mt-1 text-sm text-red-500">{errors.type}</p>}
                  </div>
                  
                  {formData.type !== 'SMS' && (
                    <div className="md:col-span-2">
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className={`w-full border rounded px-3 py-2 ${errors.subject ? 'border-red-500' : 'border-gray-300'}`}
                        disabled={submitting}
                      />
                      {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject}</p>}
                    </div>
                  )}
                  
                  <div className="md:col-span-2">
                    <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                      Recipient *
                    </label>
                    <input
                      type="text"
                      id="recipient"
                      name="recipient"
                      value={formData.recipient}
                      onChange={handleChange}
                      placeholder={
                        formData.type === 'EMAIL' 
                          ? 'email@example.com' 
                          : formData.type === 'SMS' 
                            ? '+1234567890' 
                            : 'username'
                      }
                      className={`w-full border rounded px-3 py-2 ${errors.recipient ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={submitting}
                    />
                    {errors.recipient && <p className="mt-1 text-sm text-red-500">{errors.recipient}</p>}
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                      Content *
                    </label>
                    <textarea
                      id="content"
                      name="content"
                      value={formData.content}
                      onChange={handleChange}
                      rows={6}
                      className={`w-full border rounded px-3 py-2 ${errors.content ? 'border-red-500' : 'border-gray-300'}`}
                      disabled={submitting}
                    />
                    {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => navigate('/notifications')}
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    disabled={submitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <FiSend className="mr-2" />
                        Send Notification
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default NotificationCreatePage;
