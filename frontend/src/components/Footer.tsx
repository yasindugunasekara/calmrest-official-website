
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../contexts/useLanguage';

const Footer = () => {
  const { t } = useLanguage();


  return (
    <footer className="bg-navy text-white">


      {/* Main Footer */}
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12  rounded-full flex items-center justify-center">
                <img
                  src="https://res.cloudinary.com/dcgfwnzzr/image/upload/f_auto,q_auto,c_limit,w_1600/v1760970811/calmrest_logo_vbuoxu.png"
                  alt="Calm Rest logo"
                  className="w-10 h-10 object-contain rounded-full"
                  loading="lazy"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif">Calm Rest</h2>
                <p className="text-sm text-gray-400">Luxury Hotel</p>
              </div>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Experience unparalleled luxury at Calm Rest, where modern elegance meets timeless comfort.
              Our meticulously designed spaces offer the perfect sanctuary for discerning travelers.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-gold transition-colors">
                <Linkedin size={24} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-6 font-serif">{t('contactInfo')}</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin size={20} className="text-gold mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300"> Arachchi gedara</p>
                  <p className="text-gray-300"> Midigama</p>
                  <p className="text-gray-300">Ahangama</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={20} className="text-gold" />
                <p className="text-gray-300">+94 412251712</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={20} className="text-gold" />
                <p className="text-gray-300">info@calmrest.com</p>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-6 font-serif">Quick Links</h3>
            <div className="space-y-3">
              <a href="/rooms" className="block text-gray-300 hover:text-gold transition-colors">
                Rooms & Suites
              </a>
              <a href="/services" className="block text-gray-300 hover:text-gold transition-colors">
                Services
              </a>
              <a href="/about" className="block text-gray-300 hover:text-gold transition-colors">
                About Us
              </a>
              <a href="/contact" className="block text-gray-300 hover:text-gold transition-colors">
                Contact
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Calm Rest Hotel. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-gold text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
