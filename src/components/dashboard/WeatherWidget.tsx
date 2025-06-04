import React, { useState, useEffect } from 'react';
import { FiSun, FiCloud, FiCloudRain, FiCloudSnow, FiWind } from 'react-icons/fi';

// Sample data - in a real application, this would come from an API
const locations = ['Downtown', 'Westside', 'Northside', 'Eastside', 'Southside'];

interface WeatherData {
  location: string;
  date: string;
  temperatureHigh: number;
  temperatureLow: number;
  conditions: string;
  precipitationChance: number;
  windSpeed: number;
}

const sampleWeatherData: Record<string, WeatherData> = {
  'Downtown': {
    location: 'Downtown',
    date: '2025-04-20',
    temperatureHigh: 72.5,
    temperatureLow: 58.3,
    conditions: 'Partly Cloudy',
    precipitationChance: 20,
    windSpeed: 8.5
  },
  'Westside': {
    location: 'Westside',
    date: '2025-04-20',
    temperatureHigh: 70.8,
    temperatureLow: 56.2,
    conditions: 'Sunny',
    precipitationChance: 10,
    windSpeed: 7.8
  },
  'Northside': {
    location: 'Northside',
    date: '2025-04-20',
    temperatureHigh: 68.2,
    temperatureLow: 53.1,
    conditions: 'Cloudy',
    precipitationChance: 35,
    windSpeed: 11.2
  },
  'Eastside': {
    location: 'Eastside',
    date: '2025-04-20',
    temperatureHigh: 74.1,
    temperatureLow: 59.6,
    conditions: 'Sunny',
    precipitationChance: 5,
    windSpeed: 6.5
  },
  'Southside': {
    location: 'Southside',
    date: '2025-04-20',
    temperatureHigh: 73.2,
    temperatureLow: 58.7,
    conditions: 'Partly Cloudy',
    precipitationChance: 15,
    windSpeed: 7.2
  }
};

const WeatherWidget: React.FC = () => {
  const [selectedLocation, setSelectedLocation] = useState('Downtown');
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      setWeatherData(sampleWeatherData[selectedLocation]);
      setLoading(false);
    }, 500);
  }, [selectedLocation]);

  const getWeatherIcon = (conditions: string) => {
    switch (conditions.toLowerCase()) {
      case 'sunny':
        return <FiSun className="text-yellow-500 text-3xl" />;
      case 'partly cloudy':
        return <FiCloud className="text-gray-400 text-3xl" />;
      case 'cloudy':
        return <FiCloud className="text-gray-500 text-3xl" />;
      case 'rain':
        return <FiCloudRain className="text-blue-500 text-3xl" />;
      case 'snow':
        return <FiCloudSnow className="text-blue-200 text-3xl" />;
      default:
        return <FiSun className="text-yellow-500 text-3xl" />;
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Project Site Weather</h3>
        <select 
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="border rounded px-2 py-1 text-sm"
        >
          {locations.map(location => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="h-32 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : weatherData ? (
        <div className="flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getWeatherIcon(weatherData.conditions)}
              <div className="ml-3">
                <p className="text-2xl font-bold">{weatherData.temperatureHigh.toFixed(1)}°F</p>
                <p className="text-sm text-gray-500">{weatherData.conditions}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Low: {weatherData.temperatureLow.toFixed(1)}°F</p>
              <p className="text-sm text-gray-500">
                <FiWind className="inline mr-1" />
                {weatherData.windSpeed} mph
              </p>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t">
            <div className="flex justify-between text-sm">
              <p className="text-gray-500">Precipitation</p>
              <p className="font-medium">{weatherData.precipitationChance}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${weatherData.precipitationChance}%` }}
              ></div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-gray-500">
            <p>Last updated: Today at {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center text-gray-500">
          No weather data available
        </div>
      )}
    </div>
  );
};

export default WeatherWidget;
