import React from "react";

const Contact = () => (
  <div className="w-full px-4 py-8 md:px-10 2xl:px-20">
    <h1 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-white mb-4">
      Contact Us
    </h1>
    <p className="text-lg text-slate-600 dark:text-slate-300">
      You can reach us at <a href="mailto:info@example.com" className="text-blue-600 underline">info@example.com</a>
    </p>
  </div>
);

export default Contact;