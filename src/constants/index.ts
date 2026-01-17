
import { PSIPage } from '../types/index';

export const PSI_BRAND = {
  blue: '#0054A6',
  gold: '#C5A059',
  dark: '#0a0a0b',
  slate: '#0f0f11'
};

// Added 'order' property to each PSIPage to resolve type mismatch errors
export const PSI_PAGES: PSIPage[] = [
  { id: 'home', name: 'Homepage', url: 'https://psinv.net/', status: 'pending', order: 0, history: [] },
  { id: 'luxury', name: 'Luxury Projects (Off-Plan)', url: 'https://psinv.net/off-plan', status: 'pending', order: 1, history: [] },
  { id: 'mgmt', name: 'Property Management', url: 'https://psinv.net/property-management', status: 'pending', order: 2, history: [] },
  { id: 'mortgage', name: 'Mortgage Services', url: 'https://psinv.net/mortgage-services', status: 'pending', order: 3, history: [] },
  { id: 'careers', name: 'Careers', url: 'https://psinv.net/careers', status: 'pending', order: 4, history: [] },
  { id: 'about', name: 'About Us', url: 'https://psinv.net/about-us', status: 'pending', order: 5, history: [] },
  { id: 'sales', name: 'Sales Services', url: 'https://psinv.net/sales-services', status: 'pending', order: 6, history: [] },
  { id: 'rent', name: 'Rent Services', url: 'https://psinv.net/rent-services', status: 'pending', order: 7, history: [] },
  { id: 'offplan-gen', name: 'Off-Plan General', url: 'https://psinv.net/off-plan-properties', status: 'pending', order: 8, history: [] },
  { id: 'contact', name: 'Contact Us', url: 'https://psinv.net/contact-us', status: 'pending', order: 9, history: [] }
];