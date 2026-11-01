import { Wifi, Car } from "lucide-react";
import { ShowerHeadIcon } from "lucide-react"; // check if these exist or replace

export const rooms = [
    {
      id: 1,
      name: 'Standard Double Room',
      category: 'standard',
      image:
        'https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600',
      price: 14,
      rating: 4.7,
      size: '25 sqm',
      guests: 2,
      bed: 'king Bed',
      amenities: ['Free WiFi','Hot water'],
      features: [
        { icon: <Wifi size={16} />, name: 'Free WiFi' },
        { icon: <ShowerHeadIcon size={16} />, name: 'Hot Water' },
        { icon: <Car size={16} />, name: 'Parking' },
      ],
      description:
        'Elegant and comfortable room with modern amenities and rooftop view.',
    }
  ];

  export const categories = [
    { id: 'all',
      name: 'All Rooms',
      count: rooms.length },
    {
      id: 'standard',
      name: 'Standard',
      count: rooms.filter((r) => r.category === 'standard').length,
    },
    {
      id: 'sea view',
      name: 'Sea View',
      count: rooms.filter((r) => r.category === 'sea view').length,
    },
    {
      id: 'Air Conditioned',
      name: 'Air Conditioned',
      count: rooms.filter((r) => r.category === 'Air Conditioned').length,
    },

    {
      id: 'family',
      name: 'Family',
      count: rooms.filter((r) => r.category === 'family').length,
    }
  ];
