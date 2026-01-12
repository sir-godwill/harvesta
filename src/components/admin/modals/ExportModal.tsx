import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { toast } from 'sonner';

interface ExportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: string;
  totalRecords: number;
}

export function ExportModal({ open, onOpenChange, type, totalRecords }: ExportModalProps) {
  const [format, setFormat] = useState('csv');
  const [dateRange, setDateRange] = useState('30d');
  const [selectedFields, setSelectedFields] = useState<string[]>(['all']);
  const [isExporting, setIsExporting] = useState(false);

  const fieldOptions = {
    sellers: ['Name', 'Email', 'Status', 'Region', 'Products', 'Orders', 'Revenue', 'Commission'],
    products: ['Name', 'SKU', 'Price', 'Stock', 'Category', 'Status', 'Seller', 'Sales'],
    orders: ['Order ID', 'Date', 'Buyer', 'Seller', 'Items', 'Total', 'Status', 'Payment'],
    buyers: ['Name', 'Email', 'Company', 'Type', 'Orders', 'Total Spent', 'Region', 'Status'],
    analytics: ['Date', 'Revenue', 'Orders', 'New Users', 'Conversion Rate', 'Top Products'],
  };

  const fields = fieldOptions[type as keyof typeof fieldOptions] || [];

  const handleExport = async () => {
    setIsExporting(true);
    
    // Simulate export
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${type} data exported successfully`, {
      description: `${totalRecords} records exported as ${format.toUpperCase()}`,
    });
    
    setIsExporting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            Export {type}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <RadioGroup value={format} onValueChange={setFormat} className="flex gap-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="csv" id="csv" />
                <Label htmlFor="csv" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4" />
                  CSV
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="xlsx" id="xlsx" />
                <Label htmlFor="xlsx" className="flex items-center gap-2 cursor-pointer">
                  <FileSpreadsheet className="h-4 w-4 text-green-600" />
                  Excel
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="pdf" id="pdf" />
                <Label htmlFor="pdf" className="flex items-center gap-2 cursor-pointer">
                  <FileText className="h-4 w-4 text-red-600" />
                  PDF
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range</Label>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
                <SelectItem value="all">All time</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Field Selection */}
          <div className="space-y-3">
            <Label>Fields to Export</Label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="all-fields"
                  checked={selectedFields.includes('all')}
                  onCheckedChange={(checked) => {
                    setSelectedFields(checked ? ['all'] : []);
                  }}
                />
                <Label htmlFor="all-fields" className="cursor-pointer">All Fields</Label>
              </div>
              {!selectedFields.includes('all') && fields.map((field) => (
                <div key={field} className="flex items-center space-x-2">
                  <Checkbox
                    id={field}
                    checked={selectedFields.includes(field)}
                    onCheckedChange={(checked) => {
                      setSelectedFields(prev =>
                        checked
                          ? [...prev, field]
                          : prev.filter(f => f !== field)
                      );
                    }}
                  />
                  <Label htmlFor={field} className="cursor-pointer">{field}</Label>
                </div>
              ))}
            </div>
          </div>

          {/* Export Summary */}
          <div className="p-3 bg-muted rounded-lg text-sm">
            <p className="text-muted-foreground">
              Exporting <span className="font-medium text-foreground">{totalRecords}</span> records
              as <span className="font-medium text-foreground">{format.toUpperCase()}</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
