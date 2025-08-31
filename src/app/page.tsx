import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const features = [
    {
      title: 'Specialized AI Assistants',
      description: 'Access AI specialists in Cardiology, Dermatology, Radiology, Pediatrics, and more.',
      icon: '🩺'
    },
    {
      title: 'Medical Image Analysis',
      description: 'Upload and analyze medical images, X-rays, and diagnostic files with AI support.',
      icon: '📊'
    },
    {
      title: 'Evidence-Based Consultation',
      description: 'Get treatment recommendations based on latest medical guidelines and research.',
      icon: '📚'
    },
    {
      title: 'Secure & Confidential',
      description: 'HIPAA-compliant platform ensuring patient data privacy and security.',
      icon: '🔒'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">HealthcareAI</h1>
          </div>
          <nav className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            AI-Powered Medical Consultation
            <span className="text-blue-600"> Platform</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Connect with specialized AI assistants trained in different medical fields. 
            Get expert consultation support, analyze medical images, and access evidence-based 
            treatment recommendations - all in one secure platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Consultation
              </Button>
            </Link>
            <Link href="/demo">
              <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                View Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white/50">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Medical AI Support
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Medical Specialties Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Medical Specialties Available
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: 'Cardiology', icon: '❤️', desc: 'Heart and cardiovascular conditions' },
              { name: 'Dermatology', icon: '🧴', desc: 'Skin, hair, and nail disorders' },
              { name: 'Radiology', icon: '📡', desc: 'Medical imaging interpretation' },
              { name: 'Pediatrics', icon: '👶', desc: 'Child and adolescent health' },
              { name: 'Orthopedics', icon: '🦴', desc: 'Musculoskeletal conditions' },
              { name: 'Neurology', icon: '🧠', desc: 'Brain and nervous system' }
            ].map((specialty, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className="text-3xl mb-2">{specialty.icon}</div>
                  <CardTitle className="text-lg">{specialty.name}</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription>{specialty.desc}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto text-center max-w-4xl">
          <h3 className="text-3xl font-bold text-white mb-6">
            Ready to Transform Your Medical Practice?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of healthcare professionals using AI to enhance patient care and clinical decision-making.
          </p>
          <Link href="/register">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              Get Started Today
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <h4 className="text-lg font-bold">HealthcareAI</h4>
              </div>
              <p className="text-gray-400 text-sm">
                Professional AI assistants for medical consultation and clinical decision support.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Platform</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/specialties">Medical Specialties</Link></li>
                <li><Link href="/features">Features</Link></li>
                <li><Link href="/security">Security</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Support</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/docs">Documentation</Link></li>
                <li><Link href="/help">Help Center</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4">Legal</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/privacy">Privacy Policy</Link></li>
                <li><Link href="/terms">Terms of Service</Link></li>
                <li><Link href="/compliance">HIPAA Compliance</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 HealthcareAI Platform. All rights reserved. Not a replacement for professional medical judgment.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}