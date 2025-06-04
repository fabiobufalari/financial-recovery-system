import React, { useState } from 'react';
import { FiMapPin, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';

// Sample project data - in a real application, this would come from an API
const projectData = [
  {
    id: 1,
    name: 'Downtown Project',
    location: 'Downtown',
    budget: 500000,
    expenses: 325000,
    completion: 65,
    status: 'IN_PROGRESS',
    coordinates: { x: 30, y: 40 },
    issues: 2
  },
  {
    id: 2,
    name: 'Westside Project',
    location: 'Westside',
    budget: 750000,
    expenses: 375000,
    completion: 50,
    status: 'IN_PROGRESS',
    coordinates: { x: 15, y: 50 },
    issues: 1
  },
  {
    id: 3,
    name: 'Northside Project',
    location: 'Northside',
    budget: 300000,
    expenses: 285000,
    completion: 95,
    status: 'NEARLY_COMPLETE',
    coordinates: { x: 50, y: 15 },
    issues: 0
  },
  {
    id: 4,
    name: 'Eastside Project',
    location: 'Eastside',
    budget: 450000,
    expenses: 450000,
    completion: 100,
    status: 'COMPLETED',
    coordinates: { x: 70, y: 45 },
    issues: 0
  },
  {
    id: 5,
    name: 'Southside Project',
    location: 'Southside',
    budget: 600000,
    expenses: 150000,
    completion: 25,
    status: 'IN_PROGRESS',
    coordinates: { x: 45, y: 75 },
    issues: 3
  }
];

const ProjectMap: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-500';
      case 'NEARLY_COMPLETE':
        return 'bg-blue-500';
      case 'IN_PROGRESS':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <FiCheckCircle className="text-green-500" />;
      case 'NEARLY_COMPLETE':
        return <FiClock className="text-blue-500" />;
      case 'IN_PROGRESS':
        return <FiClock className="text-yellow-500" />;
      default:
        return <FiClock className="text-gray-500" />;
    }
  };

  const filteredProjects = filter === 'all' 
    ? projectData 
    : projectData.filter(project => project.status === filter);

  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Project Map</h3>
        <div className="flex space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">All Projects</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="NEARLY_COMPLETE">Nearly Complete</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
      </div>

      <div className="relative h-64 bg-blue-50 border rounded overflow-hidden">
        {/* Map background with grid lines */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-10">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`col-${i}`} className="border-r border-blue-100 h-full"></div>
          ))}
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={`row-${i}`} className="border-b border-blue-100 w-full"></div>
          ))}
        </div>
        
        {/* Project markers */}
        {filteredProjects.map(project => (
          <div
            key={project.id}
            className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${
              selectedProject === project.id ? 'z-10' : 'z-0'
            }`}
            style={{ left: `${project.coordinates.x}%`, top: `${project.coordinates.y}%` }}
            onClick={() => setSelectedProject(project.id === selectedProject ? null : project.id)}
          >
            <div className={`relative p-1 rounded-full ${getStatusColor(project.status)}`}>
              <FiMapPin className="text-white text-lg" />
              {project.issues > 0 && (
                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {project.issues}
                </div>
              )}
            </div>
            
            {/* Project name label */}
            <div className="absolute mt-1 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow text-xs whitespace-nowrap">
              {project.name}
            </div>
          </div>
        ))}
        
        {/* Project details popup */}
        {selectedProject !== null && (
          <div className="absolute bottom-2 left-2 right-2 bg-white p-3 rounded shadow-lg">
            {(() => {
              const project = projectData.find(p => p.id === selectedProject);
              if (!project) return null;
              
              return (
                <>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-medium">{project.name}</h4>
                      <p className="text-sm text-gray-500">{project.location}</p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(project.status)}
                      <span className="ml-1 text-sm">
                        {project.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500">Budget</p>
                      <p className="font-medium">${project.budget.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Expenses</p>
                      <p className="font-medium">${project.expenses.toLocaleString()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-2">
                    <div className="flex justify-between text-sm">
                      <p className="text-gray-500">Completion</p>
                      <p className="font-medium">{project.completion}%</p>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`${getStatusColor(project.status)} h-2 rounded-full`}
                        style={{ width: `${project.completion}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {project.issues > 0 && (
                    <div className="mt-2 flex items-center text-sm text-red-500">
                      <FiAlertCircle className="mr-1" />
                      {project.issues} issue{project.issues > 1 ? 's' : ''} requiring attention
                    </div>
                  )}
                  
                  <div className="mt-3 text-right">
                    <a href={`/projects/${project.id}`} className="text-blue-500 hover:underline text-sm">
                      View details →
                    </a>
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectMap;
