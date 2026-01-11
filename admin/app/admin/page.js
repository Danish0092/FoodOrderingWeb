'use client';

import { useEffect, useState } from 'react';
import { categoriesAPI, productsAPI, ordersAPI, mediaAPI } from '@/app/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FolderOpen, Package, ShoppingCart, Image } from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    categories: 0,
    products: 0,
    orders: 0,
    media: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [categories, products, orders, media] = await Promise.all([
        categoriesAPI.getAll(),
        productsAPI.getAll(),
        ordersAPI.getAll(),
        mediaAPI.getAll(),
      ]);

      setStats({
        categories: categories.length,
        products: products.length,
        orders: orders.length,
        media: media.length,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Categories', value: stats.categories, icon: FolderOpen, color: 'bg-blue-500' },
    { label: 'Products', value: stats.products, icon: Package, color: 'bg-green-500' },
    { label: 'Orders', value: stats.orders, icon: ShoppingCart, color: 'bg-purple-500' },
    { label: 'Media Files', value: stats.media, icon: Image, color: 'bg-orange-500' },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/admin/categories" className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors text-center">
            <FolderOpen className="mx-auto mb-2 text-blue-500" size={32} />
            <p className="font-medium">Manage Categories</p>
          </a>
          <a href="/admin/products" className="p-4 border-2 border-gray-200 rounded-lg hover:border-green-500 transition-colors text-center">
            <Package className="mx-auto mb-2 text-green-500" size={32} />
            <p className="font-medium">Manage Products</p>
          </a>
          <a href="/admin/orders" className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 transition-colors text-center">
            <ShoppingCart className="mx-auto mb-2 text-purple-500" size={32} />
            <p className="font-medium">View Orders</p>
          </a>
          <a href="/admin/media" className="p-4 border-2 border-gray-200 rounded-lg hover:border-orange-500 transition-colors text-center">
            <Image className="mx-auto mb-2 text-orange-500" size={32} />
            <p className="font-medium">Media Library</p>
          </a>
        </div>
      </div>
    </div>
  );
}
