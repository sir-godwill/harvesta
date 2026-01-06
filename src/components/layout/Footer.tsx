import { useApp } from '@/contexts/AppContext';
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  const { t } = useApp();

  return (
    <footer className="bg-slate-900 text-white">
      {/* Main Footer */}
      <div className="container mx-auto px-4 lg:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1 mb-4 lg:mb-0">
            <div className="text-2xl font-bold mb-4">
              <span className="text-primary">Agro</span>
              <span className="text-white">Market</span>
            </div>
            <p className="text-slate-400 text-sm mb-4">
              Your trusted B2B agricultural marketplace connecting farmers and buyers across Africa and beyond.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.about')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t('footer.howItWorks')}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Farmer Stories</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Careers</a></li>
            </ul>
          </div>
          
          {/* Buyer Services */}
          <div>
            <h4 className="font-semibold mb-4">Buyer Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">Browse Products</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Request Quote</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Trade Assurance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Bulk Orders</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Payment Terms</a></li>
            </ul>
          </div>
          
          {/* Supplier Services */}
          <div>
            <h4 className="font-semibold mb-4">Supplier Services</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li><a href="#" className="hover:text-primary transition-colors">Become a Supplier</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Seller Center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Advertising</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Verification</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Analytics</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                <span>123 Commerce Street, Douala, Cameroon</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0" />
                <span>+237 6XX XXX XXX</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0" />
                <span>contact@agromarket.cm</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 lg:px-6 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-400">
            <p>© 2026 AgroMarket. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-primary transition-colors">{t('footer.terms')}</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
