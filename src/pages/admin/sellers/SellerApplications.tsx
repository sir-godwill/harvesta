import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MessageSquare,
  Download,
  Filter,
  Search,
  Calendar,
  Building,
  MapPin,
  Phone,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface Application {
  id: string;
  businessName: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  location: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'approved' | 'rejected';
  documents: string[];
}

const mockApplications: Application[] = [
  {
    id: 'APP-001',
    businessName: 'Green Valley Farms',
    businessType: 'Farm',
    contactName: 'Adebayo Okonkwo',
    email: 'adebayo@greenvalley.com',
    phone: '+234 803 456 7890',
    location: 'Lagos, Nigeria',
    submittedAt: '2024-01-10',
    status: 'pending',
    documents: ['Business Registration', 'Tax Certificate', 'Farm License']
  },
  {
    id: 'APP-002',
    businessName: 'Nairobi Spice Traders',
    businessType: 'Exporter',
    contactName: 'Wanjiku Kamau',
    email: 'wanjiku@spicetraders.co.ke',
    phone: '+254 712 345 678',
    location: 'Nairobi, Kenya',
    submittedAt: '2024-01-09',
    status: 'under_review',
    documents: ['Export License', 'Company Registration', 'Quality Certifications']
  },
  {
    id: 'APP-003',
    businessName: 'Accra Organic Co-op',
    businessType: 'Cooperative',
    contactName: 'Kwame Mensah',
    email: 'kwame@accraorganic.gh',
    phone: '+233 244 567 890',
    location: 'Accra, Ghana',
    submittedAt: '2024-01-08',
    status: 'approved',
    documents: ['Cooperative Registration', 'Member List', 'Organic Certification']
  },
  {
    id: 'APP-004',
    businessName: 'Ethiopian Coffee House',
    businessType: 'Processor',
    contactName: 'Tigist Haile',
    email: 'tigist@ethcoffee.et',
    phone: '+251 911 234 567',
    location: 'Addis Ababa, Ethiopia',
    submittedAt: '2024-01-07',
    status: 'rejected',
    documents: ['Processing License', 'Health Certification']
  },
];

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-warning/10 text-warning', icon: Clock },
  under_review: { label: 'Under Review', color: 'bg-info/10 text-info', icon: Eye },
  approved: { label: 'Approved', color: 'bg-success/10 text-success', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-destructive/10 text-destructive', icon: XCircle },
};

export default function SellerApplications() {
  const [applications, setApplications] = useState(mockApplications);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    underReview: applications.filter(a => a.status === 'under_review').length,
    approved: applications.filter(a => a.status === 'approved').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
  };

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(a => a.status === filter);

  const handleApprove = () => {
    if (selectedApp) {
      setApplications(prev => prev.map(a => 
        a.id === selectedApp.id ? { ...a, status: 'approved' as const } : a
      ));
      toast.success(`${selectedApp.businessName} has been approved!`);
      setReviewDialogOpen(false);
      setSelectedApp(null);
      setReviewNotes('');
    }
  };

  const handleReject = () => {
    if (selectedApp) {
      setApplications(prev => prev.map(a => 
        a.id === selectedApp.id ? { ...a, status: 'rejected' as const } : a
      ));
      toast.error(`${selectedApp.businessName} has been rejected.`);
      setReviewDialogOpen(false);
      setSelectedApp(null);
      setReviewNotes('');
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold">Seller Applications</h1>
          <p className="text-muted-foreground">Review and manage seller registration requests</p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {[
          { label: 'Total', value: stats.total, color: 'text-foreground' },
          { label: 'Pending', value: stats.pending, color: 'text-warning' },
          { label: 'Reviewing', value: stats.underReview, color: 'text-info' },
          { label: 'Approved', value: stats.approved, color: 'text-success' },
          { label: 'Rejected', value: stats.rejected, color: 'text-destructive' },
        ].map((stat) => (
          <Card key={stat.label} className="p-4">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </Card>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search applications..." className="pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {['all', 'pending', 'under_review', 'approved', 'rejected'].map((status) => (
            <Button
              key={status}
              variant={filter === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(status)}
              className="whitespace-nowrap"
            >
              {status === 'all' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Applications List */}
      <motion.div variants={itemVariants} className="space-y-4">
        {filteredApplications.map((app) => {
          const StatusIcon = statusConfig[app.status].icon;
          return (
            <motion.div
              key={app.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Card className="overflow-hidden">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <Avatar className="h-12 w-12 shrink-0">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {app.businessName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <h3 className="font-semibold truncate">{app.businessName}</h3>
                        <Badge className={statusConfig[app.status].color}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {statusConfig[app.status].label}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" />
                          {app.businessType}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          {app.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5" />
                          {app.submittedAt}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2 mt-2 sm:mt-0">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewDialogOpen(true);
                        }}
                      >
                        <Eye className="mr-1 h-4 w-4" />
                        Review
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Review Application</DialogTitle>
          </DialogHeader>
          
          {selectedApp && (
            <div className="space-y-6">
              {/* Business Info */}
              <div className="space-y-3">
                <h3 className="font-semibold">Business Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Business Name</p>
                    <p className="font-medium">{selectedApp.businessName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Type</p>
                    <p className="font-medium">{selectedApp.businessType}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-medium">{selectedApp.location}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Submitted</p>
                    <p className="font-medium">{selectedApp.submittedAt}</p>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <h3 className="font-semibold">Contact Details</h3>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    {selectedApp.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    {selectedApp.phone}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div className="space-y-3">
                <h3 className="font-semibold">Submitted Documents</h3>
                <div className="space-y-2">
                  {selectedApp.documents.map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review Notes */}
              <div className="space-y-2">
                <label className="font-semibold">Review Notes</label>
                <Textarea
                  placeholder="Add notes about this application..."
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                />
              </div>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setReviewDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject}>
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </Button>
            <Button onClick={handleApprove}>
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
