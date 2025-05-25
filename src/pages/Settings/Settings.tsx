import React, { useState } from 'react';
import { Building2, Users, Shield, Bell, Palette, Share2, Database } from 'lucide-react';
import FirmInformation from './sections/FirmInformation';
import SystemPreferences from './sections/SystemPreferences';

type SettingSection = 'firm' | 'users' | 'security' | 'notifications' | 'customization' | 'integrations' | 'backup';

const Settings = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('firm');

  const menuItems = [
    { id: 'firm', label: 'Firm Settings', icon: Building2 },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'customization', label: 'Customization', icon: Palette },
    { id: 'integrations', label: 'Integrations', icon: Share2 },
    { id: 'backup', label: 'Backup & Restore', icon: Database },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'firm':
        return <FirmInformation />;
      case 'users':
        return <div>User Management Content</div>;
      case 'security':
        return <div>Security Content</div>;
      case 'notifications':
        return <div>Notifications Content</div>;
      case 'customization':
        return <SystemPreferences />;
      case 'integrations':
        return <div>Integrations Content</div>;
      case 'backup':
        return <div>Backup & Restore Content</div>;
      default:
        return <FirmInformation />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow">
          <div className="grid grid-cols-12 h-[calc(100vh-12rem)]">
            {/* Settings Navigation */}
            <div className="col-span-3 border-r border-gray-200">
              <nav className="h-full overflow-y-auto py-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id as SettingSection)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium ${
                        activeSection === item.id
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>            {/* Settings Content */}
            <div className="col-span-9 p-6 overflow-y-auto">
              <div className="max-w-4xl">
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;