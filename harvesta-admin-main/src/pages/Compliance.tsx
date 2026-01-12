import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  Search,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
  MoreHorizontal,
  Scale,
  UserCheck,
  Ban,
  History,
  Globe,
  Lock,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 },
};

interface AuditLog {
  id: string;
  action: string;
  actor: string;
  target: string;
  module: string;
  timestamp: string;
  ip: string;
  details: string;
}

interface TrustScore {
  id: string;
  name: string;
  type: 'seller' | 'buyer';
  score: number;
  trend: 'up' | 'down' | 'stable';
  flags: string[];
  lastActivity: string;
}

const mockAuditLogs: AuditLog[] = [
  { id: 'a1', action: 'Seller Approved', actor: 'Amadou Diallo', target: 'Ethiopian Coffee Masters', module: 'Sellers', timestamp: new Date().toISOString(), ip: '192.168.1.1', details: 'Approved after document verification' },
  { id: 'a2', action: 'Order Cancelled', actor: 'System', target: 'ORD-4521', module: 'Orders', timestamp: new Date(Date.now() - 3600000).toISOString(), ip: 'N/A', details: 'Auto-cancelled after 72h non-payment' },
  { id: 'a3', action: 'Commission Changed', actor: 'Finance Admin', target: 'Lagos Agro Export', module: 'Payments', timestamp: new Date(Date.now() - 7200000).toISOString(), ip: '192.168.1.45', details: 'Commission reduced from 12% to 10%' },
  { id: 'a4', action: 'User Blocked', actor: 'Compliance Admin', target: 'John Doe', module: 'Buyers', timestamp: new Date(Date.now() - 86400000).toISOString(), ip: '192.168.1.23', details: 'Blocked for fraudulent activity' },
];

const mockTrustScores: TrustScore[] = [
  { id: 't1', name: 'Ethiopian Coffee Masters', type: 'seller', score: 96, trend: 'up', flags: [], lastActivity: new Date().toISOString() },
  { id: 't2', name: 'EuroFoods GmbH', type: 'buyer', score: 95, trend: 'stable', flags: [], lastActivity: new Date().toISOString() },
  { id: 't3', name: 'Lagos Agro Export', type: 'seller', score: 78, trend: 'down', flags: ['Late Deliveries'], lastActivity: new Date(Date.now() - 172800000).toISOString() },
  { id: 't4', name: 'John Smith', type: 'buyer', score: 45, trend: 'down', flags: ['Payment Issues', 'Disputes'], lastActivity: new Date(Date.now() - 604800000).toISOString() },
];

function AuditLogRow({ log }: { log: AuditLog }) {
  return (
    <motion.div variants={itemVariants}>
      <Card className="overflow-hidden hover:bg-muted/30 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-muted">
              <History className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-medium">{log.action}</span>
                <Badge variant="outline" className="text-[10px]">{log.module}</Badge>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                <span className="font-medium text-foreground">{log.actor}</span> → {log.target}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{log.details}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{new Date(log.timestamp).toLocaleString()}</p>
              <p className="font-mono">{log.ip}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function TrustScoreCard({ score }: { score: TrustScore }) {
  const getScoreColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const trendIcons = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <motion.div variants={itemVariants} whileHover={{ y: -2 }}>
      <Card className="overflow-hidden hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 rounded-lg">
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-sm">
                {score.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-sm">{score.name}</h3>
                  <p className="text-xs text-muted-foreground capitalize">{score.type}</p>
                </div>
                <div className="text-right">
                  <p className={cn('text-xl font-bold', getScoreColor(score.score))}>
                    {score.score}%
                    <span className={cn('text-sm ml-1', score.trend === 'up' ? 'text-success' : score.trend === 'down' ? 'text-destructive' : 'text-muted-foreground')}>
                      {trendIcons[score.trend]}
                    </span>
                  </p>
                </div>
              </div>
              <Progress value={score.score} className={cn('h-2 mt-2', score.score < 60 && '[&>div]:bg-destructive')} />
              {score.flags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {score.flags.map((flag) => (
                    <Badge key={flag} variant="destructive" className="text-[10px]">{flag}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default function Compliance() {
  const [activeTab, setActiveTab] = useState('trust');

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="space-y-4 sm:space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-display font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Compliance & Trust
          </h1>
          <p className="text-sm text-muted-foreground">Manage trust scores, audits, and legal compliance</p>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" /> Export Audit Log
        </Button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Avg Trust Score', value: '87%', icon: UserCheck, color: 'bg-success/10 text-success' },
          { label: 'Flagged Accounts', value: '12', icon: AlertTriangle, color: 'bg-warning/10 text-warning' },
          { label: 'Blocked Users', value: '5', icon: Ban, color: 'bg-destructive/10 text-destructive' },
          { label: 'Audit Events', value: '1.2K', icon: History, color: 'bg-info/10 text-info' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="text-xl font-bold mt-1">{stat.value}</p>
                  </div>
                  <div className={cn('p-2 rounded-lg', stat.color.split(' ')[0])}>
                    <stat.icon className={cn('h-4 w-4', stat.color.split(' ')[1])} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <motion.div variants={itemVariants}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row gap-3">
            <TabsList className="h-auto p-1">
              <TabsTrigger value="trust" className="text-xs sm:text-sm">
                <UserCheck className="h-4 w-4 mr-2" /> Trust Scores
              </TabsTrigger>
              <TabsTrigger value="audit" className="text-xs sm:text-sm">
                <History className="h-4 w-4 mr-2" /> Audit Log
              </TabsTrigger>
              <TabsTrigger value="legal" className="text-xs sm:text-sm">
                <Scale className="h-4 w-4 mr-2" /> Legal
              </TabsTrigger>
            </TabsList>
            <div className="flex gap-2 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." className="pl-9" />
              </div>
            </div>
          </div>

          <TabsContent value="trust" className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid sm:grid-cols-2 gap-4">
              {mockTrustScores.map((score) => (
                <TrustScoreCard key={score.id} score={score} />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="audit" className="mt-4">
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-3">
              {mockAuditLogs.map((log) => (
                <AuditLogRow key={log.id} log={log} />
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="legal" className="mt-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5" /> Tax & Export Rules
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Africa VAT Rules', 'EU Import Regulations', 'US FDA Compliance', 'Asia Trade Agreements'].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Lock className="h-5 w-5" /> Privacy & Consent
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {['Terms of Service v2.1', 'Privacy Policy v3.0', 'Cookie Policy', 'GDPR Compliance'].map((doc) => (
                    <div key={doc} className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{doc}</span>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </motion.div>
  );
}
