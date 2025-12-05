// ActivityFeedSection.jsx
import React, { useState } from 'react';

const ActivityFeedSection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Fake activity data for admin dashboard
  const activities = [
    {
      id: 1,
      user: {
        initials: 'DR',
        name: 'Darek Rom',
        role: 'Admin',
        color: 'bg-blue-100 text-blue-600'
      },
      timestamp: '2 hours ago',
      type: 'Document Shared',
      title: 'Shared project document',
      description: 'A classic serif font designed for on-screen reading and visual appeal. This typography will be used across all marketing materials.',
      link: {
        text: 'This app > Flickr',
        url: '#'
      },
      tags: [
        { text: 'Design', color: 'bg-blue-50 text-blue-700' },
        { text: 'Typography', color: 'bg-purple-50 text-purple-700' }
      ],
      category: 'document'
    },
    {
      id: 2,
      user: {
        initials: 'AD',
        name: 'Admin User',
        role: 'Admin',
        color: 'bg-red-100 text-red-600'
      },
      timestamp: '3 hours ago',
      type: 'User Management',
      title: 'Updated user permissions',
      description: 'Modified access levels for 3 team members. Granted admin access to Sarah Chen.',
      link: {
        text: 'Settings > Users > Permissions',
        url: '#'
      },
      tags: [
        { text: 'Security', color: 'bg-red-50 text-red-700' },
        { text: 'Admin', color: 'bg-gray-50 text-gray-700' }
      ],
      category: 'admin'
    },
    {
      id: 3,
      user: {
        initials: 'MM',
        name: 'Morgan Mc',
        role: 'Manager',
        color: 'bg-purple-100 text-purple-600'
      },
      timestamp: 'Yesterday, 10:30 AM',
      type: 'Project Assigned',
      title: 'Assigned team to project',
      description: 'You\'ve been added to the Project Helium team with full access to all resources and documentation.',
      link: {
        text: 'Projects > Helium 01',
        url: '#'
      },
      tags: [
        { text: 'Team', color: 'bg-teal-50 text-teal-700' },
        { text: 'Access', color: 'bg-gray-50 text-gray-700' }
      ],
      category: 'project'
    },
    {
      id: 4,
      user: {
        initials: 'TJ',
        name: 'Taylor Jones',
        role: 'Designer',
        color: 'bg-yellow-100 text-yellow-600'
      },
      timestamp: 'April 10, 2:15 PM',
      type: 'File Uploaded',
      title: 'Uploaded wireframes',
      description: 'Mobile app wireframes for the upcoming customer portal. Includes 12 screens with detailed annotations.',
      link: {
        text: 'Design > Wireframes > Mobile Portal',
        url: '#'
      },
      tags: [
        { text: 'Wireframes', color: 'bg-blue-50 text-blue-700' },
        { text: 'Mobile', color: 'bg-gray-50 text-gray-700' }
      ],
      category: 'file'
    },
    {
      id: 5,
      user: {
        initials: 'SY',
        name: 'System',
        role: 'System',
        color: 'bg-gray-100 text-gray-600'
      },
      timestamp: 'April 9, 11:20 AM',
      type: 'System Update',
      title: 'Database backup completed',
      description: 'Nightly database backup completed successfully. Backup size: 2.4GB. All systems operational.',
      link: {
        text: 'System > Backups > Logs',
        url: '#'
      },
      tags: [
        { text: 'System', color: 'bg-gray-50 text-gray-700' },
        { text: 'Backup', color: 'bg-green-50 text-green-700' }
      ],
      category: 'system'
    },
    {
      id: 6,
      user: {
        initials: 'KR',
        name: 'Kim Rossi',
        role: 'Manager',
        color: 'bg-pink-100 text-pink-600'
      },
      timestamp: 'April 8, 4:00 PM',
      type: 'Settings Changed',
      title: 'Updated system settings',
      description: 'Modified notification preferences and updated email templates for all users.',
      link: {
        text: 'Settings > Notifications',
        url: '#'
      },
      tags: [
        { text: 'Settings', color: 'bg-yellow-50 text-yellow-700' },
        { text: 'Config', color: 'bg-purple-50 text-purple-700' }
      ],
      category: 'settings'
    },
    {
      id: 7,
      user: {
        initials: 'AD',
        name: 'Admin User',
        role: 'Admin',
        color: 'bg-red-100 text-red-600'
      },
      timestamp: 'April 8, 11:00 AM',
      type: 'User Added',
      title: 'New user registered',
      description: 'New team member Alex Johnson has been onboarded. Assigned to Development team.',
      link: {
        text: 'Users > Active Users',
        url: '#'
      },
      tags: [
        { text: 'Onboarding', color: 'bg-blue-50 text-blue-700' },
        { text: 'Users', color: 'bg-indigo-50 text-indigo-700' }
      ],
      category: 'admin'
    },
    {
      id: 8,
      user: {
        initials: 'SY',
        name: 'System',
        role: 'System',
        color: 'bg-gray-100 text-gray-600'
      },
      timestamp: 'April 7, 3:30 PM',
      type: 'Security Alert',
      title: 'Failed login attempts',
      description: 'Detected 3 failed login attempts from unknown IP address. Security protocols activated.',
      link: {
        text: 'Security > Login Logs',
        url: '#'
      },
      tags: [
        { text: 'Security', color: 'bg-red-50 text-red-700' },
        { text: 'Alert', color: 'bg-orange-50 text-orange-700' }
      ],
      category: 'system'
    }
  ];

  const filters = [
    { id: 'all', label: 'All Activity', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
    { id: 'admin', label: 'Admin Actions', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z' },
    { id: 'system', label: 'System', icon: 'M5 12.55a11 11 0 0114.08 0M12 16v4m-2-2h4m-1-6a3 3 0 11-6 0 3 3 0 016 0z' },
    { id: 'document', label: 'Documents', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'project', label: 'Projects', icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' },
    { id: 'file', label: 'Files', icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'settings', label: 'Settings', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' }
  ];

  // Get current filter label
  const currentFilter = filters.find(f => f.id === activeFilter) || filters[0];

  // Filter activities based on active filter
  const filteredActivities = activeFilter === 'all' 
    ? activities 
    : activities.filter(activity => activity.category === activeFilter);

  // Activity Card Component
  const ActivityCard = ({ activity }) => {
    const { user, timestamp, type, title, description, link, tags } = activity;

    return (
      <div className="p-5 mb-4 transition-shadow duration-200 bg-white border border-gray-200 rounded-lg hover:shadow-sm">
        <div className="flex items-start">
          {/* User Avatar */}
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${user.color}`}>
              {user.initials}
            </div>
          </div>
          
          <div className="flex-1 ml-4">
            {/* Header with user info and timestamp */}
            <div className="flex flex-col justify-between mb-3 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-gray-800">{user.name}</h3>
                  <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                    {user.role}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-500">{timestamp}</span>
                  <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-xs font-medium rounded">
                    {type}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Activity Content */}
            <div>
              <h4 className="mb-2 text-base font-semibold text-gray-900">{title}</h4>
              <p className="mb-3 text-sm text-gray-600">{description}</p>
              
              {/* Project Link */}
              {link && (
                <a 
                  href={link.url} 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 text-gray-700 rounded text-xs font-medium border border-gray-200 hover:bg-gray-100 transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                  {link.text}
                </a>
              )}
              
              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3">
                {tags.map((tag, index) => (
                  <span 
                    key={index} 
                    className={`px-2 py-0.5 text-xs font-medium rounded ${tag.color}`}
                  >
                    {tag.text}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg shadow-lg">
      {/* Header with title and dropdown filter */}
      <div className="mb-6">
        <div className="flex flex-col justify-between mb-4 sm:flex-row sm:items-center">
          
          
          <div className="mt-3 sm:mt-0">
            {/* Filter Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={currentFilter.icon} />
                </svg>
                <span>{currentFilter.label}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <>
                  {/* Backdrop to close dropdown when clicking outside */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsDropdownOpen(false)}
                  />
                  
                  <div className="absolute right-0 z-20 w-56 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                    <div className="p-2">
                      <div className="px-3 py-2 text-xs font-medium tracking-wider text-gray-500 uppercase">
                        Filter by Type
                      </div>
                      
                      {filters.map(filter => (
                        <button
                          key={filter.id}
                          onClick={() => {
                            setActiveFilter(filter.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-md transition-colors ${
                            activeFilter === filter.id
                              ? 'bg-blue-50 text-blue-600'
                              : 'text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={filter.icon} />
                          </svg>
                          {filter.label}
                          {activeFilter === filter.id && (
                            <svg className="w-4 h-4 ml-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                        </button>
                      ))}
                      
                      <div className="my-2 border-t border-gray-100"></div>
                      
                      <div className="px-3 py-2">
                        <div className="mb-1 text-xs text-gray-500">
                          Showing {filteredActivities.length} of {activities.length} activities
                        </div>
                        {activeFilter !== 'all' && (
                          <button
                            onClick={() => {
                              setActiveFilter('all');
                              setIsDropdownOpen(false);
                            }}
                            className="text-xs font-medium text-blue-600 hover:text-blue-800"
                          >
                            Clear filter
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Active filter info */}
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Updated: Today, 3:45 PM</span>
          </div>
          
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-700">{filteredActivities.length}</span> activities
          </div>
        </div>
      </div>

      {/* Activity cards grid */}
      <div className="grid grid-cols-1 gap-4 ">
        {filteredActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>

      {/* Show message if no activities */}
      {filteredActivities.length === 0 && (
        <div className="py-10 text-center">
          <div className="mb-3 text-gray-400">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 className="font-medium text-gray-500">No activities found</h3>
          <p className="mt-1 text-sm text-gray-400">No activities match the selected filter</p>
          <button
            onClick={() => setActiveFilter('all')}
            className="px-4 py-2 mt-3 text-sm font-medium text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100"
          >
            Show all activities
          </button>
        </div>
      )}

      {/* View more link */}
      {filteredActivities.length > 0 && (
        <div className="pt-4 mt-6 border-t border-gray-100">
          <a 
            href="#" 
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View all activity
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
};

export default ActivityFeedSection;