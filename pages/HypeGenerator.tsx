import React, { useState } from 'react';
import type { Match } from '../types';
import { generateHypePost } from '../services/geminiService';
import { HiSparkles } from 'react-icons/hi2';
import { useTranslation } from '../hooks/useTranslation';

interface HypeGeneratorProps {
  matches: Match[];
}

const HypeGenerator: React.FC<HypeGeneratorProps> = ({ matches }) => {
  const { t } = useTranslation();
  const upcomingMatches = matches.filter(m => new Date(m.date) >= new Date());
  const [selectedMatchId, setSelectedMatchId] = useState<string>(upcomingMatches[0]?.id.toString() || '');
  const [generatedPost, setGeneratedPost] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    if (!selectedMatchId) {
      setError(t('hype_error_no_match'));
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedPost('');

    const match = upcomingMatches.find(m => m.id.toString() === selectedMatchId);
    if (match) {
      try {
        const post = await generateHypePost(match.opponent, match.date, match.location);
        setGeneratedPost(post);
      } catch (err) {
        setError(t('hype_error_failed'));
      }
    }
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPost);
    alert(t('hype_copied'));
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-8">
        <HiSparkles className="h-10 w-10 text-brand-green dark:text-brand-gold" />
        <h1 className="text-4xl font-bold text-brand-green-dark dark:text-brand-light-text">{t('hype_page_title')}</h1>
      </div>
      <div className="bg-white dark:bg-brand-dark-secondary p-8 rounded-xl shadow-lg space-y-6">
        <p className="text-gray-600 dark:text-gray-300">
          {t('hype_description')}
        </p>
        <div>
          <label htmlFor="match-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {t('hype_select_label')}
          </label>
          <select
            id="match-select"
            value={selectedMatchId}
            onChange={(e) => setSelectedMatchId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-brand-dark dark:text-white focus:outline-none focus:ring-brand-green dark:focus:ring-brand-gold focus:border-brand-green dark:focus:border-brand-gold sm:text-sm rounded-md"
          >
            {upcomingMatches.length > 0 ? (
                upcomingMatches.map(match => (
                    <option key={match.id} value={match.id}>
                        vs {match.opponent} on {new Date(match.date).toLocaleDateString()}
                    </option>
                ))
            ) : (
                <option disabled>{t('hype_select_none')}</option>
            )}
          </select>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isLoading || upcomingMatches.length === 0}
          className="w-full flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-green hover:bg-brand-green-dark dark:bg-brand-gold dark:text-brand-dark dark:hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green dark:focus:ring-brand-gold disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            <HiSparkles className="h-5 w-5 mr-2"/>
          )}
          {isLoading ? t('hype_generating_button') : t('hype_generate_button')}
        </button>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        {generatedPost && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{t('hype_result_title')}</h3>
            <div className="bg-gray-100 dark:bg-brand-dark p-4 rounded-md whitespace-pre-wrap font-mono text-sm text-gray-800 dark:text-gray-200">
                {generatedPost}
            </div>
            <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 text-sm font-medium text-brand-green dark:text-brand-gold bg-green-100 dark:bg-brand-gold/10 rounded-md hover:bg-green-200 dark:hover:bg-brand-gold/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green dark:focus:ring-brand-gold"
            >
                {t('hype_copy_button')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HypeGenerator;