import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';

const Contact: React.FC = () => {
    const { t } = useTranslation();
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically send the form data to a server
        console.log('Form submitted:', formData);
        setFormSubmitted(true);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const inputClasses = "w-full px-4 py-2 bg-gray-100 dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-green dark:focus:ring-brand-gold transition-colors";

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-green-dark dark:text-brand-light-text">{t('contact_page_title')}</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Contact Info & Map */}
                <motion.div 
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-8"
                >
                    <div className="bg-white dark:bg-brand-dark-secondary p-6 rounded-lg shadow-lg">
                        <h2 className="text-2xl font-bold mb-4 flex items-center gap-3"><FaMapMarkerAlt /> {t('contact_info_title')}</h2>
                        <address className="not-italic space-y-3 text-gray-600 dark:text-gray-300">
                            <p className="flex items-center gap-3"><FaMapMarkerAlt /> {t('footer_address')}</p>
                            <p className="flex items-center gap-3"><FaEnvelope /> <a href={`mailto:${t('footer_email')}`} className="hover:underline">{t('footer_email')}</a></p>
                            <p className="flex items-center gap-3"><FaPhone /> +212 528 123 456</p>
                        </address>
                    </div>
                    {/* Map Placeholder */}
                    <div className="bg-gray-300 dark:bg-gray-700 h-64 rounded-lg shadow-lg flex items-center justify-center text-gray-500 dark:text-gray-400">
                        Map Placeholder
                    </div>
                </motion.div>

                {/* Contact Form */}
                <motion.div 
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white dark:bg-brand-dark-secondary p-8 rounded-lg shadow-lg"
                >
                    {formSubmitted ? (
                        <div className="text-center py-10">
                            <FaPaperPlane className="mx-auto h-12 w-12 text-brand-green dark:text-brand-gold mb-4" />
                            <h3 className="text-2xl font-bold">{t('contact_form_success')}</h3>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold mb-6">{t('contact_form_title')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="sr-only">{t('contact_form_name')}</label>
                                    <input type="text" name="name" id="name" placeholder={t('contact_form_name')} required className={inputClasses} onChange={handleChange} value={formData.name} />
                                </div>
                                <div>
                                    <label htmlFor="email" className="sr-only">{t('contact_form_email')}</label>
                                    <input type="email" name="email" id="email" placeholder={t('contact_form_email')} required className={inputClasses} onChange={handleChange} value={formData.email} />
                                </div>
                                <div>
                                    <label htmlFor="message" className="sr-only">{t('contact_form_message')}</label>
                                    <textarea name="message" id="message" rows={5} placeholder={t('contact_form_message')} required className={inputClasses} onChange={handleChange} value={formData.message}></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full flex justify-center items-center gap-2 bg-brand-green text-white dark:bg-brand-gold dark:text-brand-dark font-bold py-3 px-6 rounded-lg hover:bg-brand-green-dark dark:hover:bg-amber-400 transition duration-300">
                                        <FaPaperPlane /> {t('contact_form_send')}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default Contact;
