
import { PSIPage } from './types';

export const PSI_BRAND = {
  blue: '#0054A6',
  gold: '#C5A059',
  dark: '#0a0a0b',
  slate: '#0f0f11'
};

export const PSI_PAGES: PSIPage[] = [
  { id: 'home', name: 'Homepage', url: 'https://psinv.net/', status: 'pending', description: 'Main landing and brand awareness', history: [] },
  { id: 'luxury', name: 'Luxury Projects', url: 'https://psinv.net/off-plan', status: 'pending', description: 'Luxury off-plan and high-end listings', history: [] },
  { id: 'mgmt', name: 'Property Management', url: 'https://psinv.net/property-management', status: 'pending', description: 'Landlord and investor services', history: [] },
  { id: 'mortgage', name: 'Mortgage Services', url: 'https://psinv.net/mortgage-services', status: 'pending', description: 'Financing and mortgage solutions', history: [] },
  { id: 'careers', name: 'Careers', url: 'https://psinv.net/careers', status: 'pending', description: 'Talent acquisition portal', history: [] },
  { id: 'about', name: 'About Us', url: 'https://psinv.net/about-us', status: 'pending', description: 'Company history and mission', history: [] },
  { id: 'sales', name: 'Sales Services', url: 'https://psinv.net/sales-services', status: 'pending', description: 'Buying and advisory services', history: [] },
  { id: 'rent', name: 'Rent Services', url: 'https://psinv.net/rent-services', status: 'pending', description: 'Leasing and tenant services', history: [] },
  { id: 'offplan', name: 'Off-Plan', url: 'https://psinv.net/off-plan-properties', status: 'pending', description: 'New project launches', history: [] },
  { id: 'contact', name: 'Contact Us', url: 'https://psinv.net/contact-us', status: 'pending', description: 'Lead generation and support', history: [] }
];
