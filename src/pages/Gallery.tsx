import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Home, 
  ChevronRight, 
  Search, 
  X, 
  ChevronLeft, 
  Facebook, 
  Twitter, 
  Instagram,
  Image as ImageIcon
} from 'lucide-react';

interface GalleryItem {
  id: number;
  title: string;
  category: string;
  date: string;
  image: string;
  description: string;
}

const Gallery = () => {
  const [currentFilter, setCurrentFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [filteredImages, setFilteredImages] = useState<GalleryItem[]>([]);

  const galleryData: GalleryItem[] = [
    {
      id: 1,
      title: "Annual Day Celebration",
      category: "events",
      date: "15 Jan 2024",
      image: "/images/functions.jpg",
      description: "Our annual day celebration with cultural performances and prize distribution."
    },
    {
      id: 2,
      title: "Sports Day",
      category: "sports",
      date: "20 Feb 2024",
      image: "/images/sports.jpg",
      description: "Annual sports day with various competitions and races."
    },
    {
      id: 3,
      title: "Science Exhibition",
      category: "academics",
      date: "10 Mar 2024",
      image: "/images/Science lab.jpg",
      description: "Students showcasing their innovative science projects at ISRO."
    },
    {
      id: 4,
      title: "Republic Day",
      category: "events",
      date: "26 Jan 2024",
      image: "/images/flag hosting.jpg",
      description: "Flag hoisting ceremony and cultural programs on Republic Day."
    },
    {
      id: 5,
      title: "Dance Performance",
      category: "cultural",
      date: "15 Aug 2024",
      image: "/images/cultural dance.jpg",
      description: "Traditional dance performance by students on Independence Day."
    },
    {
      id: 6,
      title: "Classroom Activity",
      category: "academics",
      date: "5 May 2024",
      image: "/images/classroom.jpg",
      description: "Interactive learning session in our modern classrooms."
    },
    {
      id: 7,
      title: "Prize Distribution",
      category: "events",
      date: "30 Mar 2024",
      image: "/images/acheivements.jpg",
      description: "Recognizing academic excellence in our annual prize distribution."
    },
    {
      id: 8,
      title: "Field Trip",
      category: "academics",
      date: "12 Apr 2024",
      image: "/images/Plantation.jpg",
      description: "Educational field trip to the science museum."
    },
    {
      id: 9,
      title: "Tournament Prizes",
      category: "sports",
      date: "8 Jun 2024",
      image: "/images/birsa munda prize.jpg",
      description: "Students getting certificates of participation in various sports."
    },
    {
      id: 10,
      title: "Tree Plantation",
      category: "cultural",
      date: "22 Jul 2024",
      image: "/images/Plantation.jpg",
      description: "Environmental awareness program with tree plantation drive."
    },
    {
      id: 11,
      title: "Library Session",
      category: "academics",
      date: "3 Aug 2023",
      image: "/images/LIBRARY.jpg",
      description: "Reading session in our well-stocked library."
    },
    {
      id: 12,
      title: "Traditional Dance",
      category: "cultural",
      date: "14 Sep 2024",
      image: "/images/cultural dance.jpg",
      description: "Students performing traditional tribal dances."
    }
  ];

  const filterCategories = [
    { key: 'all', label: 'All' },
    { key: 'events', label: 'Events' },
    { key: 'sports', label: 'Sports' },
    { key: 'academics', label: 'Academics' },
    { key: 'cultural', label: 'Cultural' }
  ];

  useEffect(() => {
    const filtered = galleryData.filter(item => {
      const matchesFilter = currentFilter === 'all' || item.category === currentFilter;
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           item.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    });
    setFilteredImages(filtered);
  }, [currentFilter, searchTerm]);

  const openModal = (image: GalleryItem, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const showPrevImage = () => {
    const newIndex = (currentIndex - 1 + filteredImages.length) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  const showNextImage = () => {
    const newIndex = (currentIndex + 1) % filteredImages.length;
    setCurrentIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) {
        if (e.key === 'Escape') closeModal();
        if (e.key === 'ArrowLeft') showPrevImage();
        if (e.key === 'ArrowRight') showNextImage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, currentIndex, filteredImages]);

  return (
    <div 
      className="min-h-screen relative"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/building.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      {/* Header */}
      <header className="bg-blue-900/90 backdrop-blur-md text-white py-8 text-center shadow-lg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold mb-2 text-yellow-400 animate-fade-in-down">EMRS DORNALA</h1>
          <h2 className="text-2xl mb-2 animate-fade-in">Eklavya Model Residential School</h2>
          <p className="text-lg text-yellow-400 italic animate-fade-in">Empowering Tribal Students Through Quality Education</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-blue-800/90 backdrop-blur-md text-white py-3 px-4">
        <div className="container mx-auto flex items-center text-sm">
          <a href="/" className="text-yellow-400 hover:text-white transition-colors flex items-center">
            <Home className="h-4 w-4 mr-1" />
            Home
          </a>
          <ChevronRight className="h-4 w-4 mx-2" />
          <span>Gallery</span>
        </div>
      </div>

      {/* Gallery Container */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-white mb-8 relative">
          OUR GALLERY
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-yellow-400 rounded"></div>
        </h1>

        {/* Search Box */}
        <div className="flex justify-center mb-8">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search photos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 bg-white/90 border-0 rounded-full shadow-lg focus:bg-white focus:shadow-xl transition-all duration-300"
            />
          </div>
        </div>

        {/* Filter Options */}
        <div className="flex justify-center flex-wrap gap-3 mb-8">
          {filterCategories.map((category) => (
            <Button
              key={category.key}
              variant={currentFilter === category.key ? "default" : "outline"}
              className={`rounded-full px-6 py-2 font-semibold text-sm transition-all duration-300 ${
                currentFilter === category.key
                  ? 'bg-yellow-500 text-gray-900 shadow-lg hover:bg-yellow-600'
                  : 'bg-blue-600/80 text-white border-white/30 hover:bg-yellow-500 hover:text-gray-900 hover:border-yellow-500'
              }`}
              onClick={() => setCurrentFilter(category.key)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredImages.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <ImageIcon className="h-16 w-16 mx-auto text-white/50 mb-4" />
              <p className="text-white text-xl mb-2">No photos found matching your search.</p>
              <p className="text-white/70">Try a different keyword or filter.</p>
            </div>
          ) : (
            filteredImages.map((item, index) => (
              <Card 
                key={item.id} 
                className="group cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                onClick={() => openModal(item, index)}
              >
                <div className="relative">
                  <div className="absolute top-3 right-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
                    {item.date}
                  </div>
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-semibold">{item.title}</h3>
                      <p className="text-sm text-white/90">{item.description}</p>
                    </div>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900">{item.title}</h3>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            className="absolute top-6 right-6 text-white text-4xl hover:text-yellow-400 transition-colors z-10"
            onClick={closeModal}
          >
            <X className="h-8 w-8" />
          </button>
          
          <button
            className="absolute left-6 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-yellow-400 transition-colors z-10"
            onClick={showPrevImage}
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <button
            className="absolute right-6 top-1/2 transform -translate-y-1/2 text-white text-3xl hover:text-yellow-400 transition-colors z-10"
            onClick={showNextImage}
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          <div className="max-w-4xl max-h-[90vh] flex flex-col items-center">
            <img 
              src={selectedImage.image} 
              alt={selectedImage.title}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-white text-center mt-6">
              <h3 className="text-2xl font-bold mb-2">{selectedImage.title}</h3>
              <p className="text-lg text-white/90">{selectedImage.description}</p>
              <p className="text-sm text-yellow-400 mt-2">{selectedImage.date}</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-blue-900/90 backdrop-blur-md text-white text-center py-8 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center space-x-6 mb-4">
            <a href="https://www.facebook.com/share/1HY9cx5obW/" className="text-white hover:text-yellow-400 transition-colors transform hover:-translate-y-1">
              <Facebook className="h-6 w-6" />
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors transform hover:-translate-y-1">
              <Twitter className="h-6 w-6" />
            </a>
            <a href="#" className="text-white hover:text-yellow-400 transition-colors transform hover:-translate-y-1">
              <Instagram className="h-6 w-6" />
            </a>
            <a href="https://m.youtube.com/@nests-emrs" className="text-white hover:text-yellow-400 transition-colors transform hover:-translate-y-1">
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          </div>
          <p className="text-white/90">© 2024 EMRS Dornala. All Rights Reserved.</p>
        </div>
      </footer>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fadeIn 1s ease;
        }
        
        .animate-fade-in-down {
          animation: fadeInDown 1s ease;
        }
      `}</style>
    </div>
  );
};

export default Gallery;