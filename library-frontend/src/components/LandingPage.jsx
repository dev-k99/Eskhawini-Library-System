import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  QrCode, 
  TrendingUp, 
  Leaf, 
  Brain,
  ArrowRight,
  Zap,
  Globe,
  Shield,
  Users,
  ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recommendations',
      description: 'Intelligent book suggestions tailored to your reading preferences and history',
      color: 'from-violet-500 to-purple-500'
    },
    {
      icon: QrCode,
      title: 'QR Code Integration',
      description: 'Seamless book checkouts with instant QR code generation and scanning',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: TrendingUp,
      title: 'Real-Time Analytics',
      description: 'Comprehensive insights into borrowing trends, popular genres, and user activity',
      color: 'from-amber-500 to-orange-500'
    },
    {
      icon: Leaf,
      title: 'Sustainability Focus',
      description: 'Track your carbon footprint and environmental impact through digital reading',
      color: 'from-emerald-500 to-green-500'
    },
    {
      icon: Globe,
      title: 'Instant Inventory Updates',
      description: 'Live book availability tracking across your entire library network',
      color: 'from-pink-500 to-rose-500'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with role-based access control',
      color: 'from-indigo-500 to-blue-500'
    }
  ];

  const stats = [
    { value: '10K+', label: 'Books Cataloged' },
    { value: '5K+', label: 'Active Members' },
    { value: '50K+', label: 'Books Borrowed' },
    { value: '99.9%', label: 'Uptime' }
  ];

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white overflow-hidden relative">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 50%)`
        }}
      />

      {/* Grid pattern overlay */}
      <div 
        className="fixed inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      {/* Floating orbs */}
      <div className="fixed top-20 left-10 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '4s' }} />
      <div className="fixed bottom-20 right-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '6s', animationDelay: '2s' }} />
      <div className="fixed top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse" 
           style={{ animationDuration: '5s', animationDelay: '1s' }} />

      {/* Navigation */}
      <nav className="relative z-50 backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
                LibraryOS
              </span>
            </div>
            <button
              onClick={handleGetStarted}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 transition-all duration-300 font-semibold shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:scale-105"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-8 mb-16"
               style={{
                 transform: `translateY(${scrollY * 0.2}px)`,
                 opacity: 1 - scrollY / 500
               }}>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 text-sm font-medium animate-fade-in">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="bg-gradient-to-r from-violet-200 to-purple-200 bg-clip-text text-transparent">
                Powered by AI & Innovation
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-7xl md:text-8xl font-black leading-tight tracking-tight"
                style={{ 
                  fontFamily: "'Space Grotesk', sans-serif",
                  animation: 'slide-up 0.8s ease-out'
                }}>
              <span className="block bg-gradient-to-r from-white via-violet-100 to-white bg-clip-text text-transparent">
                LIBRARY SYSTEM
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
               style={{ animation: 'slide-up 0.8s ease-out 0.2s both' }}>
              Welcome to Your Digital Library Experience
            </p>

            {/* Description */}
            <p className="text-lg text-gray-500 max-w-2xl mx-auto"
               style={{ animation: 'slide-up 0.8s ease-out 0.3s both' }}>
              Explore, borrow, and manage books efficiently with our AI-powered recommendation engine.
            </p>

            {/* CTA Button */}
            <div style={{ animation: 'slide-up 0.8s ease-out 0.4s both' }}>
              <button
                onClick={handleGetStarted}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-white/20 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10">EXPLORE LIBRARY</span>
                <ArrowRight className="h-5 w-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Scroll Indicator */}
            <div className="flex justify-center pt-12 animate-bounce">
              <ChevronDown className="h-8 w-8 text-violet-400" />
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20"
               style={{ animation: 'slide-up 0.8s ease-out 0.5s both' }}>
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-violet-500/20 to-purple-500/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
                <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:border-white/20 transition-all duration-300 hover:scale-105">
                  <div className="text-4xl font-black bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-400 font-medium">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-sm font-medium mb-6">
              <Zap className="h-4 w-4 text-violet-400" />
              <span className="text-violet-300">Features</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Built with cutting-edge technology to revolutionize library management
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative"
                  style={{ animation: `slide-up 0.6s ease-out ${0.1 * index}s both` }}
                >
                  {/* Glow effect */}
                  <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.color} rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all duration-500`} />
                  
                  {/* Card */}
                  <div className="relative h-full backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all duration-300">
                    {/* Icon */}
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 text-white">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-fuchsia-500/10 border border-white/10 rounded-3xl p-12 text-center">
            <Users className="h-12 w-12 mx-auto mb-6 text-violet-400" />
            <h3 className="text-3xl font-bold mb-4">Built with Modern Technology</h3>
            <p className="text-gray-400 text-lg mb-8 max-w-3xl mx-auto">
              Built with C#, ASP.NET Core 8 backend, PostgreSQL on Supabase, React and Tailwind CSS frontend.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {['C#', 'ASP.NET Core 8', 'PostgreSQL', 'React', 'Tailwind CSS', 'SignalR', 'JWT Auth'].map((tech, index) => (
                <div 
                  key={index}
                  className="px-6 py-3 rounded-full bg-white/5 backdrop-blur-sm border border-white/10 font-semibold hover:border-violet-500/50 hover:bg-white/10 transition-all duration-300"
                >
                  {tech}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-violet-200 to-purple-200 bg-clip-text text-transparent">
            Ready to Transform Your Library?
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            Join thousands of libraries already using LibraryOS
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleGetStarted}
              className="group relative px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-violet-500/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              className="px-8 py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 hover:bg-white/10 font-bold text-lg transition-all duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 backdrop-blur-xl bg-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-purple-500 to-fuchsia-500 flex items-center justify-center shadow-lg shadow-violet-500/50">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">LibraryOS</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2026 LibraryOS. All rights reserved.
            </div>
            <div className="flex gap-6 text-gray-400">
              <a href="#" className="hover:text-violet-400 transition-colors">Privacy</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Terms</a>
              <a href="#" className="hover:text-violet-400 transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom CSS */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&display=swap');

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        * {
          font-family: 'Space Grotesk', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      `}</style>
    </div>
  );
}