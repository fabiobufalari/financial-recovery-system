import React from 'react';

const WeatherWidget: React.FC = () => {
    return (
        <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2">Weather Widget (Placeholder)</h3>
            <p>Weather information will be displayed here.</p>
            {/* Placeholder content */}
            <div className="h-32 bg-blue-100 flex items-center justify-center">
                Weather Info
            </div>
        </div>
    );
};

export default WeatherWidget;

