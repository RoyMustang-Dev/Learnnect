import React from 'react';
import { TrendingUp, DollarSign, Users, Target, BarChart3, PieChart } from 'lucide-react';
import { JobMarketData } from '../../data/courseDetailedData';

interface JobMarketChartsProps {
  jobMarket: JobMarketData;
  courseTitle: string;
}

const JobMarketCharts: React.FC<JobMarketChartsProps> = ({ jobMarket, courseTitle }) => {
  // Extract growth percentage from string like "+35% (2024-2029)"
  const getGrowthPercentage = (growthString: string): number => {
    const match = growthString.match(/\+(\d+)%/);
    return match ? parseInt(match[1]) : 25;
  };

  // Extract salary range from string like "₹12-25 LPA"
  const getSalaryRange = (salaryString: string): { min: number; max: number } => {
    const match = salaryString.match(/₹(\d+)-(\d+)/);
    if (match) {
      return { min: parseInt(match[1]), max: parseInt(match[2]) };
    }
    return { min: 8, max: 20 };
  };

  // Extract number from positions string like "50,000+"
  const getPositionsCount = (positionsString: string): number => {
    const match = positionsString.match(/(\d+(?:,\d+)*)/);
    if (match) {
      return parseInt(match[1].replace(/,/g, ''));
    }
    return 25000;
  };

  const growthPercentage = getGrowthPercentage(jobMarket.jobGrowth);
  const salaryRange = getSalaryRange(jobMarket.averageSalary);
  const positionsCount = getPositionsCount(jobMarket.openPositions);

  // Generate salary progression data
  const salaryProgression = [
    { level: 'Entry (0-2y)', salary: Math.round(salaryRange.min * 0.6), color: 'bg-green-400' },
    { level: 'Mid (2-5y)', salary: Math.round(salaryRange.min * 0.9), color: 'bg-blue-400' },
    { level: 'Senior (5+y)', salary: salaryRange.max, color: 'bg-purple-400' },
    { level: 'Lead (8+y)', salary: Math.round(salaryRange.max * 1.3), color: 'bg-orange-400' }
  ];

  // Generate demand level visualization
  const getDemandLevelData = () => {
    const levels = {
      'High': { percentage: 70, color: 'bg-yellow-400' },
      'Very High': { percentage: 85, color: 'bg-orange-400' },
      'Extreme': { percentage: 95, color: 'bg-red-400' }
    };
    return levels[jobMarket.demandLevel] || levels['High'];
  };

  const demandData = getDemandLevelData();

  // Generate growth trend data (simulated 5-year projection)
  const growthTrendData = [
    { year: '2024', jobs: positionsCount },
    { year: '2025', jobs: Math.round(positionsCount * (1 + growthPercentage / 100 / 5)) },
    { year: '2026', jobs: Math.round(positionsCount * (1 + growthPercentage / 100 / 5 * 2)) },
    { year: '2027', jobs: Math.round(positionsCount * (1 + growthPercentage / 100 / 5 * 3)) },
    { year: '2028', jobs: Math.round(positionsCount * (1 + growthPercentage / 100 / 5 * 4)) },
    { year: '2029', jobs: Math.round(positionsCount * (1 + growthPercentage / 100)) }
  ];

  const maxJobs = Math.max(...growthTrendData.map(d => d.jobs));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-magenta mb-4">
          Job Market Intelligence 📊
        </h2>
        <p className="text-gray-300 text-lg">
          Real-time insights into the {courseTitle.toLowerCase()} job market
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl p-6 border border-green-500/30">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="h-8 w-8 text-green-400" />
            <span className="text-xs text-green-400 font-medium">SALARY RANGE</span>
          </div>
          <div className="text-2xl font-bold text-green-400 mb-1">{jobMarket.averageSalary}</div>
          <div className="text-sm text-gray-400">Average Annual Package</div>
        </div>

        <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl p-6 border border-blue-500/30">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="h-8 w-8 text-blue-400" />
            <span className="text-xs text-blue-400 font-medium">GROWTH RATE</span>
          </div>
          <div className="text-2xl font-bold text-blue-400 mb-1">{jobMarket.jobGrowth.split(' ')[0]}</div>
          <div className="text-sm text-gray-400">5-Year Projection</div>
        </div>

        <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl p-6 border border-purple-500/30">
          <div className="flex items-center justify-between mb-4">
            <Users className="h-8 w-8 text-purple-400" />
            <span className="text-xs text-purple-400 font-medium">OPEN POSITIONS</span>
          </div>
          <div className="text-2xl font-bold text-purple-400 mb-1">{jobMarket.openPositions}</div>
          <div className="text-sm text-gray-400">Current Openings</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 rounded-xl p-6 border border-orange-500/30">
          <div className="flex items-center justify-between mb-4">
            <Target className="h-8 w-8 text-orange-400" />
            <span className="text-xs text-orange-400 font-medium">DEMAND LEVEL</span>
          </div>
          <div className="text-2xl font-bold text-orange-400 mb-1">{jobMarket.demandLevel}</div>
          <div className="text-sm text-gray-400">Market Demand</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Salary Progression Chart */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-neon-cyan/30">
          <div className="flex items-center space-x-2 mb-6">
            <BarChart3 className="h-6 w-6 text-neon-cyan" />
            <h3 className="text-xl font-bold text-neon-cyan">Salary Progression</h3>
          </div>
          <div className="space-y-4">
            {salaryProgression.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300 font-medium">{item.level}</span>
                  <span className="text-white font-bold">₹{item.salary} LPA</span>
                </div>
                <div className="w-full bg-gray-700/50 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${item.color} transition-all duration-1000 ease-out`}
                    style={{ 
                      width: `${(item.salary / salaryProgression[salaryProgression.length - 1].salary) * 100}%`,
                      animationDelay: `${index * 200}ms`
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Job Growth Trend Chart */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-neon-magenta/30">
          <div className="flex items-center space-x-2 mb-6">
            <TrendingUp className="h-6 w-6 text-neon-magenta" />
            <h3 className="text-xl font-bold text-neon-magenta">5-Year Growth Projection</h3>
          </div>
          <div className="space-y-3">
            {growthTrendData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <span className="text-gray-300 font-medium w-12">{item.year}</span>
                <div className="flex-1 bg-gray-700/50 rounded-full h-2 relative">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-neon-magenta to-pink-400 transition-all duration-1000 ease-out"
                    style={{ 
                      width: `${(item.jobs / maxJobs) * 100}%`,
                      animationDelay: `${index * 150}ms`
                    }}
                  />
                </div>
                <span className="text-white font-medium w-16 text-right">
                  {(item.jobs / 1000).toFixed(0)}K
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="text-sm text-gray-400">
              Expected growth: <span className="text-neon-magenta font-bold">{growthPercentage}%</span> by 2029
            </span>
          </div>
        </div>

        {/* Market Demand Gauge */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-neon-blue/30">
          <div className="flex items-center space-x-2 mb-6">
            <PieChart className="h-6 w-6 text-neon-blue" />
            <h3 className="text-xl font-bold text-neon-blue">Market Demand Level</h3>
          </div>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="rgb(55 65 81)"
                  strokeWidth="3"
                />
                <path
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  fill="none"
                  stroke="url(#demandGradient)"
                  strokeWidth="3"
                  strokeDasharray={`${demandData.percentage}, 100`}
                  className="transition-all duration-1000 ease-out"
                />
                <defs>
                  <linearGradient id="demandGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f5ff" />
                    <stop offset="100%" stopColor="#ff0080" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-neon-blue">{demandData.percentage}%</span>
              </div>
            </div>
            <div className="text-lg font-bold text-white mb-2">{jobMarket.demandLevel}</div>
            <div className="text-sm text-gray-400">Industry Demand Rating</div>
          </div>
        </div>

        {/* Top Hiring Companies */}
        <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 rounded-xl p-6 border border-yellow-400/30">
          <div className="flex items-center space-x-2 mb-6">
            <Users className="h-6 w-6 text-yellow-400" />
            <h3 className="text-xl font-bold text-yellow-400">Top Hiring Companies</h3>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {jobMarket.topCompanies.map((company, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg border border-gray-600/50 hover:border-yellow-400/50 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <span className="text-white font-medium">{company}</span>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-xs text-green-400">Hiring</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Future Outlook */}
      <div className="bg-gradient-to-r from-neon-cyan/10 to-neon-magenta/10 rounded-xl p-6 border border-neon-cyan/30">
        <h3 className="text-xl font-bold text-neon-cyan mb-4">Future Outlook 🔮</h3>
        <p className="text-gray-300 text-lg leading-relaxed">
          {jobMarket.futureOutlook}
        </p>
      </div>
    </div>
  );
};

export default JobMarketCharts;
