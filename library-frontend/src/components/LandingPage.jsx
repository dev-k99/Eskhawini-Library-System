import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Zap, 
  Shield, 
  TrendingUp, 
  Users, 
  Leaf,
  ArrowRight,
  CheckCircle,
  Clock,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-blue-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">LibraryOS</h1>
                <p className="text-xs text-gray-500 -mt-0.5">Modern Library Management</p>
              </div>
            </div>

            {/* CTA */}
            <Link 
              to="/login" 
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-full mb-8 animate-fade-in">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-700">Powering Modern Libraries</span>
            </div>
            
            <h1 
              className="text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight animate-slide-up"
              style={{ fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif' }}
            >
              Library Management,
              <br />
              <span className="text-blue-600">Reimagined</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up-delay">
              Transform your library operations with intelligent automation, real-time insights, 
              and seamless user experiences. Built for librarians, loved by patrons.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delay-2">
              <Link 
                to="/login" 
                className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Hero Visual */}
          <div className="mt-20 relative animate-fade-in-slow">
            <div className="absolute inset-0 bg-blue-100 rounded-3xl transform rotate-1"></div>
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="p-8">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-16 bg-blue-50 border border-blue-100 rounded-lg"></div>
                  <div className="h-16 bg-gray-50 border border-gray-100 rounded-lg"></div>
                  <div className="h-16 bg-gray-50 border border-gray-100 rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8 bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: '30+', label: 'Books Catalogued' },
              { number: '99.9%', label: 'Uptime' },
              { number: '5+', label: 'Active Users' },
              { number: '24/7', label: 'Support' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive features designed to streamline every aspect of library management
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: 'Smart Cataloging',
                description: 'Effortlessly organize and manage your entire collection with intelligent categorization and search.',
                color: 'blue'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Real-time updates and instant search results ensure smooth operations for staff and patrons.',
                color: 'yellow'
              },
              {
                icon: Shield,
                title: 'Secure & Reliable',
                description: 'Enterprise-grade security with role-based access control and automated backups.',
                color: 'green'
              },
              {
                icon: BarChart3,
                title: 'Analytics Dashboard',
                description: 'Gain actionable insights with comprehensive reporting and visual analytics.',
                color: 'purple'
              },
              {
                icon: Users,
                title: 'User Management',
                description: 'Streamlined patron registration, profiles, and borrowing history tracking.',
                color: 'red'
              },
              {
                icon: Leaf,
                title: 'Eco-Friendly',
                description: 'Track sustainability metrics and reduce environmental impact with digital-first workflows.',
                color: 'emerald'
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="group p-8 bg-white border-2 border-gray-100 hover:border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-xl"
              >
                <div className={`w-14 h-14 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className={`h-7 w-7 text-${feature.color}-600`} strokeWidth={2} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 px-6 lg:px-8 bg-blue-600">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
                Built for Modern Libraries
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                LibraryOS combines cutting-edge technology with intuitive design to deliver 
                the ultimate library management experience.
              </p>
              
              <div className="space-y-4">
                {[
                  'Automated loan processing and notifications',
                  'QR code integration for seamless checkouts',
                  'Mobile-responsive interface for on-the-go access',
                  'Advanced reservation and waitlist management'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-6 w-6 text-blue-200 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                    <span className="text-lg text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <Clock className="h-12 w-12 text-white mb-4" strokeWidth={2} />
                <h3 className="text-2xl font-bold text-white mb-3">Save Time</h3>
                <p className="text-blue-100">
                  Reduce administrative overhead by up to 70% with intelligent automation and streamlined workflows.
                </p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8">
                <TrendingUp className="h-12 w-12 text-white mb-4" strokeWidth={2} />
                <h3 className="text-2xl font-bold text-white mb-3">Increase Engagement</h3>
                <p className="text-blue-100">
                  Boost patron satisfaction with personalized recommendations and seamless digital experiences.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 lg:px-8 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Library?
          </h2>
          <p className="text-xl text-gray-400 mb-10">
            Join hundreds of libraries already using LibraryOS to deliver exceptional service.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center gap-2 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white text-lg font-semibold rounded-xl transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            Get Started Free
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 lg:px-8 bg-gray-900 border-t border-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">LibraryOS</div>
                <div className="text-sm text-gray-500">© 2026 All rights reserved</div>
              </div>
            </div>
            
            <div className="flex gap-8 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

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

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-slow {
          animation: fade-in 1.2s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }

        .animate-slide-up-delay {
          animation: slide-up 0.8s ease-out 0.2s both;
        }

        .animate-slide-up-delay-2 {
          animation: slide-up 0.8s ease-out 0.4s both;
        }
      `}</style>
    </div>
  );
}