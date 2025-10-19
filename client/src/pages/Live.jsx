import React, { useState } from "react";

const YOUTUBE_URL = "https://www.youtube.com/@MasenoRadio/live";
const RADIO_API_URL = "https://your-radio-api-url.com/stream";
const FACEBOOK_URL = "https://www.facebook.com/masenoradio/live";

const TABS = [
  { key: "youtube", label: "YouTube", color: "text-red-600" },
  { key: "facebook", label: "Facebook", color: "text-blue-600" },
  { key: "radio", label: "Radio", color: "text-orange-500" },
];

const Live = () => {
  const [activeTab, setActiveTab] = useState("youtube");

  const handleShare = () => {
    let url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "Maseno Radio Live",
        url,
      });
    } else {
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-orange-500">Live Broadcast</h1>
      <div className="flex gap-4 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`px-6 py-2 rounded-full font-semibold border-2 transition-all duration-200 focus:outline-none ${
              activeTab === tab.key
                ? `${tab.color} border-current bg-orange-50 dark:bg-gray-800 shadow`
                : `text-gray-500 border-gray-200 dark:border-gray-700 hover:${tab.color}`
            }`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
        <button
          className="ml-4 px-4 py-2 rounded-full bg-orange-500 text-white font-semibold shadow hover:bg-orange-600 transition"
          onClick={handleShare}
        >
          Share
        </button>
      </div>

      <div className="w-full max-w-3xl">
        {activeTab === "youtube" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-orange-100 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-orange-500 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.8 8.001a2.752 2.752 0 0 0-1.938-1.947C18.003 5.5 12 5.5 12 5.5s-6.003 0-7.862.554A2.752 2.752 0 0 0 2.2 8.001C1.646 9.86 1.646 12 1.646 12s0 2.14.554 3.999a2.752 2.752 0 0 0 1.938 1.947C5.997 18.5 12 18.5 12 18.5s6.003 0 7.862-.554a2.752 2.752 0 0 0 1.938-1.947C22.354 14.14 22.354 12 22.354 12s0-2.14-.554-3.999zM10.5 15.5v-7l6 3.5-6 3.5z"/></svg>
              Watch on YouTube
            </h2>
            <div className="w-full aspect-video bg-black rounded-lg overflow-hidden shadow">
              <iframe
                src="https://www.youtube.com/embed/live_stream?channel=UC4a-Gbdw7vOaccHmFo40b9g"
                title="YouTube Live"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full min-h-[200px]"
              ></iframe>
            </div>
          </div>
        )}
        {activeTab === "facebook" && (
          <div className="bg-gradient-to-br from-blue-50 via-white to-blue-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-blue-100 dark:border-gray-800 relative">
            <h2 className="text-xl font-semibold mb-2 text-blue-600 flex items-center gap-2">
              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg>
              Facebook Live
            </h2>
            <div className="flex flex-col items-center justify-center h-full flex-1 w-full">
              <span className="inline-block px-4 py-2 bg-yellow-400 text-yellow-900 font-bold rounded-full text-lg mt-8 mb-4 animate-pulse shadow">COMING SOON</span>
              <p className="text-gray-500 dark:text-gray-300 text-center">Our Facebook Live stream will be available here soon. Stay tuned!</p>
            </div>
          </div>
        )}
        {activeTab === "radio" && (
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-6 flex flex-col items-center border border-orange-100 dark:border-gray-800">
            <h2 className="text-xl font-semibold mb-2 text-orange-500 flex items-center gap-2">
              <svg className="w-6 h-6 text-orange-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3C7.03 3 3 7.03 3 12c0 4.97 4.03 9 9 9s9-4.03 9-9c0-4.97-4.03-9-9-9zm0 16c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm-1-13h2v6h-2zm0 8h2v2h-2z"/></svg>
              Listen to Radio
            </h2>
            <div className="w-full flex flex-col items-center">
              <audio controls className="w-full">
                <source src={RADIO_API_URL} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <p className="text-gray-500 dark:text-gray-300 text-center mt-2 text-sm">Enjoy our radio stream live on this page. No need to open a new tab!</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Live;