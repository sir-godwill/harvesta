import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "@/components/seller/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  CreditCard,
  Wallet,
  PiggyBank,
  Building2,
  Smartphone,
  Send,
  History,
  Settings,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Info,
  Plus,
  ChevronRight,
  Receipt,
  Calendar,
  Eye,
  EyeOff,
  Percent,
  LayoutGrid,
  FileText,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatXAF, formatXAFCompact } from "@/lib/currency";
import { 
  fetchEarnings, 
  fetchTransactions, 
  fetchPayoutStatus, 
  fetchWalletBalance,
  fetchWithdrawalHistory,
  fetchFeeStructure,
  fetchBankAccounts,
  fetchMobileMoneyAccounts,
  fetchPayoutSchedule,
  requestWithdrawal,
  type Transaction,
  type WalletBalance,
  type WithdrawalRequest,
  type FeeStructure,
  type BankAccount,
  type MobileMoneyAccount,
  type PayoutSchedule,
  type Earnings,
} from "@/services/api";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const transactionTypeConfig: Record<string, { label: string; icon: typeof ArrowUpRight; className: string }> = {
  sale: { label: "Sale", icon: ArrowUpRight, className: "text-success bg-success/10" },
  refund: { label: "Refund", icon: ArrowDownRight, className: "text-destructive bg-destructive/10" },
  payout: { label: "Payout", icon: Wallet, className: "text-primary bg-primary/10" },
  withdrawal: { label: "Withdrawal", icon: Send, className: "text-primary bg-primary/10" },
  fee: { label: "Platform Fee", icon: CreditCard, className: "text-muted-foreground bg-muted" },
  commission: { label: "Commission (7%)", icon: Percent, className: "text-warning bg-warning/10" },
  processing_fee: { label: "Processing Fee", icon: Receipt, className: "text-muted-foreground bg-muted" },
  logistics: { label: "Logistics", icon: Clock, className: "text-accent bg-accent/10" },
};

