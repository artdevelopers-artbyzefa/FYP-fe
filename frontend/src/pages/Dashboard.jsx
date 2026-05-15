import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getUserInfo } from '../utils/app.utils';

const Dashboard = () => {
  const user = getUserInfo() || { name: 'User' };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-poppins">
      <Header />
      
      <main className="flex-grow pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="bg-white rounded-3xl p-8 lg:p-12 shadow-sm border border-gray-100">
            <h1 className="text-3xl font-black text-navy mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-500 mb-8 font-medium">This is your Final Year Project dashboard.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                <h3 className="font-bold text-navy mb-2">My Project</h3>
                <p className="text-sm text-gray-600">View and manage your current FYP details.</p>
              </div>
              <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                <h3 className="font-bold text-emerald-800 mb-2">Submissions</h3>
                <p className="text-sm text-emerald-600">Submit proposals, reports, and evidence.</p>
              </div>
              <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100">
                <h3 className="font-bold text-amber-800 mb-2">Notifications</h3>
                <p className="text-sm text-amber-600">Stay updated with the latest FYP notices.</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
