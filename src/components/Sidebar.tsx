import { LayoutDashboard, Users, BookOpen, HelpCircle, BarChart2, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Students', path: '/students' },
  { icon: BookOpen, label: 'Chapter', path: '/chapter' },
  { icon: HelpCircle, label: 'Help', path: '/help' },
  { icon: BarChart2, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen">
      <div className="p-6">
        <img src="/logo.svg" alt="Quyl" className="h-8" />
      </div>
      <nav className="mt-6">
        {navItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 hover:text-blue-600 ${
              item.label === 'Students' ? 'bg-gray-50 text-blue-600' : ''
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}