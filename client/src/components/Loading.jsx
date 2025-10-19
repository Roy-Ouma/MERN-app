import React
 from "react";


const Loading = () => {
  // Use the logo's orange color: #f97316 (Tailwind orange-500)
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="flex flex-col items-center justify-center w-full h-full">
  <div className="text-4xl md:text-6xl font-bold mb-4 flex items-center">
          <span className="text-black dark:text-white">Maseno</span>
          <span className="text-orange-500 text-5xl md:text-7xl ml-1">Radio</span>
        </div>
  <div className="flex gap-2 md:gap-4 justify-center items-end w-full max-w-xs md:max-w-md mx-auto">
          {[0,1,2,3,4].map((i) => (
            <div
              key={i}
              className="rounded-md animate-bounce"
              style={{
                width: i === 2 ? 24 : 16,
                height: i === 2 ? 48 : 32,
                background: '#f97316',
                animationDelay: `${i * 0.1}s`,
                margin: '0 2px',
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;
            
