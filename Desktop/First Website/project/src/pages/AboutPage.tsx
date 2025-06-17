import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Award, 
  Users, 
  Shield, 
  MessagesSquare, 
  Briefcase,
  User,
  GraduationCap,
  HomeIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function AboutPage() {
  return (
    <div className="container px-4 md:px-6 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-4">
          <Building2 className="h-16 w-16 text-primary" />
        </div>
        <h1 className="text-4xl font-bold mb-4">About HomesAway</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Helping students find safe, affordable, and vibrant places to live during their studies.
        </p>
      </div>
      
      {/* Our Mission */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-6">
            HomesAway was born from a simple observation: finding student accommodation in a new city is stressful, especially when you don't know which neighborhoods are safe, affordable, or student-friendly.
          </p>
          <p className="text-lg text-muted-foreground mb-6">
            Our mission is to help students find their perfect home away from home, with complete confidence in their choice of neighborhood and accommodation.
          </p>
          <p className="text-lg text-muted-foreground">
            We do this by providing transparent locality insights, verified listings, and a platform that connects students directly with trusted homeowners.
          </p>
        </div>
        <div className="rounded-lg overflow-hidden shadow-lg">
          <img 
            src="https://images.pexels.com/photos/2422588/pexels-photo-2422588.jpeg?auto=compress&cs=tinysrgb&w=800" 
            alt="Students relaxing in apartment" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      
      {/* What Sets Us Apart */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">What Sets Us Apart</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-primary/5">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Award className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Locality Aura Score</h3>
              <p className="text-muted-foreground">
                Our proprietary algorithm analyzes multiple data points to rate neighborhoods on safety, affordability, transportation, and more.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <Shield className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Listings</h3>
              <p className="text-muted-foreground">
                We verify all property listings to ensure students can trust what they see and make informed decisions.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-primary/5">
            <CardContent className="p-6 flex flex-col items-center text-center">
              <MessagesSquare className="h-12 w-12 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-muted-foreground">
                Our platform enables direct communication between students and homeowners, with no middlemen or hidden fees.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* For Students and Homeowners */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold mb-8 text-center">Who We Serve</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <GraduationCap className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold">For Students</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span>Find safe and affordable neighborhoods with our Locality Aura scores</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                    <Shield className="h-4 w-4 text-primary" />
                  </span>
                  <span>Browse verified listings with transparent pricing and amenities</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                    <Users className="h-4 w-4 text-primary" />
                  </span>
                  <span>Connect directly with homeowners to arrange viewings and rentals</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link to="/register">Sign Up as a Student</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <HomeIcon className="h-12 w-12 text-primary mb-4" />
                <h3 className="text-2xl font-semibold">For Homeowners</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                    <User className="h-4 w-4 text-primary" />
                  </span>
                  <span>Reach verified student tenants looking for quality accommodation</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                    <Briefcase className="h-4 w-4 text-primary" />
                  </span>
                  <span>Manage your listings with our easy-to-use homeowner dashboard</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-flex items-center justify-center rounded-full bg-primary/10 p-1 mr-3 mt-0.5">
                    <MessagesSquare className="h-4 w-4 text-primary" />
                  </span>
                  <span>Communicate directly with potential tenants without intermediaries</span>
                </li>
              </ul>
              <div className="mt-6 text-center">
                <Button asChild>
                  <Link to="/register">Sign Up as a Homeowner</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {/* Contact Us */}
      <div className="bg-card rounded-lg p-8 shadow-sm border text-center">
        <h2 className="text-2xl font-bold mb-4">Get In Touch</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Have questions or feedback about HomesAway? We'd love to hear from you.
          Our team is always ready to help students and homeowners get the most from our platform.
        </p>
        <Button size="lg" asChild>
          <Link to="/contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}