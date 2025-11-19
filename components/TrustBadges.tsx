
import React from 'react';
import { TRUST_BADGES_DATA } from '../constants';

const TrustBadges: React.FC = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {TRUST_BADGES_DATA.map((badge, index) => (
            <div key={index} className="flex flex-col items-center p-6">
              <div className="bg-lavender-light p-5 rounded-2xl mb-4">
                <badge.icon className="h-10 w-10 text-blue-electric" />
              </div>
              <h3 className="text-lg font-semibold text-navy-dark">{badge.title}</h3>
              <p className="text-gray-500">{badge.subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;