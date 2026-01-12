import { useState } from 'react';
import { X, Download, FileText, FileSpreadsheet, Loader2, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  dataType: 'commissions' | 'analytics' | 'sellers' | 'payouts';
}

export function ExportModal({ isOpen, onClose, title = 'Export Data', dataType }: ExportModalProps) {
  const [format, setFormat] = useState<'csv' | 'pdf'>('csv');
  const [dateRange, setDateRange] = useState<'week' | 'month' | 'quarter' | 'year' | 'all'>('month');
  const [isExporting, setIsExporting] = useState(false);
  const [exported, setExported] = useState(false);

  if (!isOpen) return null;

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Create mock CSV data based on data type
    let csvContent = '';
    
    switch (dataType) {
      case 'commissions':
        csvContent = 'Date,Type,Description,Amount,Status\n2026-01-10,Seller Referral,Golden Harvest Farms,315000,Paid\n2026-01-08,Buyer Referral,Order #2026-089,42500,Pending';
        break;
      case 'analytics':
        csvContent = 'Date,Clicks,Signups,Conversions,Revenue\n2026-01-10,145,8,5,125000\n2026-01-09,198,12,7,185000';
        break;
      case 'sellers':
        csvContent = 'Name,Owner,Country,Status,Products,Revenue,Commission\nGolden Harvest Farms,Ama Mensah,Ghana,Active,45,4500000,315000';
        break;
      case 'payouts':
        csvContent = 'Date,Amount,Method,Status\n2026-01-08,200000,MTN Mobile Money,Processing\n2025-12-28,500000,MTN Mobile Money,Completed';
        break;
    }

    if (format === 'csv') {
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `harvesta-${dataType}-export-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // For PDF, we'd typically use a library like jsPDF
      // For now, just simulate the export
      toast.info('PDF export would be generated here');
    }

    setIsExporting(false);
    setExported(true);
    toast.success(`${dataType.charAt(0).toUpperCase() + dataType.slice(1)} exported successfully!`);
    
    setTimeout(() => {
      setExported(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div 
        className="bg-card rounded-2xl shadow-elevated max-w-sm w-full animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            <h3 className="font-semibold text-foreground">{title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          {/* Format Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Export Format
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setFormat('csv')}
                className={cn(
                  'p-3 rounded-lg border flex items-center gap-2 transition-all',
                  format === 'csv' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                )}
              >
                <FileSpreadsheet className={cn('w-5 h-5', format === 'csv' ? 'text-primary' : 'text-muted-foreground')} />
                <span className="font-medium">CSV</span>
              </button>
              <button
                onClick={() => setFormat('pdf')}
                className={cn(
                  'p-3 rounded-lg border flex items-center gap-2 transition-all',
                  format === 'pdf' 
                    ? 'border-primary bg-primary/5' 
                    : 'border-border hover:border-primary/50'
                )}
              >
                <FileText className={cn('w-5 h-5', format === 'pdf' ? 'text-primary' : 'text-muted-foreground')} />
                <span className="font-medium">PDF</span>
              </button>
            </div>
          </div>

          {/* Date Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Date Range
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value as typeof dateRange)}
              className="w-full p-3 border border-border rounded-lg bg-background focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            >
              <option value="week">Last 7 days</option>
              <option value="month">Last 30 days</option>
              <option value="quarter">Last 3 months</option>
              <option value="year">Last 12 months</option>
              <option value="all">All time</option>
            </select>
          </div>

          {/* Export Button */}
          <button
            onClick={handleExport}
            disabled={isExporting || exported}
            className={cn(
              'w-full justify-center',
              exported ? 'btn-primary' : 'btn-action'
            )}
          >
            {isExporting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : exported ? (
              <>
                <Check className="w-4 h-4" />
                Exported!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export {format.toUpperCase()}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
