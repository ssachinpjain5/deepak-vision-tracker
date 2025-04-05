
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { PatientService } from '@/services/PatientService';
import { Import, FileUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const ImportExportButtons = ({ onImportSuccess }: { onImportSuccess: () => void }) => {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportClick = () => {
    PatientService.exportToExcel();
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsImporting(true);
      const success = await PatientService.importFromExcel(file);
      if (success) {
        onImportSuccess();
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import data');
    } finally {
      setIsImporting(false);
      // Reset the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".xlsx,.xls"
        className="hidden"
      />
      <Button
        variant="outline"
        onClick={handleImportClick}
        disabled={isImporting}
        className="flex items-center gap-2"
      >
        {isImporting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Importing...</span>
          </>
        ) : (
          <>
            <Import className="h-4 w-4" />
            <span>Import</span>
          </>
        )}
      </Button>
      <Button
        variant="outline"
        onClick={handleExportClick}
        className="flex items-center gap-2"
      >
        <FileUp className="h-4 w-4" />
        <span>Export</span>
      </Button>
    </div>
  );
};
