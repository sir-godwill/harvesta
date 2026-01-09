import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Award, 
  ShieldCheck, 
  FileCheck, 
  Globe, 
  CheckCircle,
  Building2,
  Leaf,
  Scale
} from 'lucide-react';

const certifications = [
  {
    icon: ShieldCheck,
    title: 'Data Protection',
    description: 'Compliant with Nigeria Data Protection Regulation (NDPR) and international standards.',
  },
  {
    icon: FileCheck,
    title: 'Business Registration',
    description: 'Fully registered and licensed to operate in Nigeria and partner countries.',
  },
  {
    icon: Globe,
    title: 'International Trade',
    description: 'Adherence to international trade regulations and export/import compliance.',
  },
  {
    icon: Scale,
    title: 'Consumer Protection',
    description: 'Full compliance with consumer protection laws and fair trade practices.',
  },
];

const qualityStandards = [
  {
    title: 'Product Quality Control',
    items: [
      'Supplier quality verification',
      'Product grading standards',
      'Sample inspection protocols',
      'Quality dispute resolution',
    ],
  },
  {
    title: 'Food Safety Standards',
    items: [
      'NAFDAC compliance for food products',
      'Cold chain requirements',
      'Handling and storage guidelines',
      'Traceability systems',
    ],
  },
  {
    title: 'Agricultural Standards',
    items: [
      'Crop quality grading',
      'Livestock health certifications',
      'Organic certification support',
      'Sustainable farming verification',
    ],
  },
];

const partnerships = [
  { name: 'Agricultural Associations', description: 'Working with national and regional farming bodies' },
  { name: 'Trade Organizations', description: 'Member of relevant trade and commerce associations' },
  { name: 'Quality Certification Bodies', description: 'Partnerships with certification agencies' },
  { name: 'Logistics Partners', description: 'Verified and compliant delivery networks' },
];

export default function Compliance() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Standards</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Compliance & <span className="text-primary">Certifications</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Harvestá is committed to operating with the highest standards of compliance, 
              quality, and ethical business practices.
            </p>
          </div>
        </div>
      </section>

      {/* Regulatory Compliance */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Regulatory Compliance</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {certifications.map((cert, index) => (
              <Card key={index} className="bg-card border-border card-hover text-center">
                <CardContent className="p-6">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <cert.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quality Standards */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Quality Standards</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {qualityStandards.map((standard, index) => (
              <Card key={index} className="bg-card border-border">
                <CardHeader>
                  <CardTitle className="text-lg">{standard.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {standard.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20">Sustainability</Badge>
              <h2 className="text-3xl font-bold mb-4">Environmental Commitment</h2>
              <p className="text-muted-foreground mb-6">
                We're committed to promoting sustainable agricultural practices and 
                reducing environmental impact across our supply chain.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Support for organic and sustainable farming</span>
                </li>
                <li className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Reduced food waste through efficient logistics</span>
                </li>
                <li className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Carbon footprint reduction initiatives</span>
                </li>
                <li className="flex items-start gap-3">
                  <Leaf className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">Sustainable packaging promotion</span>
                </li>
              </ul>
            </div>
            <Card className="bg-gradient-to-br from-secondary/10 to-green-100/50 border-secondary/20">
              <CardContent className="p-8 text-center">
                <Leaf className="w-16 h-16 text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Green Marketplace</h3>
                <p className="text-muted-foreground">
                  Working towards a more sustainable agricultural future
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Partnerships */}
      <section className="py-12 lg:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-center mb-10">Industry Partnerships</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerships.map((partner, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6 text-center">
                  <Building2 className="w-10 h-10 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">{partner.name}</h3>
                  <p className="text-sm text-muted-foreground">{partner.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Certification Badges */}
      <section className="py-12 lg:py-16 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">Certified & Compliant</h2>
          <p className="text-muted-foreground mb-10 max-w-xl mx-auto">
            Our certifications and compliance standards ensure a trustworthy marketplace.
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="w-32 h-32 bg-muted/50 border-border flex items-center justify-center">
                <Award className="w-10 h-10 text-muted-foreground" />
              </Card>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Certification badges will be displayed here upon verification
          </p>
        </div>
      </section>
    </Layout>
  );
}
