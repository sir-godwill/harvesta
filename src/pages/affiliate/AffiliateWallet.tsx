import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Wallet,
    DollarSign,
    ArrowUpRight,
    ArrowDownRight,
    Clock,
    CheckCircle,
    XCircle,
    Download,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    getAffiliateProfile,
    getTransactions,
    getWithdrawals,
    requestWithdrawal,
} from '@/lib/affiliate-api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AffiliateWallet() {
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<any>(null);
    const [transactions, setTransactions] = useState<any[]>([]);
    const [withdrawals, setWithdrawals] = useState<any[]>([]);
    const [withdrawalOpen, setWithdrawalOpen] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('mobile_money');
    const [paymentDetails, setPaymentDetails] = useState({ phone: '', name: '' });

    useEffect(() => {
        loadWalletData();
    }, []);

    const loadWalletData = async () => {
        try {
            const [profileRes, transactionsRes, withdrawalsRes] = await Promise.all([
                getAffiliateProfile(),
                getTransactions(20),
                getWithdrawals(10),
            ]);

            if (profileRes.data) setProfile(profileRes.data);
            if (transactionsRes.data) setTransactions(transactionsRes.data);
            if (withdrawalsRes.data) setWithdrawals(withdrawalsRes.data);
        } catch (error) {
            console.error('Error loading wallet:', error);
            toast.error('Failed to load wallet data');
        } finally {
            setLoading(false);
        }
    };

    const handleWithdrawal = async () => {
        const amount = parseFloat(withdrawalAmount);

        if (isNaN(amount) || amount < 5000) {
            toast.error('Minimum withdrawal is 5,000 XAF');
            return;
        }

        if (amount > (profile?.available_balance || 0)) {
            toast.error('Insufficient balance');
            return;
        }

        try {
            const { error } = await requestWithdrawal(amount, paymentMethod, paymentDetails);
            if (error) throw error;

            toast.success('Withdrawal request submitted!');
            setWithdrawalOpen(false);
            setWithdrawalAmount('');
            loadWalletData();
        } catch (error: any) {
            console.error('Error requesting withdrawal:', error);
            toast.error(error.message || 'Failed to request withdrawal');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold">Wallet</h1>
                <p className="text-muted-foreground">Manage your earnings and withdrawals</p>
            </div>

            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
                        <Wallet className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-green-600">
                            {profile?.available_balance?.toLocaleString() || 0} XAF
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Ready to withdraw
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Earnings</CardTitle>
                        <Clock className="h-4 w-4 text-amber-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {profile?.pending_earnings?.toLocaleString() || 0} XAF
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Awaiting approval
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
                        <ArrowDownRight className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {profile?.withdrawn_earnings?.toLocaleString() || 0} XAF
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            All time
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Withdrawal Button */}
            <Dialog open={withdrawalOpen} onOpenChange={setWithdrawalOpen}>
                <DialogTrigger asChild>
                    <Button size="lg" className="w-full sm:w-auto">
                        <ArrowUpRight className="h-4 w-4 mr-2" />
                        Request Withdrawal
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Request Withdrawal</DialogTitle>
                        <DialogDescription>
                            Minimum withdrawal: 5,000 XAF
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="amount">Amount (XAF)</Label>
                            <Input
                                id="amount"
                                type="number"
                                value={withdrawalAmount}
                                onChange={(e) => setWithdrawalAmount(e.target.value)}
                                placeholder="5000"
                                min="5000"
                                max={profile?.available_balance || 0}
                            />
                            <p className="text-xs text-muted-foreground">
                                Available: {profile?.available_balance?.toLocaleString() || 0} XAF
                            </p>
                        </div>

                        <div className="space-y-2">
                            <Label>Payment Method</Label>
                            <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="mobile_money">Mobile Money</SelectItem>
                                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {paymentMethod === 'mobile_money' && (
                            <>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        value={paymentDetails.phone}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, phone: e.target.value })}
                                        placeholder="+237 XXX XXX XXX"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="name">Account Name</Label>
                                    <Input
                                        id="name"
                                        value={paymentDetails.name}
                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, name: e.target.value })}
                                        placeholder="Full name"
                                    />
                                </div>
                            </>
                        )}

                        <Button onClick={handleWithdrawal} className="w-full">
                            Submit Request
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Tabs */}
            <Tabs defaultValue="transactions">
                <TabsList>
                    <TabsTrigger value="transactions">Transactions</TabsTrigger>
                    <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                </TabsList>

                <TabsContent value="transactions" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Transaction History</CardTitle>
                            <CardDescription>All your earnings and adjustments</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {transactions.length > 0 ? (
                                <div className="space-y-3">
                                    {transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${tx.type === 'earning' ? 'bg-green-100' : 'bg-blue-100'
                                                    }`}>
                                                    {tx.type === 'earning' ?
                                                        <ArrowUpRight className="h-4 w-4 text-green-600" /> :
                                                        <ArrowDownRight className="h-4 w-4 text-blue-600" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="font-medium capitalize">{tx.type}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {format(new Date(tx.created_at), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-semibold ${tx.type === 'earning' ? 'text-green-600' : 'text-blue-600'
                                                    }`}>
                                                    {tx.type === 'earning' ? '+' : '-'}{tx.amount} XAF
                                                </p>
                                                <Badge variant="secondary">{tx.status}</Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No transactions yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="withdrawals" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Withdrawal History</CardTitle>
                            <CardDescription>Track your payout requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {withdrawals.length > 0 ? (
                                <div className="space-y-3">
                                    {withdrawals.map((wd) => (
                                        <div key={wd.id} className="flex items-center justify-between p-3 border rounded-lg">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-full ${wd.status === 'completed' ? 'bg-green-100' :
                                                        wd.status === 'pending' ? 'bg-yellow-100' : 'bg-red-100'
                                                    }`}>
                                                    {wd.status === 'completed' ? <CheckCircle className="h-4 w-4 text-green-600" /> :
                                                        wd.status === 'pending' ? <Clock className="h-4 w-4 text-yellow-600" /> :
                                                            <XCircle className="h-4 w-4 text-red-600" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{wd.amount.toLocaleString()} XAF</p>
                                                    <p className="text-xs text-muted-foreground capitalize">
                                                        {wd.payment_method.replace('_', ' ')} • {format(new Date(wd.created_at), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={
                                                wd.status === 'completed' ? 'default' :
                                                    wd.status === 'pending' ? 'secondary' : 'destructive'
                                            }>
                                                {wd.status}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No withdrawals yet</p>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
