import React from 'react';
import { Bell, Package2, TrendingUp } from 'lucide-react';

const NewsPage: React.FC = () => {
  const news = [
    {
      id: 1,
      title: "New Medication: PainRelief Pro",
      date: "2024-03-20",
      category: "New Products",
      description: "Introducing PainRelief Pro, a revolutionary new pain management solution with extended release formula.",
      image: "https://images.pexels.com/photos/3683098/pexels-photo-3683098.jpeg",
    },
    {
      id: 2,
      title: "Updated Shipping Policy",
      date: "2024-03-18",
      category: "Updates",
      description: "We've improved our shipping process to ensure faster delivery times for all orders.",
      image: "https://images.pexels.com/photos/4021779/pexels-photo-4021779.jpeg",
    },
    {
      id: 3,
      title: "Spring Health Tips",
      date: "2024-03-15",
      category: "Health Tips",
      description: "Essential health tips for the spring season to keep you and your family healthy.",
      image: "https://images.pexels.com/photos/4047186/pexels-photo-4047186.jpeg",
    }
  ];

  const stats = [
    {
      title: "New Products This Month",
      value: "15",
      icon: Package2,
      color: "bg-blue-500"
    },
    {
      title: "Inventory Updates",
      value: "24",
      icon: Bell,
      color: "bg-green-500"
    },
    {
      title: "Price Changes",
      value: "8",
      icon: TrendingUp,
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">News & Updates</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${stat.color} p-3 rounded-lg`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <div className="flex justify-between items-start">
                <span className="inline-block px-3 py-1 text-sm font-semibold text-green-600 bg-green-100 rounded-full">
                  {item.category}
                </span>
                <span className="text-sm text-gray-500">{item.date}</span>
              </div>
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-2 text-gray-600">{item.description}</p>
              <button className="mt-4 text-green-600 hover:text-green-800 font-medium">
                Read more →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPage;