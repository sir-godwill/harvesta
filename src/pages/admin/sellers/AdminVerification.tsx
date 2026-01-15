import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Eye, Loader2, Clock, User, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { fetchPendingVerifications, approveVerification, rejectVerification } from '@/lib/verification-api';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function AdminVerification() {
    const [loading, setLoading] = useState(true);
    const [verifications, setVerifications] = useState<any[]>([]);
    const [selectedVerification, setSelectedVerification] = useState<any>(null);
    const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | null>(null);
    const [actionNotes, setActionNotes] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        loadVerifications();
    }, []);

    const loadVerifications = async () => {
        setLoading(true);
        try {
            const { data, error } = await fetchPendingVerifications();
            if (error) throw error;
            setVerifications(data || []);
        } catch (error) {
            console.error('Error loading verifications:', error);
            toast.error('Failed to load verification requests');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        if (!selectedVerification) return;

        setProcessing(true);
        try {
            const { error } = await approveVerification(
                selectedVerification.id,
                selectedVerification.supplier_id,
                actionNotes
            );

            if (error) throw error;

            toast.success('Verification approved successfully');
            setActionDialog(null);
            setActionNotes('');
            setSelectedVerification(null);
            await loadVerifications();
        } catch (error) {
            console.error('Error approving verification:', error);
            toast.error('Failed to approve verification');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!selectedVerification || !rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }

        setProcessing(true);
        try {
            const { error } = await rejectVerification(
                selectedVerification.id,
                selectedVerification.supplier_id,
                rejectionReason,
                actionNotes
            );

            if (error) throw error;

            toast.success('Verification rejected');
            setActionDialog(null);
            setActionNotes('');
            setRejectionReason('');
            setSelectedVerification(null);
            await loadVerifications();
        } catch (error) {
            console.error('Error rejecting verification:', error);
            toast.error('Failed to reject verification');
        } finally {
            setProcessing(false);
        }
    };

    const openDocumentPreview = (url: string) => {
        window.open(url, '_blank');
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
        >
            {/* Header */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-bold">Seller Verification</h1>
                <p className="text-muted-foreground">
                    Review and approve seller verification requests
                </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{verifications.length}</div>
                    </CardContent>
                </Card>
            </div>

            {/* Verification Requests Table */}
            <Card>
                <CardHeader>
                    <CardTitle>Pending Verification Requests</CardTitle>
                    <CardDescription>
                        Review seller documents and approve or reject verification requests
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {verifications.length === 0 ? (
                        <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                            <p className="text-muted-foreground">
                                There are no pending verification requests at the moment.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Seller</TableHead>
                                        <TableHead>Company</TableHead>
                                        <TableHead>Submitted</TableHead>
                                        <TableHead>Documents</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {verifications.map((verification) => (
                                        <TableRow key={verification.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <User className="h-4 w-4 text-muted-foreground" />
                                                    <span className="font-medium">
                                                        {verification.supplier?.contact_person || 'N/A'}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell>{verification.supplier?.company_name || 'N/A'}</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                    <Calendar className="h-3.5 w-3.5" />
                                                    {format(new Date(verification.submitted_at), 'MMM dd, yyyy')}
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex gap-1">
                                                    {verification.documents?.map((doc: any) => (
                                                        <Button
                                                            key={doc.id}
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => openDocumentPreview(doc.file_url)}
                                                            className="gap-1"
                                                        >
                                                            <Eye className="h-3 w-3" />
                                                            {doc.document_type.replace('_', ' ')}
                                                        </Button>
                                                    ))}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                                        onClick={() => {
                                                            setSelectedVerification(verification);
                                                            setActionDialog('approve');
                                                        }}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" />
                                                        Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => {
                                                            setSelectedVerification(verification);
                                                            setActionDialog('reject');
                                                        }}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" />
                                                        Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Approve Dialog */}
            <Dialog open={actionDialog === 'approve'} onOpenChange={() => setActionDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Approve Verification</DialogTitle>
                        <DialogDescription>
                            Approve {selectedVerification?.supplier?.company_name}'s verification request
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Admin Notes (Optional)</Label>
                            <Textarea
                                placeholder="Add any internal notes about this verification..."
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                rows={3}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog(null)}>
                            Cancel
                        </Button>
                        <Button onClick={handleApprove} disabled={processing}>
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Approving...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Approve
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={actionDialog === 'reject'} onOpenChange={() => setActionDialog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Reject Verification</DialogTitle>
                        <DialogDescription>
                            Reject {selectedVerification?.supplier?.company_name}'s verification request
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Rejection Reason *</Label>
                            <Textarea
                                placeholder="Explain why this verification is being rejected..."
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                rows={3}
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                This reason will be sent to the seller
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Label>Admin Notes (Optional)</Label>
                            <Textarea
                                placeholder="Add any internal notes..."
                                value={actionNotes}
                                onChange={(e) => setActionNotes(e.target.value)}
                                rows={2}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setActionDialog(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleReject}
                            disabled={processing || !rejectionReason.trim()}
                        >
                            {processing ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Rejecting...
                                </>
                            ) : (
                                <>
                                    <XCircle className="h-4 w-4 mr-2" />
                                    Reject
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </motion.div>
    );
}
