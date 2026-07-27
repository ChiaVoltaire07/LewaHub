import React from 'react';

function HeroBanner() {
  return (
    <section className="relative h-[50vh] sm:h-[55vh] md:h-[60vh] lg:h-[65vh] min-h-[400px] overflow-hidden">
      
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')`,
        }}
      />
      
      
      <div className="absolute inset-0 hero-gradient" />

      
      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">
       
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-4">
          <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            Primary & Secondary
          </span>
          <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium bg-white/20 backdrop-blur-sm text-white border border-white/30">
            Bilingual Curriculum
          </span>
        </div>

        
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
          St. Benedict's International College
        </h1>

        
        <div className="text-white/90">
          <span className="text-base sm:text-lg md:text-xl font-medium">
            Bastos, Yaoundé, Cameroon
          </span>
        </div>
      </div>
    </section>
  );
}

export default HeroBanner;