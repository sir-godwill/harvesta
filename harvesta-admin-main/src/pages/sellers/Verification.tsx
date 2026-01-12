import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  FileCheck, 
  Eye,
  Upload,
  Clock,
  Building,
  User,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

interface VerificationItem {
  id: string;
  sellerName: string;
  businessType: string;
  verificationLevel: number;
  pendingChecks: string[];
  completedChecks: string[];
  documentsStatus: 'pending' | 'verified' | 'rejected';
  identityStatus: 'pending' | 'verified' | 'rejected';
  addressStatus: 'pending' | 'verified' | 'rejected';
  submittedAt: string;
}

const mockVerifications: VerificationItem[] = [
  {
    id: 'VER-001',
    sellerName: 'Sahara Farms Ltd',
    businessType: 'Farm',
    verificationLevel: 75,
    pendingChecks: ['Address Verification'],
    completedChecks: ['Identity Check', 'Document Verification', 'Background Check'],
    documentsStatus: 'verified',
    identityStatus: 'verified',
    addressStatus: 'pending',
    submittedAt: '2024-01-09'
  },
  {
    id: 'VER-002',
    sellerName: 'Congo Cocoa Co',
    businessType: 'Processor',
    verificationLevel: 50,
    pendingChecks: ['Document Verification', 'Address Verification'],
    completedChecks: ['Identity Check', 'Background Check'],
    documentsStatus: 'pending',
    identityStatus: 'verified',
    addressStatus: 'pending',
    submittedAt: '2024-01-08'
  },
  {
    id: 'VER-003',
    sellerName: 'East Africa Spices',
    businessType: 'Exporter',
    verificationLevel: 100,
    pendingChecks: [],
    completedChecks: ['Identity Check', 'Document Verification', 'Background Check', 'Address Verification'],
    documentsStatus: 'verified',
    identityStatus: 'verified',
    addressStatus: 'verified',
    submittedAt: '2024-01-07'
  },
];

const statusIcon = {
  pending: Clock,
  verified: CheckCircle,
  rejected: XCircle,
};

const statusColor = {
  pending: 'text-warning',
  verified: 'text-success',
  rejected: 'text-destructive',
};

export default function Verification() {
  const [verifications, setVerifications] = useState(mockVerifications);

  const handleVerify = (id: string, check: string) => {
    setVerifications(prev => prev.map(v => {
      if (v.id === id) {
        return {
          ...v,
          pendingChecks: v.pendingChecks.filter(c => c !== check),
          completedChecks: [...v.completedChecks, check],
          verificationLevel: Math.min(100, v.verificationLevel + 25),
        };
      }
      return v;
    }));
    toast.success(`${check} completed successfully!`);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">Seller Verification</h1>
        <p className="text-muted-foreground">Verify seller identity, documents, and business information</p>
      </motion.div>

      {/* Stats */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-info/10">
            <Shield className="h-6 w-6 text-info" />
          </div>
          <div>
            <p className="text-2xl font-bold">{verifications.length}</p>
            <p className="text-sm text-muted-foreground">In Queue</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-warning/10">
            <Clock className="h-6 w-6 text-warning" />
          </div>
          <div>
            <p className="text-2xl font-bold">{verifications.filter(v => v.verificationLevel < 100).length}</p>
            <p className="text-sm text-muted-foreground">Pending</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-success/10">
            <CheckCircle className="h-6 w-6 text-success" />
          </div>
          <div>
            <p className="text-2xl font-bold">{verifications.filter(v => v.verificationLevel === 100).length}</p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </div>
        </Card>
        <Card className="p-4 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-destructive/10">
            <AlertTriangle className="h-6 w-6 text-destructive" />
          </div>
          <div>
            <p className="text-2xl font-bold">0</p>
            <p className="text-sm text-muted-foreground">Flagged</p>
          </div>
        </Card>
      </motion.div>

      {/* Verification Queue */}
      <motion.div variants={itemVariants} className="space-y-4">
        <h2 className="text-lg font-semibold">Verification Queue</h2>
        {verifications.map((item) => (
          <motion.div
            key={item.id}
            whileHover={{ scale: 1.005 }}
          >
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Seller Info */}
                  <div className="flex items-center gap-4 lg:w-1/4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {item.sellerName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{item.sellerName}</h3>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <Building className="h-3.5 w-3.5" />
                        {item.businessType}
                      </p>
                    </div>
                  </div>

                  {/* Progress */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Verification Progress</span>
                      <span className="text-sm text-muted-foreground">{item.verificationLevel}%</span>
                    </div>
                    <Progress value={item.verificationLevel} className="h-2" />
                    
                    {/* Check Status */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2">
                      <div className="flex items-center gap-2 text-sm">
                        {(() => {
                          const Icon = statusIcon[item.identityStatus];
                          return <Icon className={`h-4 w-4 ${statusColor[item.identityStatus]}`} />;
                        })()}
                        <span>Identity</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {(() => {
                          const Icon = statusIcon[item.documentsStatus];
                          return <Icon className={`h-4 w-4 ${statusColor[item.documentsStatus]}`} />;
                        })()}
                        <span>Documents</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {(() => {
                          const Icon = statusIcon[item.addressStatus];
                          return <Icon className={`h-4 w-4 ${statusColor[item.addressStatus]}`} />;
                        })()}
                        <span>Address</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-success" />
                        <span>Background</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 lg:w-auto">
                    {item.pendingChecks.length > 0 ? (
                      item.pendingChecks.map((check) => (
                        <Button 
                          key={check} 
                          size="sm"
                          onClick={() => handleVerify(item.id, check)}
                        >
                          <FileCheck className="mr-1 h-4 w-4" />
                          {check}
                        </Button>
                      ))
                    ) : (
                      <Badge className="bg-success/10 text-success">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Fully Verified
                      </Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}