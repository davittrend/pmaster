import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Upload } from 'lucide-react';

export function HomePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
          Schedule Your Pinterest Pins
          <span className="text-pink-500"> Effortlessly</span>
        </h1>
        <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
          Streamline your Pinterest marketing with our powerful pin scheduling platform. Upload in bulk, schedule with precision, and manage multiple accounts with ease.
        </p>
        <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-500 hover:bg-pink-600 md:text-lg"
          >
            Get Started
          </Link>
        </div>
      </div>

      <div className="mt-24">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-pink-500 rounded-md shadow-lg">
                  <Upload className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Bulk Upload</h3>
                <p className="mt-5 text-base text-gray-500">
                  Upload multiple pins at once using our CSV template. Save time and streamline your workflow.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-pink-500 rounded-md shadow-lg">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Smart Scheduling</h3>
                <p className="mt-5 text-base text-gray-500">
                  Schedule pins at optimal times with our intelligent scheduling system.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <div className="flow-root bg-white rounded-lg px-6 pb-8">
              <div className="-mt-6">
                <div className="inline-flex items-center justify-center p-3 bg-pink-500 rounded-md shadow-lg">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">Time Optimization</h3>
                <p className="mt-5 text-base text-gray-500">
                  Automatically optimize posting times based on your audience's activity patterns.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}