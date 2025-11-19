
import React from 'react';

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    colorClass: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, colorClass }) => {
    return (
        <div className="bg-white p-6 rounded-[20px] shadow-lg shadow-gray-100 border border-gray-50 hover:shadow-xl transition-shadow duration-300 flex items-center space-x-5 group">
            <div className={`p-4 rounded-2xl ${colorClass} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-300`}>
                {/* We assume colorClass passes something like 'text-blue-600'. If not, we adjust usage. */}
                {/* To fix the previous implementation where colorClass was bg-color, we adapt: */}
                <div className={`${colorClass.replace('bg-', 'text-')}`}>
                   <Icon className="w-8 h-8" />
                </div>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wide">{title}</p>
                <p className="text-3xl font-bold text-navy-dark mt-1">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;
