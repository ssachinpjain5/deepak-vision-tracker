
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Patient } from '@/models/PatientTypes';
import { PatientService } from '@/services/PatientService';
import { Search, Trash2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export const PatientList = ({ patients, onDelete }: { patients: Patient[], onDelete: (id: string) => void }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewPatient, setViewPatient] = useState<Patient | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredPatients = searchQuery 
    ? PatientService.search(searchQuery)
    : patients;

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      onDelete(deleteId);
      setDeleteId(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <CardTitle>Patient Records</CardTitle>
              <CardDescription>
                {filteredPatients.length} {filteredPatients.length === 1 ? 'record' : 'records'} found
              </CardDescription>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or mobile"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead className="hidden md:table-cell">Frame Price</TableHead>
                  <TableHead className="hidden md:table-cell">Glass Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell>{patient.date}</TableCell>
                      <TableCell>{patient.name}</TableCell>
                      <TableCell>{patient.mobile}</TableCell>
                      <TableCell className="hidden md:table-cell">{patient.framePrice || '—'}</TableCell>
                      <TableCell className="hidden md:table-cell">{patient.glassPrice || '—'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setViewPatient(patient)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteClick(patient.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No records found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Patient Detail Dialog */}
      <Dialog open={!!viewPatient} onOpenChange={() => setViewPatient(null)}>
        {viewPatient && (
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{viewPatient.name}</DialogTitle>
              <DialogDescription>{viewPatient.mobile}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-2">Right Eye</h3>
                  <div className="grid grid-cols-2 text-sm gap-2">
                    <div>Sphere:</div>
                    <div>{viewPatient.rightEye.sphere || '—'}</div>
                    <div>Cylinder:</div>
                    <div>{viewPatient.rightEye.cylinder || '—'}</div>
                    <div>Axis:</div>
                    <div>{viewPatient.rightEye.axis || '—'}</div>
                    <div>Add:</div>
                    <div>{viewPatient.rightEye.add || '—'}</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-medium mb-2">Left Eye</h3>
                  <div className="grid grid-cols-2 text-sm gap-2">
                    <div>Sphere:</div>
                    <div>{viewPatient.leftEye.sphere || '—'}</div>
                    <div>Cylinder:</div>
                    <div>{viewPatient.leftEye.cylinder || '—'}</div>
                    <div>Axis:</div>
                    <div>{viewPatient.leftEye.axis || '—'}</div>
                    <div>Add:</div>
                    <div>{viewPatient.leftEye.add || '—'}</div>
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Pricing</h3>
                <div className="grid grid-cols-2 text-sm">
                  <div>Frame Price:</div>
                  <div>{viewPatient.framePrice || '—'}</div>
                  <div>Glass Price:</div>
                  <div>{viewPatient.glassPrice || '—'}</div>
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="font-medium">Remarks</h3>
                <p className="text-sm">{viewPatient.remarks}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setViewPatient(null)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              patient record from your database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
