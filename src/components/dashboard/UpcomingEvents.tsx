import React from 'react';
import { FileText, Calendar, MessageSquare, Gavel, Mail } from 'lucide-react';

interface TimelineItem {
  id: string;
  type: 'document' | 'hearing' | 'note' | 'court' | 'notification';
  title: string;
  description: string;
  time: string;
}

const timelineItems: TimelineItem[] = [
  {
    id: '1',
    type: 'document',
    title: 'New document uploaded',
    description: 'Affidavit for Johnson vs. State Corporation',
    time: 'Today, 10:45 AM'
  },
  {
    id: '2',
    type: 'hearing',
    title: 'Hearing scheduled',
    description: 'Smith Divorce Case - May 20, 2023 at 2:00 PM',
    time: 'Yesterday, 3:30 PM'
  },
  {
    id: '3',
    type: 'note',
    title: 'Client note added',
    description: 'Robert Wilson requested urgent meeting',
    time: 'Yesterday, 11:20 AM'
  },
  {
    id: '4',
    type: 'court',
    title: 'Court update',
    description: 'Preliminary hearing completed for Johnson case',
    time: 'May 2, 2023, 4:15 PM'
  },
  {
    id: '5',
    type: 'notification',
    title: 'Notification sent',
    description: 'Document upload notification to client Smith',
    time: 'May 1, 2023, 9:30 AM'
  }
];

const typeConfig = {
  document: { icon: FileText, bgColor: 'bg-indigo-500' },
  hearing: { icon: Calendar, bgColor: 'bg-green-500' },
  note: { icon: MessageSquare, bgColor: 'bg-purple-500' },
  court: { icon: Gavel, bgColor: 'bg-blue-500' },
  notification: { icon: Mail, bgColor: 'bg-yellow-500' }
};

const UpcomingEvents: React.FC = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h2 className="font-semibold text-lg">Case Timeline</h2>
        <p className="text-sm text-gray-500">Recent activities across all cases</p>
      </div>

      <div className="p-6">
        <div className="space-y-6">
          {timelineItems.map((item) => {
            const { icon: Icon, bgColor } = typeConfig[item.type];
            
            return (
              <div key={item.id} className="relative timeline-item pl-8">
                <div className={`absolute left-0 w-6 h-6 rounded-full ${bgColor} flex items-center justify-center text-white`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <div className="mt-1 text-xs text-gray-400">{item.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-6 w-full py-2 px-4 border border-gray-300 rounded-lg text-sm font-medium text-indigo-600 hover:bg-indigo-50 hover:border-indigo-100">
          View Full Timeline
        </button>
      </div>
    </div>
  );
};

export default UpcomingEvents;