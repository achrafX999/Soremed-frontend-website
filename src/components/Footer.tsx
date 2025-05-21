import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-2" />
                <span>+212 528 332 266
                </span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-2" />
                <span>contact@soremed.ma</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>Zone industrielle Tassila, N° 42 Av. Alfarabi – Dcheira El Jihadia, Inezgane (Agadir)</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/about" className="text-gray-600 hover:text-blue-600">About Us</a>
              </li>
              <li>
                <a href="/terms" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
              </li>
              <li>
                <a href="/privacy" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
              </li>
              <li>
                <a href="/faq" className="text-gray-600 hover:text-blue-600">FAQ</a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Hours</h3>
            <p className="text-gray-600">Tous les jours : 09:00 – 22:00</p>
            </div>
        </div>

        <div className="border-t border-gray-200 mt-8 pt-8 text-center text-gray-500">
        <p>© {new Date().getFullYear()} Soremed. All rights reserved.</p>

        </div>
      </div>
    </footer>
  );
};

export default Footer;