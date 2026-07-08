import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="text-center text-4xl font-extrabold text-text-primary font-display block">BizLaunch</Link>
        <h2 className="mt-8 text-center text-3xl font-bold text-text-primary font-display">{title}</h2>
        <p className="mt-2 text-center text-base text-slate-600">{subtitle}</p>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-10 px-4 shadow-lg sm:rounded-2xl sm:px-10">{children}</div>
      </div>
    </div>
  );
};

export default AuthLayout;