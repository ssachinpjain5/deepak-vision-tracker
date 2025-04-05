
import { Patient } from '@/models/PatientTypes';
import * as XLSX from 'xlsx';
import { toast } from 'sonner';

const STORAGE_KEY = 'vision_patients';

export const PatientService = {
  getAll: (): Patient[] => {
    try {
      const patients = localStorage.getItem(STORAGE_KEY);
      return patients ? JSON.parse(patients) : [];
    } catch (error) {
      console.error('Error getting patients:', error);
      return [];
    }
  },

  add: (patient: Patient): boolean => {
    try {
      const patients = PatientService.getAll();
      
      // Check if mobile number already exists
      if (patients.some(p => p.mobile === patient.mobile)) {
        toast.error('A patient with this mobile number already exists');
        return false;
      }
      
      patients.push(patient);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
      toast.success('Patient record saved successfully');
      return true;
    } catch (error) {
      console.error('Error adding patient:', error);
      toast.error('Failed to save patient record');
      return false;
    }
  },

  delete: (id: string): boolean => {
    try {
      const patients = PatientService.getAll();
      const filteredPatients = patients.filter(patient => patient.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredPatients));
      toast.success('Patient record deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting patient:', error);
      toast.error('Failed to delete patient record');
      return false;
    }
  },

  search: (query: string): Patient[] => {
    try {
      const patients = PatientService.getAll();
      if (!query) return patients;
      
      const lowerQuery = query.toLowerCase();
      return patients.filter(patient => 
        patient.name.toLowerCase().includes(lowerQuery) || 
        patient.mobile.includes(query)
      );
    } catch (error) {
      console.error('Error searching patients:', error);
      return [];
    }
  },

  exportToExcel: () => {
    try {
      const patients = PatientService.getAll();
      if (patients.length === 0) {
        toast.error('No patient records to export');
        return false;
      }
      
      // Flatten the data for export
      const dataForExport = patients.map(patient => ({
        Date: patient.date,
        Name: patient.name,
        Mobile: patient.mobile,
        'Right Eye Sphere': patient.rightEye.sphere,
        'Right Eye Cylinder': patient.rightEye.cylinder,
        'Right Eye Axis': patient.rightEye.axis,
        'Right Eye Add': patient.rightEye.add,
        'Left Eye Sphere': patient.leftEye.sphere,
        'Left Eye Cylinder': patient.leftEye.cylinder,
        'Left Eye Axis': patient.leftEye.axis,
        'Left Eye Add': patient.leftEye.add,
        'Frame Price': patient.framePrice,
        'Glass Price': patient.glassPrice,
        'Remarks': patient.remarks
      }));
      
      const worksheet = XLSX.utils.json_to_sheet(dataForExport);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Patients");
      
      // Generate filename with current date
      const date = new Date();
      const filename = `VisionRecords_${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}.xlsx`;
      
      XLSX.writeFile(workbook, filename);
      toast.success('Records exported successfully');
      return true;
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      toast.error('Failed to export records');
      return false;
    }
  },

  importFromExcel: (file: File): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          // @ts-ignore
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          // Transform the imported data to match our Patient model
          const importedPatients: Patient[] = jsonData.map((row: any, index) => ({
            id: crypto.randomUUID(),
            date: row['Date'] || new Date().toISOString().split('T')[0],
            name: row['Name'] || '',
            mobile: row['Mobile'] || '',
            rightEye: {
              sphere: row['Right Eye Sphere'] || '',
              cylinder: row['Right Eye Cylinder'] || '',
              axis: row['Right Eye Axis'] || '',
              add: row['Right Eye Add'] || '',
            },
            leftEye: {
              sphere: row['Left Eye Sphere'] || '',
              cylinder: row['Left Eye Cylinder'] || '',
              axis: row['Left Eye Axis'] || '',
              add: row['Left Eye Add'] || '',
            },
            framePrice: row['Frame Price'] || '',
            glassPrice: row['Glass Price'] || '',
            remarks: row['Remarks'] || '',
          }));
          
          // Validate imported data
          const invalidRecords = importedPatients.filter(p => !p.name || !p.mobile || !p.date);
          
          if (invalidRecords.length > 0) {
            toast.error(`Found ${invalidRecords.length} invalid records. Import canceled.`);
            resolve(false);
            return;
          }
          
          // Check for duplicate mobile numbers with existing records
          const existingPatients = PatientService.getAll();
          const existingMobiles = new Set(existingPatients.map(p => p.mobile));
          
          const duplicates = importedPatients.filter(p => existingMobiles.has(p.mobile));
          if (duplicates.length > 0) {
            toast.error(`Found ${duplicates.length} duplicate mobile numbers. Import canceled.`);
            resolve(false);
            return;
          }
          
          // Save all imported patients
          const allPatients = [...existingPatients, ...importedPatients];
          localStorage.setItem(STORAGE_KEY, JSON.stringify(allPatients));
          
          toast.success(`Successfully imported ${importedPatients.length} patient records`);
          resolve(true);
        } catch (error) {
          console.error('Error importing from Excel:', error);
          toast.error('Failed to import records');
          reject(error);
        }
      };
      
      reader.onerror = (error) => {
        console.error('Error reading file:', error);
        toast.error('Failed to read file');
        reject(error);
      };
      
      reader.readAsArrayBuffer(file);
    });
  }
};
