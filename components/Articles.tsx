
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from './icons/Icons';
import { ARTICLES_DATA } from '../constants';

const ArticleCard: React.FC<{article: typeof ARTICLES_DATA[0]}> = ({ article }) => (
    <div className="group">
        <div className="rounded-3xl overflow-hidden mb-6">
            <img src={article.imageUrl} alt={article.title} className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" loading="lazy" decoding="async"/>
        </div>
        <h3 className="text-xl font-bold text-navy-dark group-hover:text-blue-electric transition-colors">{article.title}</h3>
        <p className="mt-2 text-gray-600">{article.excerpt}</p>
        <div className="mt-4 flex justify-between items-center text-gray-500">
            <span>{article.date}</span>
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 group-hover:bg-blue-electric group-hover:text-white transition-colors">
                <ArrowRightIcon className="w-5 h-5"/>
            </div>
        </div>
    </div>
);

const Articles: React.FC = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-navy-dark">Nuestros artículos y guías</h2>
           <Link to="/#guias" className="hidden sm:flex items-center space-x-2 bg-white text-navy-dark font-semibold px-5 py-2.5 rounded-full shadow-sm hover:shadow-lg border border-gray-200 hover:text-blue-electric hover:-translate-y-0.5 transform transition-all duration-300">
            <span>Ver todo</span>
            <ArrowRightIcon className="w-5 h-5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {ARTICLES_DATA.map(article => (
                <ArticleCard key={article.id} article={article} />
            ))}
        </div>
      </div>
    </section>
  );
};

export default Articles;