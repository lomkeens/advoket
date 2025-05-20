import React from 'react';
import { Calendar, Clock, FileText, MapPin, Users } from 'lucide-react';

const UpcomingEvents: React.FC = () => {
  // Sample data
  const events = [
    { 
      id: 1, 
      title: 'Smith Deposition', 
      date: '2025-03-15T10:00',
      type: 'Deposition',
      location: 'Office Conference Room',
      relatedCase: 'Smith v. Johnson Corp',
      icon: FileText
    },
    { 
      id: 2, 
      title: 'Team Meeting', 
      date: '2025-03-16T14:30',
      type: 'Meeting',
      location: 'Main Office',
      relatedCase: null,
      icon: Users
    },
    { 
      id: 3, 
      title: 'Zhang Hearing', 
      date: '2025-03-18T09:00',
      type: 'Court',
      location: 'District Court Room 3B',
      relatedCase: 'Zhang IP Dispute',
      icon: Calendar
    },
    { 
      id: 4, 
      title: 'Client Meeting - Williams', 
      date: '2025-03-19T11:30',
      type: 'Client',
      location: 'Office',
      relatedCase: 'Estate of Williams',
      icon: Users
    },
  ];

  // Format date and time
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Get event type color
  const getEventColor = (type: string) => {
    switch (type) {
      case 'Court':
        return 'bg-red-100 text-red-800';
      case 'Deposition':
        return 'bg-purple-100 text-purple-800';
      case 'Client':
        return 'bg-blue-100 text-blue-800';
      case 'Meeting':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="flow-root">
      <ul className="-my-5 divide-y divide-gray-200">
        {events.map((event) => (
          <li key={event.id} className="py-4">
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center ${getEventColor(event.type)}`}>
                  <event.icon className="h-5 w-5" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {event.title}
                </p>
                {event.relatedCase && (
                  <p className="text-sm text-blue-800">
                    {event.relatedCase}
                  </p>
                )}
                <div className="mt-1 flex items-center text-sm text-gray-500">
                  <MapPin className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  <p className="truncate">{event.location}</p>
                </div>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {formatDate(event.date)}
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 justify-end">
                  <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                  {formatTime(event.date)}
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UpcomingEvents;