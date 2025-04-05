
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PatientForm } from '@/components/PatientForm';
import { PatientList } from '@/components/PatientList';
import { ImportExportButtons } from '@/components/ImportExportButtons';
import { PatientService } from '@/services/PatientService';
import { useAuth } from '@/contexts/AuthContext';
import { LogOut, User } from 'lucide-react';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [patients, setPatients] = useState(PatientService.getAll());
  const [activeTab, setActiveTab] = useState('list');

  const refreshPatients = () => {
    setPatients(PatientService.getAll());
  };

  const handleDelete = (id: string) => {
    if (PatientService.delete(id)) {
      refreshPatients();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">DEEPAK P JAIN</h1>
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">{user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <div className="flex justify-between items-center flex-wrap gap-4">
            <TabsList>
              <TabsTrigger value="list">Patient Records</TabsTrigger>
              <TabsTrigger value="add">Add New Patient</TabsTrigger>
            </TabsList>

            <ImportExportButtons onImportSuccess={refreshPatients} />
          </div>

          <TabsContent value="list" className="space-y-4">
            <PatientList patients={patients} onDelete={handleDelete} />
          </TabsContent>

          <TabsContent value="add">
            <PatientForm onSuccess={() => {
              refreshPatients();
              setActiveTab('list');
            }} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};