const withdrawalStatusConfig: Record<string, { label: string; className: string; icon: typeof Clock }> = {
  pending: { label: "Pending", className: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  processing: { label: "Processing", className: "bg-primary/10 text-primary border-primary/20", icon: Loader2 },
  completed: { label: "Completed", className: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertCircle },
  cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-muted", icon: AlertCircle },
};

export default function FinancePage() {
  const [earnings, setEarnings] = useState<Earnings | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [withdrawalHistory, setWithdrawalHistory] = useState<WithdrawalRequest[]>([]);
  const [feeStructure, setFeeStructure] = useState<FeeStructure | null>(null);
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([]);
  const [mobileMoneyAccounts, setMobileMoneyAccounts] = useState<MobileMoneyAccount[]>([]);
  const [payoutSchedule, setPayoutSchedule] = useState<PayoutSchedule | null>(null);
  const [payoutStatus, setPayoutStatus] = useState<{ nextPayout: string; amount: number; status: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showBalance, setShowBalance] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [addBankDialogOpen, setAddBankDialogOpen] = useState(false);
  const [addMobileDialogOpen, setAddMobileDialogOpen] = useState(false);
  const [payoutSettingsOpen, setPayoutSettingsOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      try {
        const [
          earningsData, 
          transactionsData, 
          payoutData,
          walletData,
          withdrawalsData,
          feesData,
          banksData,
          mobileData,
          scheduleData,
        ] = await Promise.all([
          fetchEarnings(),
          fetchTransactions(),
          fetchPayoutStatus(),
          fetchWalletBalance(),
          fetchWithdrawalHistory(),
          fetchFeeStructure(),
          fetchBankAccounts(),
          fetchMobileMoneyAccounts(),
          fetchPayoutSchedule(),
        ]);
        setEarnings(earningsData);
        setTransactions(transactionsData);
        setPayoutStatus(payoutData);
        setWalletBalance(walletData);
        setWithdrawalHistory(withdrawalsData);
        setFeeStructure(feesData);
        setBankAccounts(banksData);
        setMobileMoneyAccounts(mobileData);
        setPayoutSchedule(scheduleData);
      } catch (error) {
        console.error("Failed to load finance data:", error);
        toast.error("Failed to load finance data");
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleWithdrawal = async () => {
    const amount = parseFloat(withdrawalAmount);
    if (!amount || amount < (feeStructure?.minimumWithdrawal || 10000)) {
      toast.error(`Minimum withdrawal is ${formatXAF(feeStructure?.minimumWithdrawal || 10000)}`);
      return;
    }
    if (amount > (walletBalance?.available || 0)) {
      toast.error("Insufficient balance");
      return;
    }
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    setIsWithdrawing(true);
    try {
      await requestWithdrawal({
        amount,
        paymentMethod: selectedPaymentMethod as any,
        accountId: "default",
      });
      toast.success("Withdrawal request submitted successfully!");
      setWithdrawDialogOpen(false);
      setWithdrawalAmount("");
      const [walletData, withdrawalsData] = await Promise.all([
        fetchWalletBalance(),
        fetchWithdrawalHistory(),
      ]);
      setWalletBalance(walletData);
      setWithdrawalHistory(withdrawalsData);
    } catch (error) {
      toast.error("Failed to submit withdrawal request");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const getWithdrawalFee = () => {
    if (!feeStructure || !selectedPaymentMethod) return 0;
    return feeStructure.withdrawalFees[selectedPaymentMethod as keyof typeof feeStructure.withdrawalFees] || 0;
  };

  const getNetAmount = () => {
    const amount = parseFloat(withdrawalAmount) || 0;
    return Math.max(0, amount - getWithdrawalFee());
  };

  const handleAddBankAccount = () => {
    toast.success("Bank account added successfully!");
    setAddBankDialogOpen(false);
  };

  const handleAddMobileAccount = () => {
    toast.success("Mobile money account added successfully!");
    setAddMobileDialogOpen(false);
  };

  const handleSavePayoutSettings = () => {
    toast.success("Payout settings saved!");
    setPayoutSettingsOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="Finance" subtitle="Manage your earnings, wallet & withdrawals" />

      <div className="p-3 md:p-6">
        {/* Tab Navigation */}
        <ScrollArea className="w-full mb-4 md:mb-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="inline-flex h-12 w-auto min-w-full md:min-w-0 gap-1 bg-muted/50 p-1">
              <TabsTrigger value="overview" className="gap-2 px-4 md:px-5 whitespace-nowrap">
                <Wallet className="w-5 h-5" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="gap-2 px-4 md:px-5 whitespace-nowrap">
                <History className="w-5 h-5" />
                <span className="hidden sm:inline">Transactions</span>
              </TabsTrigger>
              <TabsTrigger value="withdrawals" className="gap-2 px-4 md:px-5 whitespace-nowrap">
                <Send className="w-5 h-5" />
                <span className="hidden sm:inline">Withdrawals</span>
              </TabsTrigger>
              <TabsTrigger value="accounts" className="gap-2 px-4 md:px-5 whitespace-nowrap">
                <Building2 className="w-5 h-5" />
                <span className="hidden sm:inline">Accounts</span>
              </TabsTrigger>
            </TabsList>
            <ScrollBar orientation="horizontal" />

            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-4 md:mt-6 space-y-4 md:space-y-6">
              {/* Wallet Card */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20 shadow-lg overflow-hidden">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Wallet className="w-6 h-6 text-primary" />
                          <span className="text-sm font-medium text-muted-foreground">Your Wallet</span>
                          <button 
                            onClick={() => setShowBalance(!showBalance)}
                            className="p-1.5 hover:bg-muted/50 rounded"
                          >
                            {showBalance ? <Eye className="w-5 h-5 text-muted-foreground" /> : <EyeOff className="w-5 h-5 text-muted-foreground" />}
                          </button>
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">Available Balance</p>
                          <p className="text-2xl md:text-4xl font-bold text-foreground">
                            {showBalance ? (walletBalance ? formatXAF(walletBalance.available) : "—") : "•••••••"}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-4 md:gap-6 text-sm">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center">
                              <Clock className="w-4 h-4 text-warning" />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Pending</p>
                              <p className="font-semibold text-warning">
                                {showBalance ? (walletBalance ? formatXAFCompact(walletBalance.pending) : "—") : "•••"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Loader2 className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Processing</p>
                              <p className="font-semibold text-primary">
                                {showBalance ? (walletBalance ? formatXAFCompact(walletBalance.processing) : "—") : "•••"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                              <PiggyBank className="w-4 h-4 text-foreground" />
                            </div>
                            <div>
                              <p className="text-muted-foreground text-xs">Total</p>
                              <p className="font-semibold">
                                {showBalance ? (walletBalance ? formatXAFCompact(walletBalance.total) : "—") : "•••"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="lg" className="gap-2 w-full md:w-auto">
                              <Send className="w-5 h-5" />
                              Withdraw Funds
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle>Withdraw Funds</DialogTitle>
                              <DialogDescription>
                                Transfer money to your bank account or mobile money
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="p-3 bg-muted/50 rounded-lg">
                                <p className="text-xs text-muted-foreground">Available Balance</p>
                                <p className="text-xl font-bold">{walletBalance ? formatXAF(walletBalance.available) : "—"}</p>
                              </div>
                              
                              <div className="space-y-2">
                                <Label>Amount (XAF)</Label>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  value={withdrawalAmount}
                                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                                  min={feeStructure?.minimumWithdrawal || 10000}
                                  max={walletBalance?.available || 0}
                                />
                                <p className="text-xs text-muted-foreground">
                                  Minimum: {formatXAF(feeStructure?.minimumWithdrawal || 10000)}
                                </p>
                              </div>

                              <div className="space-y-2">
                                <Label>Payment Method</Label>
                                <Select value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select payment method" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {bankAccounts.length > 0 && (
                                      <SelectItem value="bank_transfer">
                                        <div className="flex items-center gap-2">
                                          <Building2 className="w-4 h-4" />
                                          Bank Transfer - {bankAccounts.find(b => b.isDefault)?.bankName || bankAccounts[0]?.bankName}
                                        </div>
                                      </SelectItem>
                                    )}
                                    {mobileMoneyAccounts.filter(m => m.provider === 'mtn_momo').map(acc => (
                                      <SelectItem key={acc.id} value="mtn_momo">
                                        <div className="flex items-center gap-2">
                                          <Smartphone className="w-4 h-4" />
                                          MTN MoMo - {acc.phoneNumber}
                                        </div>
                                      </SelectItem>
                                    ))}
                                    {mobileMoneyAccounts.filter(m => m.provider === 'orange_money').map(acc => (
                                      <SelectItem key={acc.id} value="orange_money">
                                        <div className="flex items-center gap-2">
                                          <Smartphone className="w-4 h-4" />
                                          Orange Money - {acc.phoneNumber}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>

                              {withdrawalAmount && selectedPaymentMethod && (
                                <div className="p-3 bg-muted/30 rounded-lg space-y-2">
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Amount</span>
                                    <span>{formatXAF(parseFloat(withdrawalAmount) || 0)}</span>
                                  </div>
                                  <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Withdrawal Fee</span>
                                    <span className="text-destructive">-{formatXAF(getWithdrawalFee())}</span>
                                  </div>
                                  <Separator />
                                  <div className="flex justify-between font-semibold">
                                    <span>You'll receive</span>
                                    <span className="text-success">{formatXAF(getNetAmount())}</span>
                                  </div>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setWithdrawDialogOpen(false)}>
                                Cancel
                              </Button>
                              <Button onClick={handleWithdrawal} disabled={isWithdrawing}>
                                {isWithdrawing ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4 mr-2" />
                                    Withdraw
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button variant="outline" size="sm" className="gap-2 w-full md:w-auto">
                          <Download className="w-4 h-4" />
                          Export Statement
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Fee Structure Info */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Info className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-sm">Platform Fee Structure</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        <strong>7% commission</strong> on all sales + <strong>~2% payment processing fee</strong>. 
                        Withdrawal fees vary by method: Bank transfer (500 XAF), MTN MoMo (200 XAF), Orange Money (200 XAF).
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Earnings Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-success/10 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-success" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">This Month</p>
                    <p className="text-lg md:text-xl font-bold text-foreground">
                      {earnings ? formatXAFCompact(earnings.thisMonth) : "—"}
                    </p>
                    <p className="text-xs text-success mt-1">
                      +12% from last month
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-warning/10 flex items-center justify-center">
                        <Percent className="w-5 h-5 text-warning" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Fees Paid</p>
                    <p className="text-lg md:text-xl font-bold text-foreground">
                      {earnings ? formatXAFCompact((earnings.commissionFees || 0) + (earnings.processingFees || 0)) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Commission + Processing</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Send className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Total Withdrawn</p>
                    <p className="text-lg md:text-xl font-bold text-foreground">
                      {earnings ? formatXAFCompact(earnings.totalWithdrawn || 0) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">All time</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-3 md:p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                        <PiggyBank className="w-5 h-5 text-accent" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Lifetime Earnings</p>
                    <p className="text-lg md:text-xl font-bold text-foreground">
                      {earnings ? formatXAFCompact(earnings.lifetimeEarnings || 0) : "—"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">Gross revenue</p>
                  </CardContent>
                </Card>
              </div>

              {/* Next Payout */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Next Scheduled Payout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-2xl font-bold text-foreground">
                        {payoutStatus ? formatXAF(payoutStatus.amount) : "—"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Scheduled for {payoutStatus?.nextPayout || "—"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        {payoutStatus?.status || "Ready"}
                      </Badge>
                      <Dialog open={payoutSettingsOpen} onOpenChange={setPayoutSettingsOpen}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1">
                            <Settings className="w-4 h-4" />
                            Settings
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Payout Settings</DialogTitle>
                            <DialogDescription>Configure your automatic payout preferences</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <Label>Payout Frequency</Label>
                              <Select defaultValue="weekly">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="daily">Daily</SelectItem>
                                  <SelectItem value="weekly">Weekly</SelectItem>
                                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                                  <SelectItem value="monthly">Monthly</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Minimum Payout Amount (XAF)</Label>
                              <Input type="number" defaultValue="50000" />
                            </div>
                            <div className="space-y-2">
                              <Label>Default Payment Method</Label>
                              <Select defaultValue="bank_transfer">
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                  <SelectItem value="mtn_momo">MTN Mobile Money</SelectItem>
                                  <SelectItem value="orange_money">Orange Money</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setPayoutSettingsOpen(false)}>Cancel</Button>
                            <Button onClick={handleSavePayoutSettings}>Save Settings</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <History className="w-5 h-5 text-primary" />
                    Recent Transactions
                  </CardTitle>
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab("transactions")}>
                    View All
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactions.slice(0, 5).map((tx) => {
                      const config = transactionTypeConfig[tx.type] || transactionTypeConfig.sale;
                      const Icon = config.icon;
                      return (
                        <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                          <div className="flex items-center gap-3">
                            <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", config.className)}>
                              <Icon className="w-5 h-5" />
                            </div>
                            <div>
                              <p className="text-sm font-medium">{config.label}</p>
                              <p className="text-xs text-muted-foreground">{tx.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={cn("font-semibold text-sm", tx.type === 'refund' || tx.type === 'fee' || tx.type === 'commission' ? "text-destructive" : "text-success")}>
                              {tx.type === 'refund' || tx.type === 'fee' || tx.type === 'commission' ? "-" : "+"}{formatXAF(tx.amount)}
                            </p>
                            <p className="text-xs text-muted-foreground">{tx.date}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transactions Tab */}
            <TabsContent value="transactions" className="mt-4 md:mt-6">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <History className="w-5 h-5 text-primary" />
                        Transaction History
                      </CardTitle>
                      <CardDescription>All your financial transactions</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Download className="w-4 h-4" />
                      Export CSV
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {transactions.map((tx) => {
                        const config = transactionTypeConfig[tx.type] || transactionTypeConfig.sale;
                        const Icon = config.icon;
                        return (
                          <div key={tx.id} className="flex items-center justify-between p-3 md:p-4 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className={cn("w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center shrink-0", config.className)}>
                                <Icon className="w-5 h-5 md:w-6 md:h-6" />
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-medium truncate">{tx.description}</p>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <Badge variant="outline" className="text-xs py-0">{config.label}</Badge>
                                </div>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={cn("font-semibold", tx.type === 'refund' || tx.type === 'fee' || tx.type === 'commission' || tx.type === 'processing_fee' ? "text-destructive" : "text-success")}>
                                {tx.type === 'refund' || tx.type === 'fee' || tx.type === 'commission' || tx.type === 'processing_fee' ? "-" : "+"}{formatXAF(tx.amount)}
                              </p>
                              <p className="text-xs text-muted-foreground">{tx.date}</p>
                              {tx.breakdown && (
                                <TooltipProvider>
                                  <Tooltip>
                                    <TooltipTrigger>
                                      <Badge variant="outline" className="text-xs mt-1 cursor-help">
                                        <Info className="w-3 h-3 mr-1" />
                                        Details
                                      </Badge>
                                    </TooltipTrigger>
                                    <TooltipContent className="max-w-xs">
                                      <div className="space-y-1 text-xs">
                                        <div className="flex justify-between gap-4">
                                          <span>Gross:</span>
                                          <span>{formatXAF(tx.breakdown.grossAmount || 0)}</span>
                                        </div>
                                        <div className="flex justify-between gap-4 text-warning">
                                          <span>Commission (7%):</span>
                                          <span>-{formatXAF(tx.breakdown.commission || 0)}</span>
                                        </div>
                                        <div className="flex justify-between gap-4 text-muted-foreground">
                                          <span>Processing:</span>
                                          <span>-{formatXAF(tx.breakdown.processingFee || 0)}</span>
                                        </div>
                                        <Separator className="my-1" />
                                        <div className="flex justify-between gap-4 font-semibold text-success">
                                          <span>Net:</span>
                                          <span>{formatXAF(tx.breakdown.netAmount || 0)}</span>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Withdrawals Tab */}
            <TabsContent value="withdrawals" className="mt-4 md:mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" />
                  Withdrawal History
                </h3>
                <Button onClick={() => setWithdrawDialogOpen(true)} className="gap-2">
                  <Plus className="w-4 h-4" />
                  New Withdrawal
                </Button>
              </div>

              <Card>
                <CardContent className="p-0">
                  <ScrollArea className="h-[500px]">
                    <div className="divide-y">
                      {withdrawalHistory.length === 0 ? (
                        <div className="p-8 text-center">
                          <Send className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                          <p className="text-muted-foreground">No withdrawals yet</p>
                          <Button onClick={() => setWithdrawDialogOpen(true)} className="mt-4 gap-2">
                            <Plus className="w-4 h-4" />
                            Make First Withdrawal
                          </Button>
                        </div>
                      ) : (
                        withdrawalHistory.map((withdrawal) => {
                          const statusConfig = withdrawalStatusConfig[withdrawal.status];
                          const StatusIcon = statusConfig?.icon || Clock;
                          return (
                            <div key={withdrawal.id} className="p-4 hover:bg-muted/30 transition-colors">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", statusConfig?.className || "bg-muted")}>
                                    <StatusIcon className={cn("w-6 h-6", withdrawal.status === 'processing' && "animate-spin")} />
                                  </div>
                                  <div>
                                    <p className="font-semibold">{formatXAF(withdrawal.amount)}</p>
                                    <p className="text-sm text-muted-foreground capitalize">
                                      {withdrawal.paymentMethod.replace(/_/g, ' ')}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{withdrawal.requestedAt}</p>
                                  </div>
                                </div>
                                <Badge variant="outline" className={statusConfig?.className}>
                                  {statusConfig?.label || withdrawal.status}
                                </Badge>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Accounts Tab */}
            <TabsContent value="accounts" className="mt-4 md:mt-6 space-y-6">
              {/* Bank Accounts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-primary" />
                      Bank Accounts
                    </CardTitle>
                    <CardDescription>Your linked bank accounts for withdrawals</CardDescription>
                  </div>
                  <Dialog open={addBankDialogOpen} onOpenChange={setAddBankDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="w-4 h-4" />
                        Add Bank
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Bank Account</DialogTitle>
                        <DialogDescription>Enter your bank account details for withdrawals</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Bank Name</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bank" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="afriland">Afriland First Bank</SelectItem>
                              <SelectItem value="sgc">Société Générale Cameroun</SelectItem>
                              <SelectItem value="bicec">BICEC</SelectItem>
                              <SelectItem value="uba">UBA Cameroon</SelectItem>
                              <SelectItem value="ecobank">Ecobank Cameroon</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Account Holder Name</Label>
                          <Input placeholder="As shown on your bank account" />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Number</Label>
                          <Input placeholder="Enter account number" />
                        </div>
                        <div className="space-y-2">
                          <Label>Branch Code (Optional)</Label>
                          <Input placeholder="Branch code" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddBankDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddBankAccount}>Add Account</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {bankAccounts.length === 0 ? (
                    <div className="text-center py-8">
                      <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-3">No bank accounts added</p>
                      <Button variant="outline" onClick={() => setAddBankDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Bank Account
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {bankAccounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                              <Building2 className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium">{account.bankName}</p>
                              <p className="text-sm text-muted-foreground">****{account.accountNumber.slice(-4)}</p>
                              <p className="text-xs text-muted-foreground">{account.accountName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {account.isDefault && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">Default</Badge>
                            )}
                            {account.isVerified && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Mobile Money Accounts */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-primary" />
                      Mobile Money Accounts
                    </CardTitle>
                    <CardDescription>Your linked mobile money accounts</CardDescription>
                  </div>
                  <Dialog open={addMobileDialogOpen} onOpenChange={setAddMobileDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-1">
                        <Plus className="w-4 h-4" />
                        Add Mobile
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Mobile Money Account</DialogTitle>
                        <DialogDescription>Enter your mobile money details</DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label>Provider</Label>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="mtn_momo">MTN Mobile Money</SelectItem>
                              <SelectItem value="orange_money">Orange Money</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Phone Number</Label>
                          <Input placeholder="e.g., 6XXXXXXXX" />
                        </div>
                        <div className="space-y-2">
                          <Label>Account Name</Label>
                          <Input placeholder="Name on the account" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setAddMobileDialogOpen(false)}>Cancel</Button>
                        <Button onClick={handleAddMobileAccount}>Add Account</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {mobileMoneyAccounts.length === 0 ? (
                    <div className="text-center py-8">
                      <Smartphone className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                      <p className="text-muted-foreground mb-3">No mobile money accounts added</p>
                      <Button variant="outline" onClick={() => setAddMobileDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Add Mobile Money
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {mobileMoneyAccounts.map((account) => (
                        <div key={account.id} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-12 h-12 rounded-lg flex items-center justify-center",
                              account.provider === 'mtn_momo' ? "bg-yellow-500/10" : "bg-orange-500/10"
                            )}>
                              <Smartphone className={cn(
                                "w-6 h-6",
                                account.provider === 'mtn_momo' ? "text-yellow-600" : "text-orange-600"
                              )} />
                            </div>
                            <div>
                              <p className="font-medium">{account.provider === 'mtn_momo' ? 'MTN MoMo' : 'Orange Money'}</p>
                              <p className="text-sm text-muted-foreground">{account.phoneNumber}</p>
                              <p className="text-xs text-muted-foreground">{account.accountName}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {account.isDefault && (
                              <Badge className="bg-primary/10 text-primary border-primary/20">Default</Badge>
                            )}
                            {account.isVerified && (
                              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Verified
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payout Settings Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-primary" />
                    Payout Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Payout Frequency</p>
                      <p className="font-semibold capitalize">{payoutSchedule?.frequency || 'Weekly'}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Minimum Amount</p>
                      <p className="font-semibold">{formatXAF(payoutSchedule?.minimumAmount || 50000)}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-muted/50">
                      <p className="text-xs text-muted-foreground">Default Method</p>
                      <p className="font-semibold capitalize">{payoutSchedule?.paymentMethod?.replace(/_/g, ' ') || 'Bank Transfer'}</p>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-4 gap-2" onClick={() => setPayoutSettingsOpen(true)}>
                    <Settings className="w-4 h-4" />
                    Edit Settings
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </ScrollArea>
      </div>
    </div>
  );
}
