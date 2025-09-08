import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { GraduationCap, BookOpen, Calendar, Trophy, Users, FileText, Bell, TrendingUp, Star, Shield, CheckCircle, ArrowRight, Play, Sparkles, Rocket, Database, Smartphone, Menu, X, Quote, MapPin, Mail, Phone, Send, Facebook, Twitter, Instagram, Linkedin, Github, ExternalLink, Layers, Infinity, Headphones, DollarSign, BarChart3, Zap, Globe, Heart, Award, Target, Monitor, Cloud, Lock, Home, FlaskRound as Flask, Music, Utensils, CalendarCheck, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const slides = [
    {
      image: "/images/building.jpg",
      title: "Empowering Tribal Youth Through Quality Education",
      subtitle: "Providing free residential education to tribal students since 2010",
      cta: "Apply Now",
      link: "admissions.html"
    },
    {
      image: "/images/classroom.jpg",
      title: "State-of-the-Art Infrastructure",
      subtitle: "Modern classrooms, labs, and sports facilities for holistic development",
      cta: "Explore Campus",
      link: "campus-life.html"
    },
    {
      image: "/images/acheivements.jpg",
      title: "100% CBSE Results for 5 Consecutive Years",
      subtitle: "Our students consistently excel in academics and extracurriculars",
      cta: "Our Achievements",
      link: "achievements.html"
    }
  ];

  const quickLinks = [
    {
      icon: Calendar,
      title: "Academic Calendar",
      description: "Download our 2024-25 academic schedule",
      link: "#"
    },
    {
      icon: BookOpen,
      title: "Curriculum",
      description: "Explore our CBSE-based learning framework",
      link: "#"
    },
    {
      icon: CalendarCheck,
      title: "Daily Routine",
      description: "Our daily routine at EMRS Dornala",
      link: "#"
    },
    {
      icon: Utensils,
      title: "Nutrition Program",
      description: "Balanced meals for healthy growth",
      link: "#"
    }
  ];

  const features = [
    {
      icon: GraduationCap,
      title: "Quality Education",
      description: "CBSE curriculum with innovative teaching methodologies and digital classrooms"
    },
    {
      icon: Home,
      title: "Residential Facility",
      description: "Safe and comfortable hostel accommodation with 24/7 supervision"
    },
    {
      icon: Utensils,
      title: "Nutrition Program",
      description: "Balanced meals prepared under expert supervision with local ingredients"
    },
    {
      icon: Flask,
      title: "Modern Labs",
      description: "Well-equipped science, computer, and language labs for practical learning"
    },
    {
      icon: Trophy,
      title: "Sports Excellence",
      description: "Training in athletics, indigenous games, and competitive sports"
    },
    {
      icon: Music,
      title: "Cultural Preservation",
      description: "Programs to celebrate and preserve tribal art, music, and traditions"
    }
  ];

  const stats = [
    { number: "500+", label: "Students" },
    { number: "30+", label: "Faculty Members" },
    { number: "15", label: "Acres Campus" },
    { number: "100%", label: "CBSE Pass Rate" }
  ];

  const galleryItems = [
    {
      image: "/images/classroom.jpg",
      title: "Smart Classrooms",
      description: "Digital learning environment"
    },
    {
      image: "/images/Science lab.jpg",
      title: "Science Lab",
      description: "Hands-on experiments"
    },
    {
      image: "/images/sports.jpg",
      title: "Sports Facilities",
      description: "Athletic excellence"
    },
    {
      image: "/images/cultural.jpg",
      title: "Cultural Events",
      description: "Celebrating traditions"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8">🎉 EMRS Entrance Exam 2024 registration starts from 15th June!</span>
          <span className="mx-8">📢 School reopens on 1st July after summer break</span>
          <span className="mx-8">🏆 Our students won 3 gold medals in state-level sports competition</span>
        </div>
      </div>

      {/* Header/Navigation */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <img 
                src="/images/dept_logo.jpg" 
                alt="EMRS Dornala Logo" 
                className="h-16 w-16 rounded-full object-cover shadow-lg"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">EMRS(CO-EDU),DORNALA</h1>
                <p className="text-sm text-gray-600">AP Tribal Welfare Residential Educational Institutions Society(R)*</p>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              <button 
                onClick={() => navigate('/')} 
                className="nav-button text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
              >
                Home
              </button>
              <div className="relative group">
                <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium flex items-center py-2 px-3 rounded-md hover:bg-blue-50">
                  Meet Us <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="dropdown-menu absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-50">
                  <button 
                    onClick={() => window.open('about.html', '_blank')} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-t-lg transition-colors"
                  >
                    About Us
                  </button>
                  <button 
                    onClick={() => window.open('about.html#management', '_blank')} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Management
                  </button>
                  <button 
                    onClick={() => window.open('about.html#academics', '_blank')} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                  >
                    Academics
                  </button>
                  <button 
                    onClick={() => window.open('about.html#affiliation', '_blank')} 
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-b-lg transition-colors"
                  >
                    Affiliation
                  </button>
                </div>
              </div>
              <button 
                onClick={() => window.open('campus-life.html', '_blank')} 
                className="nav-button text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
              >
                Campus Life
              </button>
              <button 
                onClick={() => navigate('/news')} 
                className="nav-button text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
              >
                News & Events
              </button>
              <button 
                onClick={() => window.open('admissions.html', '_blank')} 
                className="nav-button text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
              >
                Admissions
              </button>
              <button 
                onClick={() => window.open('achievements.html', '_blank')} 
                className="nav-button text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
              >
                Achievements
              </button>
              <Button 
                onClick={() => navigate('/auth')}
                className="btn-hover-effect bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Login
              </Button>
              <button 
                onClick={() => window.open('contact.html', '_blank')} 
                className="nav-button text-gray-700 hover:text-blue-600 transition-colors font-medium py-2 px-3 rounded-md hover:bg-blue-50"
              >
                Contact Us
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          {isMenuOpen && (
            <div className={`lg:hidden absolute top-20 left-0 right-0 bg-white/95 backdrop-blur-lg border-b shadow-lg z-50 mobile-menu ${isMenuOpen ? 'open' : ''}`}>
              <div className="px-4 py-6 space-y-2">
                <button 
                  onClick={() => {
                    navigate('/');
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50"
                >
                  Home
                </button>
                <button 
                  onClick={() => {
                    window.open('about.html', '_blank');
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50"
                >
                  Meet Us
                </button>
                <button 
                  onClick={() => {
                    window.open('campus-life.html', '_blank');
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50"
                >
                  Campus Life
                </button>
                <button 
                  onClick={() => {
                    navigate('/news');
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50"
                >
                  News & Events
                </button>
                <button 
                  onClick={() => {
                    window.open('admissions.html', '_blank');
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50"
                >
                  Admissions
                </button>
                <button 
                  onClick={() => {
                    window.open('achievements.html', '_blank');
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50"
                >
                  Achievements
                </button>
                <div className="pt-4">
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      navigate('/auth');
                      setIsMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                </div>
                <button 
                  onClick={() => {
                    window.open('contact.html', '_blank');
                    setIsMenuOpen(false);
                  }} 
                  className="block w-full text-left text-gray-700 hover:text-blue-600 transition-colors font-medium py-3 px-4 rounded-lg hover:bg-blue-50"
                >
                  Contact Us
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Slider */}
      <section className="relative h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('${slide.image}')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="container mx-auto px-4 h-full flex items-center">
                <div className="text-white max-w-2xl">
                  <h2 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
                    {slide.title}
                  </h2>
                  <p className="text-xl mb-8 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    {slide.subtitle}
                  </p>
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-3 animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                    onClick={() => window.open(slide.link, '_blank')}
                  >
                    {slide.cta}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Slider Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide ? 'bg-yellow-500' : 'bg-white/50'
              }`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
        </div>
        
        <button 
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* Quick Links Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {quickLinks.map((link, index) => {
              const Icon = link.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white">
                  <CardContent className="p-6 text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="p-4 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                        <Icon className="h-8 w-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-900">{link.title}</h3>
                    <p className="text-gray-600 mb-4">{link.description}</p>
                    <Button variant="outline" size="sm" className="group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome to EMRS Dornala</h2>
            <p className="text-lg text-gray-600">Eklavya Model Residential School, Dornala, Prakasam District, Andhra Pradesh</p>
          </div>
          
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <p className="text-gray-700 leading-relaxed">
                Established in 2010 under the Ministry of Tribal Affairs, Government of India, EMRS Dornala is committed to providing quality education to tribal children in a residential setting. Our school follows the CBSE curriculum while preserving and promoting tribal culture and heritage.
              </p>
              <p className="text-gray-700 leading-relaxed">
                With state-of-the-art infrastructure, experienced faculty, and a nurturing environment, we aim to empower tribal youth to become confident, competent, and compassionate individuals ready to face global challenges.
              </p>
              
              {/* Stats */}
              <div className="grid grid-cols-2 gap-6 mt-8">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{stat.number}</div>
                    <div className="text-gray-600 font-medium">{stat.label}</div>
                  </div>
                ))}
              </div>
              
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => window.open('about.html', '_blank')}
              >
                Learn More About Us
              </Button>
            </div>
            
            <div className="relative">
              <img 
                src="/images/building.jpg" 
                alt="EMRS Dornala Campus"
                className="rounded-lg shadow-2xl w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-lg"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose EMRS Dornala?</h2>
            <p className="text-lg text-gray-600">We provide holistic development opportunities for our students</p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-blue-100 to-purple-100 w-fit group-hover:from-blue-200 group-hover:to-purple-200 transition-all duration-300">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold mb-3 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Glimpses of EMRS Dornala</h2>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {galleryItems.map((item, index) => (
              <div key={index} className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-lg font-semibold">{item.title}</h3>
                    <p className="text-sm">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              variant="outline"
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              onClick={() => navigate('/gallery')}
            >
              View Full Gallery
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-xl text-blue-100 mb-8">Subscribe to our newsletter for the latest news, events, and announcements</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold px-6">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* School Info */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/images/dept_logo.jpg" 
                  alt="EMRS Logo" 
                  className="h-12 w-12 rounded-full object-cover"
                />
                <h3 className="text-xl font-bold">EMRS Dornala</h3>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Eklavya Model Residential School, Dornala, Prakasam District, Andhra Pradesh - 523330
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/share/1HY9cx5obW/" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="https://m.youtube.com/@nests-emrs" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Quick Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <button 
                    onClick={() => navigate('/')} 
                    className="hover:text-white transition-colors hover:underline text-left"
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('about.html', '_blank')} 
                    className="hover:text-white transition-colors hover:underline text-left"
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('admissions.html', '_blank')} 
                    className="hover:text-white transition-colors hover:underline text-left"
                  >
                    Admissions
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('campus-life.html', '_blank')} 
                    className="hover:text-white transition-colors hover:underline text-left"
                  >
                    Campus Life
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('achievements.html', '_blank')} 
                    className="hover:text-white transition-colors hover:underline text-left"
                  >
                    Achievements
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => navigate('/gallery')} 
                    className="hover:text-white transition-colors hover:underline text-left"
                  >
                    Gallery
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => window.open('contact.html', '_blank')} 
                    className="hover:text-white transition-colors hover:underline text-left"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
            
            {/* Important Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Important Links</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="https://nests.tribal.gov.in/" target="_blank" className="hover:text-white transition-colors">Ministry of Tribal Affairs</a></li>
                <li><a href="https://cbseacademic.nic.in/" target="_blank" className="hover:text-white transition-colors">CBSE Academic</a></li>
                <li><a href="https://www.ncert.nic.in/" target="_blank" className="hover:text-white transition-colors">NCERT</a></li>
                <li><a href="#" target="_blank" className="hover:text-white transition-colors">School Calendar</a></li>
                <li><a href="#" target="_blank" className="hover:text-white transition-colors">Academic Results</a></li>
              </ul>
            </div>
            
            {/* Contact Info */}
            <div id="contact">
              <h3 className="font-semibold mb-4 text-white">Contact Info</h3>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  <a href="tel:+918567123456" className="hover:text-white transition-colors">08567-123456</a>
                </li>
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  <a href="mailto:emrsdornala@gmail.com" className="hover:text-white transition-colors">emrsdornala@gmail.com</a>
                </li>
                <li className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 mt-1 flex-shrink-0" />
                  <span>EMRS Dornala, Prakasam District, Andhra Pradesh - 523330</span>
                </li>
              </ul>
              
              <div className="mt-6">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.8968663!2d79.0944745!3d15.8968663!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bb54159e35ef989%3A0xd002dcf5690b3dc7!2sEMRS%20DORNALA!5e0!3m2!1sen!2sin!4v1641234567890!5m2!1sen!2sin"
                  width="100%" 
                  height="150" 
                  style={{ border: 0, borderRadius: '8px' }}
                  allowFullScreen
                  loading="lazy"
                  className="shadow-lg"
                />
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 EMRS Dornala. All Rights Reserved. | Designed by EMRS Web Team
              </div>
              <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
                <a href="#" className="hover:text-white transition-colors">Sitemap</a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(100%); }
          100% { transform: translateX(-100%); }
        }
        
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out both;
        }

        /* Enhanced Navigation Styles */
        .nav-button {
          position: relative;
          overflow: hidden;
        }

        .nav-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
          transition: left 0.5s;
        }

        .nav-button:hover::before {
          left: 100%;
        }

        /* Dropdown Animation */
        .dropdown-menu {
          transform: translateY(-10px);
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .group:hover .dropdown-menu {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        /* Mobile Menu Animation */
        .mobile-menu {
          transform: translateY(-20px);
          opacity: 0;
          transition: all 0.3s ease-out;
        }

        .mobile-menu.open {
          transform: translateY(0);
          opacity: 1;
        }

        /* Button Hover Effects */
        .btn-hover-effect {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .btn-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        /* Smooth Transitions */
        * {
          transition: color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
        }
      `}</style>
    </div>
  );
};

export default Index;