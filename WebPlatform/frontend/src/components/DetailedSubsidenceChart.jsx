import React, { useState, useEffect } from 'react';
import { AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, Bar, PieChart, Pie, Cell, BarChart, ReferenceLine } from 'recharts';
import { TrendingDown, AlertTriangle, Calendar, BarChart3, Activity, PieChart as PieIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { generatePlaceTimeSeries } from '../data/jhariaPlaces';

const DetailedSubsidenceChart = ({ place, height = 400 }) => {
  const { language } = useLanguage();
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [trend, setTrend] = useState(null);
  const [chartType, setChartType] = useState('rate'); // 'rate', 'cumulative', 'both'

  useEffect(() => {
    if (place) {
      loadChartData();
    }
  }, [place]);

  const loadChartData = () => {
    setLoading(true);
    
    // Generate realistic time-series data
    const data = generatePlaceTimeSeries(place, 12);
    setChartData(data);
    
    // Calculate trend
    if (data.length >= 3) {
      const recent = data.slice(-3).reduce((sum, d) => sum + d.rate, 0) / 3;
      const older = data.slice(0, 3).reduce((sum, d) => sum + d.rate, 0) / 3;
      const trendValue = older > 0 ? ((recent - older) / older) * 100 : 0;
      
      setTrend({
        value: Math.round(trendValue * 10) / 10,
        increasing: trendValue > 0,
        dangerous: recent > 7 || trendValue > 20,
        recentAvg: Math.round(recent * 10) / 10,
        olderAvg: Math.round(older * 10) / 10
      });
    }
    
    setLoading(false);
  };

  const getRiskColor = (level) => {
    const colors = {
      critical: '#dc2626',
      high: '#ea580c',
      moderate: '#ca8a04',
      low: '#65a30d',
      stable: '#16a34a'
    };
    return colors[level] || '#6b7280';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm" style={{ minHeight: height }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm text-gray-500 mt-2">
              {language === 'hi' ? 'ग्राफ लोड हो रहा है...' : 'Loading chart...'}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const riskColor = getRiskColor(place.riskLevel);
  const threshold = 7; // mm/year danger threshold
  const riskDistribution = ['critical', 'high', 'moderate', 'low', 'stable'].map(level => ({
    name: level,
    value: chartData.filter(d => d.riskLevel === level).length,
    label: {
      hi: level === 'critical' ? 'खतरा' : level === 'high' ? 'उच्च' : level === 'moderate' ? 'मध्यम' : level === 'low' ? 'कम' : 'स्थिर',
      en: level.charAt(0).toUpperCase() + level.slice(1)
    }
  })).filter(item => item.value > 0);

  const chartCards = [
    { value: 'rate', label: language === 'hi' ? 'दर' : 'Rate', icon: Activity },
    { value: 'cumulative', label: language === 'hi' ? 'संचयी' : 'Cumulative', icon: BarChart3 },
    { value: 'both', label: language === 'hi' ? 'दोनों' : 'Both', icon: TrendingDown },
    { value: 'distribution', label: language === 'hi' ? 'जोखिम वितरण' : 'Risk Distribution', icon: PieIcon }
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-primary" />
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                {place.name[language] || place.name.en}
              </h3>
              <p className="text-xs text-gray-500">
                {place.coordinates.lat.toFixed(4)}°N, {place.coordinates.lng.toFixed(4)}°E
              </p>
            </div>
          </div>
          {trend && (
            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
              trend.dangerous ? 'bg-red-50 text-red-600' : 
              trend.increasing ? 'bg-orange-50 text-orange-600' : 
              'bg-green-50 text-green-600'
            }`}>
              <AlertTriangle className={`w-4 h-4 ${trend.dangerous ? '' : 'hidden'}`} />
              <span className="text-sm font-semibold">
                {trend.increasing ? '+' : ''}{trend.value}%
              </span>
            </div>
          )}
        </div>

        {/* Chart Type Selector */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {chartCards.map((type) => (
            <button
              key={type.value}
              onClick={() => setChartType(type.value)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                chartType === type.value
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <type.icon className="w-4 h-4" />
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danger Alert */}
      {trend && trend.dangerous && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-800">
                {language === 'hi' ? '⚠️ खतरनाक रुझान' : '⚠️ Dangerous Trend Detected'}
              </p>
              <p className="text-xs text-red-600 mt-1">
                {language === 'hi' 
                  ? `हाल की औसत दर: ${trend.recentAvg} mm/वर्ष (पहले: ${trend.olderAvg} mm/वर्ष)। कृपया सावधानी बरतें।`
                  : `Recent average rate: ${trend.recentAvg} mm/year (Previous: ${trend.olderAvg} mm/year). Please exercise caution.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Chart */}
      <ResponsiveContainer width="100%" height={height - 150}>
        {chartType === 'both' ? (
          <ComposedChart data={chartData}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={riskColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={riskColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={11}
            />
            <YAxis 
              yAxisId="left"
              stroke="#6b7280"
              fontSize={11}
              label={{ 
                value: language === 'hi' ? 'दर (mm/वर्ष)' : 'Rate (mm/year)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '11px' }
              }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              stroke="#2563eb"
              fontSize={11}
              label={{ 
                value: language === 'hi' ? 'संचयी (mm)' : 'Cumulative (mm)', 
                angle: 90, 
                position: 'insideRight',
                style: { textAnchor: 'middle', fill: '#2563eb', fontSize: '11px' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value, name) => {
                if (name === 'rate') {
                  return [`${value} mm/year`, language === 'hi' ? 'धंसाव दर' : 'Subsidence Rate'];
                }
                return [`${value} mm`, language === 'hi' ? 'संचयी विस्थापन' : 'Cumulative Displacement'];
              }}
            />
            <Area
              yAxisId="left"
              type="monotone"
              dataKey="rate"
              stroke={riskColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="cumulative"
              stroke="#2563eb"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        ) : chartType === 'cumulative' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={11}
            />
            <YAxis 
              stroke="#2563eb"
              fontSize={11}
              label={{ 
                value: language === 'hi' ? 'संचयी विस्थापन (mm)' : 'Cumulative Displacement (mm)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#2563eb', fontSize: '11px' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value} mm`, language === 'hi' ? 'संचयी विस्थापन' : 'Cumulative Displacement']}
            />
            <Line
              type="monotone"
              dataKey="cumulative"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        ) : (
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={riskColor} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={riskColor} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="month" 
              stroke="#6b7280"
              fontSize={11}
            />
            <YAxis 
              stroke="#6b7280"
              fontSize={11}
              label={{ 
                value: language === 'hi' ? 'दर (mm/वर्ष)' : 'Rate (mm/year)', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fill: '#6b7280', fontSize: '11px' }
              }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: '8px',
                fontSize: '12px'
              }}
              formatter={(value) => [`${value} mm/year`, language === 'hi' ? 'धंसाव दर' : 'Subsidence Rate']}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke={riskColor}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorRate)"
            />
          </AreaChart>
        )}
      </ResponsiveContainer>

      {/* Stats Summary */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">{language === 'hi' ? 'औसत दर' : 'Avg Rate'}</p>
          <p className="text-lg font-bold" style={{ color: riskColor }}>
            {place.baseSubsidenceRate} mm/yr
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">{language === 'hi' ? 'अधिकतम' : 'Maximum'}</p>
          <p className="text-lg font-bold text-red-600">
            {place.maxRate} mm/yr
          </p>
        </div>
        <div className="bg-gray-50 p-3 rounded-lg text-center">
          <p className="text-xs text-gray-500 mb-1">{language === 'hi' ? 'संचयी' : 'Cumulative'}</p>
          <p className="text-lg font-bold text-blue-600">
            {place.cumulativeDisplacement} mm
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          <span>
            {language === 'hi' ? 'अंतिम अपडेट:' : 'Last Update:'} {new Date().toLocaleDateString()}
          </span>
        </div>
        <span>
          {language === 'hi' ? 'डेटा स्रोत: Sentinel-1 PS-InSAR' : 'Data Source: Sentinel-1 PS-InSAR'}
        </span>
      </div>
    </div>
  );
};

export default DetailedSubsidenceChart;

