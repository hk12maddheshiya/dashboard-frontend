import { Search, Bell, Settings } from 'lucide-react';

interface HeaderProps {
  user: {
    name: string;
    avatar: string;
  };
}

export function Header({ user }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center flex-1">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search your course"
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Bell className="h-5 w-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <Settings className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex items-center space-x-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-sm font-medium">{user.name}</span>
          </div>
        </div>
      </div>
    </header>
  );
}