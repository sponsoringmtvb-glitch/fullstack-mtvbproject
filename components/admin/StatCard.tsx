import React from 'react';
import type { IconType } from 'react-icons';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: IconType;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon }) => {
    return (
        <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-md flex items-center space-x-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border border-transparent hover:border-brand-accent-light dark:hover:border-brand-gold">
            <div className="bg-brand-accent-light/10 dark:bg-brand-gold/10 p-4 rounded-full">
                <Icon className="h-8 w-8 text-brand-green dark:text-brand-gold" />
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <p className="text-3xl font-bold text-gray-800 dark:text-white">{value}</p>
            </div>
        </div>
    );
};

export default StatCard;