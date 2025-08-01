import { useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, Download, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CSVRow {
  sku: string;
  quantity: string;
  supplier?: string;
  unitCost?: string;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  data: CSVRow[];
}

const CSVImport = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);
  const { toast } = useToast();

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'text/csv') {
      setFile(selectedFile);
      setValidationResult(null);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please select a CSV file.",
        variant: "destructive",
      });
    }
  }, [toast]);

  const parseCSV = (csvText: string): CSVRow[] => {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row: any = {};
      
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      
      return {
        sku: row.sku || '',
        quantity: row.quantity || '',
        supplier: row.supplier || '',
        unitCost: row.unitcost || row['unit cost'] || '',
      };
    });
  };

  const validateCSV = (data: CSVRow[]): ValidationResult => {
    const errors: string[] = [];
    
    if (data.length === 0) {
      errors.push("CSV file is empty or has no valid data rows.");
    }
    
    data.forEach((row, index) => {
      const lineNumber = index + 2; // +2 because of header row and 0-based index
      
      if (!row.sku) {
        errors.push(`Line ${lineNumber}: SKU is required.`);
      }
      
      if (!row.quantity) {
        errors.push(`Line ${lineNumber}: Quantity is required.`);
      } else if (isNaN(Number(row.quantity)) || Number(row.quantity) < 0) {
        errors.push(`Line ${lineNumber}: Quantity must be a positive number.`);
      }
      
      if (row.unitCost && (isNaN(Number(row.unitCost)) || Number(row.unitCost) < 0)) {
        errors.push(`Line ${lineNumber}: Unit cost must be a positive number.`);
      }
    });
    
    return {
      valid: errors.length === 0,
      errors,
      data,
    };
  };

  const handleValidateFile = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    
    try {
      const text = await file.text();
      const data = parseCSV(text);
      const result = validateCSV(data);
      
      setValidationResult(result);
      
      if (result.valid) {
        toast({
          title: "Validation successful",
          description: `Found ${result.data.length} valid rows ready for import.`,
        });
      } else {
        toast({
          title: "Validation failed",
          description: `Found ${result.errors.length} errors that need to be fixed.`,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error reading file",
        description: "Failed to parse CSV file. Please check the file format.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (!validationResult?.valid) return;
    
    setIsProcessing(true);
    
    try {
      // Simulate API call to update inventory
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Import successful",
        description: `Updated inventory for ${validationResult.data.length} products.`,
      });
      
      // Reset form
      setFile(null);
      setValidationResult(null);
      const fileInput = document.getElementById('csv-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
    } catch (error) {
      toast({
        title: "Import failed",
        description: "Failed to update inventory. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const template = `SKU,Quantity,Supplier,UnitCost
VDJ-001,20,Supplier A,15.50
SCN-002,50,Supplier B,12.00
FSD-003,15,Supplier C,22.75`;
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory_import_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          CSV Import
        </CardTitle>
        <CardDescription>
          Import inventory updates from your suppliers via CSV file
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Template Download */}
        <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="font-medium">Need a template?</p>
              <p className="text-sm text-muted-foreground">Download our CSV template to get started</p>
            </div>
          </div>
          <Button variant="outline" onClick={downloadTemplate}>
            <Download className="w-4 h-4 mr-2" />
            Download Template
          </Button>
        </div>

        {/* File Upload */}
        <div className="space-y-2">
          <Label htmlFor="csv-file">Select CSV File</Label>
          <Input
            id="csv-file"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
            className="file:bg-primary file:text-primary-foreground file:border-0 file:rounded-md file:px-4 file:py-2 file:mr-4"
          />
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        {/* Validation Results */}
        {validationResult && (
          <Alert className={validationResult.valid ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
            <div className="flex items-center gap-2">
              {validationResult.valid ? (
                <CheckCircle className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <AlertDescription className={validationResult.valid ? "text-green-800" : "text-red-800"}>
                {validationResult.valid ? (
                  `Validation successful! Found ${validationResult.data.length} valid rows.`
                ) : (
                  <div>
                    <p className="font-medium mb-2">Validation failed with {validationResult.errors.length} errors:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {validationResult.errors.slice(0, 5).map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                      {validationResult.errors.length > 5 && (
                        <li>... and {validationResult.errors.length - 5} more errors</li>
                      )}
                    </ul>
                  </div>
                )}
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            onClick={handleValidateFile}
            disabled={!file || isProcessing}
            variant="outline"
            className="flex-1"
          >
            {isProcessing ? "Validating..." : "Validate File"}
          </Button>
          <Button
            onClick={handleImport}
            disabled={!validationResult?.valid || isProcessing}
            className="flex-1"
          >
            {isProcessing ? "Importing..." : "Import Data"}
          </Button>
        </div>

        {/* Expected Format Info */}
        <div className="text-sm text-muted-foreground space-y-2">
          <p className="font-medium">Expected CSV format:</p>
          <div className="bg-muted p-3 rounded font-mono text-xs">
            SKU,Quantity,Supplier,UnitCost<br />
            VDJ-001,20,Supplier A,15.50<br />
            SCN-002,50,Supplier B,12.00
          </div>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>SKU and Quantity are required fields</li>
            <li>Supplier and UnitCost are optional</li>
            <li>Quantities will be added to existing stock</li>
            <li>SKUs must match existing products</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default CSVImport;