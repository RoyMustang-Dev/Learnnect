import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, BarChart, User } from 'lucide-react';

interface CourseProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    description: string;
    image: string;
    price: number;
    category: string;
    level: string;
    duration: string;
  };
}

const CourseCard: React.FC<CourseProps> = ({ course }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/90 to-neon-black/90 rounded-lg sm:rounded-xl overflow-hidden border border-neon-cyan/30 hover:border-neon-cyan/60 transition-all duration-300 hover:scale-105 flex flex-col backdrop-blur-sm relative group h-full" style={{boxShadow: '0 0 20px rgba(0,255,255,0.2)'}}>
      {/* Glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-neon-cyan/5 to-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg sm:rounded-xl"></div>

      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-40 sm:h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neon-black/60 to-transparent"></div>
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
          <span className="px-2 py-1 sm:px-3 sm:py-1 rounded-full text-xs font-medium bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/40 backdrop-blur-sm" style={{textShadow: '0 0 5px rgba(0,255,255,0.5)'}}>
            {course.category}
          </span>
        </div>
      </div>

      <div className="p-4 sm:p-6 flex-grow relative z-10">
        <div className="flex items-center text-xs sm:text-sm text-cyan-300/80 mb-2">
          <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-neon-cyan" />
          <span className="truncate">{course.instructor}</span>
        </div>

        <h3 className="text-lg sm:text-xl font-bold text-neon-cyan mb-2 line-clamp-2" style={{textShadow: '0 0 10px rgba(0,255,255,0.5)'}}>{course.title}</h3>

        <p className="text-sm sm:text-base text-cyan-200/80 mb-3 sm:mb-4 line-clamp-2">{course.description}</p>

        <div className="flex justify-between items-center text-xs sm:text-sm text-cyan-300/70 mb-3 sm:mb-4">
          <div className="flex items-center">
            <BarChart className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-neon-magenta" />
            <span>{course.level}</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-neon-blue" />
            <span>{course.duration}</span>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 pt-0 mt-auto border-t border-neon-cyan/20 flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center relative z-10">
        <div className="text-center sm:text-left">
          {course.price === 0 ? (
            <span className="text-lg sm:text-xl font-bold text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.8)'}}>Free</span>
          ) : (
            <span className="text-lg sm:text-xl font-bold text-neon-cyan" style={{textShadow: '0 0 10px rgba(0,255,255,0.8)'}}>${course.price.toFixed(2)}</span>
          )}
        </div>
        <Link
          to={`/courses/${course.id}`}
          className="w-full sm:w-auto px-4 py-2 sm:px-6 sm:py-2 bg-gradient-to-r from-neon-magenta/20 to-neon-pink/20 text-neon-magenta border border-neon-magenta/50 rounded-lg hover:border-neon-magenta hover:bg-neon-magenta/10 transition-all duration-300 font-medium backdrop-blur-sm text-center text-sm sm:text-base"
          style={{boxShadow: '0 0 15px rgba(255,0,255,0.3)', textShadow: '0 0 5px rgba(255,0,255,0.8)'}}
        >
          View Course
        </Link>
      </div>
    </div>
  );
};

export default CourseCard;