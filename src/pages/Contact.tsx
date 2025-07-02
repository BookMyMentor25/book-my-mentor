
import React, { useState } from 'react';
import { useContact } from '@/hooks/useContact';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Contact = () => {
  const { submitInquiry, isSubmitting } = useContact();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    course_interest: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitInquiry(formData);
    if (result.success) {
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        course_interest: ''
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-4 sm:mb-6">
            Contact Us
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Get in touch with us to start your learning journey. We're here to help you succeed!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader className="pb-4 sm:pb-6">
              <CardTitle className="text-xl sm:text-2xl">Send us a Message</CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Fill out the form below and we'll get back to you as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Your full name"
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address *
                    </label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+1 (555) 123-4567"
                    className="w-full"
                  />
                </div>

                <div>
                  <label htmlFor="course_interest" className="block text-sm font-medium text-gray-700 mb-2">
                    Course Interest
                  </label>
                  <Select
                    value={formData.course_interest}
                    onValueChange={(value) => handleInputChange('course_interest', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a course (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="product-management">Product Management</SelectItem>
                      <SelectItem value="lean-startup">Lean Startup</SelectItem>
                      <SelectItem value="project-management">Project Management</SelectItem>
                      <SelectItem value="general-inquiry">General Inquiry</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    required
                    value={formData.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us about your goals and how we can help you..."
                    rows={5}
                    className="w-full resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 text-sm sm:text-base py-2 sm:py-3"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6 sm:space-y-8">
            <Card className="shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl sm:text-2xl">Get in Touch</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Ready to start your journey? Contact us through any of these channels.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 sm:space-y-6">
                <div className="flex items-start space-x-3 sm:space-x-4">
                  <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">Address</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      123 Business Street<br />
                      Suite 100<br />
                      Business City, BC 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">Phone</h3>
                    <p className="text-sm sm:text-base text-gray-600">+1 (555) 123-4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">Email</h3>
                    <p className="text-sm sm:text-base text-gray-600">info@bookmymentor.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 sm:space-x-4">
                  <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-sm sm:text-base text-gray-900">Business Hours</h3>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Mon - Fri: 9:00 AM - 6:00 PM<br />
                      Sat: 10:00 AM - 4:00 PM<br />
                      Sun: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="shadow-lg bg-gradient-to-r from-purple-600 to-purple-800 text-white">
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Why Choose Us?</h3>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 text-center">
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">500+</div>
                    <div className="text-xs sm:text-sm opacity-90">Students Mentored</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">50+</div>
                    <div className="text-xs sm:text-sm opacity-90">Expert Mentors</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">95%</div>
                    <div className="text-xs sm:text-sm opacity-90">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl lg:text-3xl font-bold">24/7</div>
                    <div className="text-xs sm:text-sm opacity-90">Support</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
