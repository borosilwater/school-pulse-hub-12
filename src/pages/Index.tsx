import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  GraduationCap,
  BookOpen,
  Calendar,
  Trophy,
  Users,
  FileText,
  Bell,
  TrendingUp,
  Star,
  Shield,
  CheckCircle,
  ArrowRight,
  Play,
  Sparkles,
  Rocket,
  Database,
  Smartphone,
  Menu,
  X,
  Quote,
  MapPin,
  Mail,
  Phone,
  Send,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Github,
  ExternalLink,
  Layers,
  Infinity,
  Headphones,
  DollarSign,
  BarChart3,
  Zap,
  Globe,
  Heart,
  Award,
  Target,
  Monitor,
  Cloud,
  Lock
} from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Data for different sections
  const features = [ 
   {
      icon: GraduationCap,
      title: "Student Management",
      description: "Comprehensive student profiles, academic records, and performance tracking with real-time updates.",
      color: "from-blue-500 to-blue-600",
      delay: "0ms"
    },
    {
      icon: BookOpen,
      title: "Content Management",
      description: "Teachers can create and manage announcements, events, and exam results with rich media support.",
      color: "from-green-500 to-green-600",
      delay: "100ms"
    },
    {
      icon: Bell,
      title: "Real-time Notifications",
      description: "Instant SMS and email notifications powered by Twilio for important updates and announcements.",
      color: "from-purple-500 to-purple-600",
      delay: "200ms"
    },
    {
      icon: BarChart3,
      title: "Analytics Dashboard",
      description: "Comprehensive analytics and reporting with interactive charts for administrators and teachers.",
      color: "from-orange-500 to-orange-600",
      delay: "300ms"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "Bank-level security with Row Level Security (RLS) and role-based access control.",
      color: "from-red-500 to-red-600",
      delay: "400ms"
    },
    {
      icon: Database,
      title: "Supabase Backend",
      description: "Powered by Supabase with real-time database, authentication, and storage capabilities.",
      color: "from-emerald-500 to-emerald-600",
      delay: "500ms"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Students", icon: Users },
    { number: "2,500+", label: "Teachers", icon: BookOpen },
    { number: "150+", label: "Schools", icon: Trophy },
    { number: "99.9%", label: "Uptime", icon: Zap }
  ];

  const testimonials = [    
{
      name: "Dr. Sarah Johnson",
      role: "Principal, Lincoln High School",
      content: "EduPortal has revolutionized how we manage our school. The real-time notifications and analytics have improved communication by 300%. It's simply the best educational platform we've ever used.",
      avatar: "SJ",
      rating: 5,
      school: "Lincoln High School"
    },
    {
      name: "Michael Chen",
      role: "Mathematics Teacher",
      content: "The content management system is incredibly intuitive. I can create announcements, manage grades, and track student progress all in one place. My productivity has increased dramatically.",
      avatar: "MC",
      rating: 5,
      school: "Riverside Academy"
    },
    {
      name: "Emily Rodriguez",
      role: "Student, Grade 12",
      content: "I love how I can access my grades, announcements, and events instantly. The mobile interface is fantastic and keeps me organized throughout the school year.",
      avatar: "ER",
      rating: 5,
      school: "Central High School"
    },
    {
      name: "James Wilson",
      role: "IT Administrator",
      content: "The security features and admin controls are outstanding. Row-level security gives us peace of mind, and the analytics help us make data-driven decisions.",
      avatar: "JW",
      rating: 5,
      school: "Metro School District"
    }
  ];

  const pricingPlans = [ 
   {
      name: "Starter",
      price: "Free",
      period: "forever",
      description: "Perfect for small schools getting started",
      features: [
        "Up to 100 students",
        "Basic content management",
        "Email notifications",
        "Standard support",
        "Mobile app access"
      ],
      popular: false,
      cta: "Get Started Free"
    },
    {
      name: "Professional",
      price: "$29",
      period: "per month",
      description: "Ideal for growing educational institutions",
      features: [
        "Up to 1,000 students",
        "Advanced analytics",
        "SMS notifications",
        "Priority support",
        "Custom branding",
        "API access"
      ],
      popular: true,
      cta: "Start Free Trial"
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "contact us",
      description: "For large institutions with custom needs",
      features: [
        "Unlimited students",
        "White-label solution",
        "24/7 dedicated support",
        "Custom integrations",
        "Advanced security",
        "Training & onboarding"
      ],
      popular: false,
      cta: "Contact Sales"
    }
  ];

  return (    <div
 className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 z-50 w-full transition-all duration-300 ${
        scrollY > 50 
          ? 'bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-100' 
          : 'bg-white/80 backdrop-blur-md'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  EduPortal
                </span>
                <div className="text-xs text-gray-500 font-medium">Education Platform</div>
              </div>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Features
              </a>
              <a href="#testimonials" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Reviews
              </a>
              <a href="#pricing" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Pricing
              </a>
              <a href="#contact" className="text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium">
                Contact
              </a>
              <Button 
                variant="outline"
                onClick={() => navigate('/auth')}
                className="border-gray-300 hover:border-blue-600 hover:text-blue-600"
              >
                Sign In
              </Button>
              <Button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                onClick={() => navigate('/auth')}
              >
                Get Started Free
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>

            {/* Mobile Navigation Button */}
            <div className="md:hidden">
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
           <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-lg border-b shadow-lg">
              <div className="px-4 py-6 space-y-4">
                <a href="#features" className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2">
                  Features
                </a>
                <a href="#testimonials" className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2">
                  Reviews
                </a>
                <a href="#pricing" className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2">
                  Pricing
                </a>
                <a href="#contact" className="block text-gray-600 hover:text-blue-600 transition-colors duration-200 font-medium py-2">
                  Contact
                </a>
                <div className="pt-4 space-y-2">
                  <Button 
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate('/auth')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    onClick={() => navigate('/auth')}
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(147,51,234,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-xl animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-full blur-xl animate-pulse"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50/80 backdrop-blur-sm px-6 py-3 text-sm font-medium text-blue-700 mb-8 hover:bg-blue-100/80 transition-all duration-300 cursor-pointer group">
              <Sparkles className="mr-2 h-4 w-4 group-hover:animate-spin" />
              🚀 New: Real-time SMS Notifications with Twilio Integration
              <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
            
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl mb-6">
              Transform Education with
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent block mt-2">
                Smart School Management
              </span>
            </h1>
            
            <p className="text-xl leading-8 text-gray-600 max-w-3xl mx-auto mb-10">
              Empower your educational institution with our comprehensive platform. 
              Manage students, teachers, and content with real-time notifications, 
              advanced analytics, and seamless communication—all powered by 
              <span className="font-semibold text-emerald-600"> Supabase</span> and 
              <span className="font-semibold text-blue-600"> Twilio</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl group w-full sm:w-auto"
                onClick={() => navigate('/auth')}
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 border-2 hover:bg-gray-50 transform hover:scale-105 transition-all duration-300 group w-full sm:w-auto"
              >
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
                Watch Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                14-day free trial
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                Cancel anytime
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                24/7 support
              </div>
            </div>
          </div>
        </div>
      </section>      {/* 
Stats Section */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Trusted by Educational Leaders Worldwide</h2>
            <p className="text-lg text-gray-600">Join thousands of schools already transforming education</p>
          </div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="flex justify-center mb-4">
                    <div className="p-3 rounded-full bg-gradient-to-r from-blue-50 to-purple-50 group-hover:scale-110 transition-transform duration-300">
                      <Icon className="h-8 w-8 text-blue-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-gray-900 sm:text-4xl mb-2">
                    {stat.number}
                  </div>
                  <div className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1)_0%,transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-4">
              <Rocket className="mr-2 h-4 w-4" />
              Powerful Features
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Everything you need to manage your institution
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Comprehensive tools designed to streamline operations, enhance communication, 
              and provide real-time insights for modern educational institutions.
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index} 
                  className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm hover:bg-white relative overflow-hidden"
                  style={{ animationDelay: feature.delay }}
                >
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                  
                  <CardHeader className="relative">
                    <div className="flex items-start space-x-4">
                      <div className={`p-4 rounded-xl bg-gradient-to-br ${feature.color} bg-opacity-10 group-hover:scale-110 transition-all duration-500 shadow-lg`}>
                        <Icon className={`h-6 w-6 text-gray-700 group-hover:scale-110 transition-transform duration-300`} />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-xl group-hover:text-gray-900 transition-colors duration-300">
                          {feature.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <CardDescription className="text-base leading-relaxed text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  
                  {/* Hover Effect Border */}
                  <div className="absolute inset-0 rounded-lg border-2 border-transparent group-hover:border-blue-200 transition-colors duration-500"></div>
                </Card>
              );
            })}
          </div>
          
          {/* Technology Stack */}
          <div className="mt-20 text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-8">Built with Modern Technology</h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="flex items-center space-x-2 group cursor-pointer">
                <Database className="h-8 w-8 text-emerald-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-700">Supabase</span>
              </div>
              <div className="flex items-center space-x-2 group cursor-pointer">
                <Smartphone className="h-8 w-8 text-blue-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-700">Twilio SMS</span>
              </div>
              <div className="flex items-center space-x-2 group cursor-pointer">
                <Monitor className="h-8 w-8 text-purple-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-700">React</span>
              </div>
              <div className="flex items-center space-x-2 group cursor-pointer">
                <Cloud className="h-8 w-8 text-orange-600 group-hover:scale-110 transition-transform" />
                <span className="font-semibold text-gray-700">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </section> 
     {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-white relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700 mb-4">
              <Heart className="mr-2 h-4 w-4" />
              Customer Stories
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Loved by educators worldwide
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how schools are transforming their educational experience with EduPortal
            </p>
          </div>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2">
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index} 
                className="hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 bg-white border-0 shadow-lg group relative overflow-hidden"
              >
                {/* Quote Icon */}
                <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Quote className="h-12 w-12 text-blue-600" />
                </div>
                
                <CardContent className="pt-8 pb-6 relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {testimonial.avatar}
                    </div>
                    <div className="ml-4">
                      <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {testimonial.role}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {testimonial.school}
                      </div>
                    </div>
                  </div>
                  
                  <blockquote className="text-gray-700 text-base leading-relaxed mb-6 group-hover:text-gray-800 transition-colors duration-300">
                    "{testimonial.content}"
                  </blockquote>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="h-5 w-5 fill-yellow-400 text-yellow-400 group-hover:scale-110 transition-transform duration-300" 
                          style={{ transitionDelay: `${i * 50}ms` }}
                        />
                      ))}
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 group-hover:bg-green-200 transition-colors duration-300">
                      Verified Review
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <p className="text-lg text-gray-600 mb-6">
              Ready to join our community of satisfied users?
            </p>
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
              onClick={() => navigate('/auth')}
            >
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>    
  {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <div className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 mb-4">
              <DollarSign className="mr-2 h-4 w-4" />
              Simple Pricing
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
              Choose the perfect plan for your school
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Start free and scale as you grow. All plans include our core features with no hidden fees.
            </p>
          </div>
          
          <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${
                  plan.popular 
                    ? 'border-2 border-blue-500 shadow-xl scale-105' 
                    : 'border border-gray-200'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-8">
                  <CardTitle className="text-2xl font-bold mb-2">{plan.name}</CardTitle>
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.price !== 'Free' && plan.price !== 'Custom' && (
                      <span className="text-gray-600 ml-2">/{plan.period}</span>
                    )}
                    {plan.price === 'Custom' && (
                      <span className="text-gray-600 ml-2">- {plan.period}</span>
                    )}
                  </div>
                  <CardDescription className="text-base">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="pb-8">
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    className={`w-full ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                    } transform hover:scale-105 transition-all duration-300`}
                    onClick={() => navigate('/auth')}
                  >
                    {plan.cta}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              All plans include 24/7 support, regular updates, and a 30-day money-back guarantee
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
              <div className="flex items-center">
                <Shield className="h-4 w-4 text-green-500 mr-2" />
                Enterprise-grade security
              </div>
              <div className="flex items-center">
                <Headphones className="h-4 w-4 text-blue-500 mr-2" />
                24/7 customer support
              </div>
              <div className="flex items-center">
                <Infinity className="h-4 w-4 text-purple-500 mr-2" />
                Unlimited updates
              </div>
            </div>
          </div>
        </div>
      </section> 
     {/* Contact Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700 mb-4">
                <Send className="mr-2 h-4 w-4" />
                Get in Touch
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl mb-4">
                Ready to transform your school?
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Contact our team to learn how EduPortal can help streamline your educational operations
              </p>
            </div>
            
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Get in touch</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                        <Mail className="h-5 w-5 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Email us</p>
                        <p className="text-sm text-gray-600">hello@eduportal.com</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                        <Phone className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Call us</p>
                        <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                        <MapPin className="h-5 w-5 text-purple-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">Visit us</p>
                        <p className="text-sm text-gray-600">123 Education St, Learning City, LC 12345</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Follow us</h4>
                  <div className="flex space-x-4">
                    <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors">
                      <Facebook className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                    </a>
                    <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors">
                      <Twitter className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                    </a>
                    <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors">
                      <Instagram className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                    </a>
                    <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors">
                      <Linkedin className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                    </a>
                    <a href="#" className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors">
                      <Github className="h-5 w-5 text-gray-600 hover:text-blue-600" />
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <Card className="shadow-xl">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    We'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          First name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                          Last name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Doe"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        School/Organization
                      </label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Lincoln High School"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Tell us about your needs..."
                      />
                    </div>
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      Send Message
                      <Send className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>      
{/* Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid gap-8 lg:grid-cols-4">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-purple-600">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold">EduPortal</span>
                  <div className="text-xs text-gray-400">Education Platform</div>
                </div>
              </div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                Transforming education through innovative technology. 
                Empowering schools with comprehensive management solutions.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
            
            {/* Product Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Product</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Demo</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
              </ul>
            </div>
            
            {/* Support Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Support</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#contact" className="hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">System Status</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            {/* Company Links */}
            <div>
              <h3 className="font-semibold mb-4 text-white">Company</h3>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-gray-400 text-sm">
                © 2024 EduPortal. All rights reserved. Built with ❤️ for education.
              </div>
              <div className="flex items-center space-x-6 mt-4 md:mt-0 text-sm text-gray-400">
                <span className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  SOC 2 Compliant
                </span>
                <span className="flex items-center">
                  <Lock className="h-4 w-4 mr-1" />
                  GDPR Ready
                </span>
                <span className="flex items-center">
                  <Award className="h-4 w-4 mr-1" />
                  ISO 27001
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;