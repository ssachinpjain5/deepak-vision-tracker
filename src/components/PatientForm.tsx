
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Patient, EyeDetails } from '@/models/PatientTypes';
import { PatientService } from '@/services/PatientService';
import { toast } from 'sonner';

export const PatientForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  
  const [rightEye, setRightEye] = useState<EyeDetails>({
    sphere: '',
    cylinder: '',
    axis: '',
    add: ''
  });
  
  const [leftEye, setLeftEye] = useState<EyeDetails>({
    sphere: '',
    cylinder: '',
    axis: '',
    add: ''
  });
  
  const [framePrice, setFramePrice] = useState('');
  const [glassPrice, setGlassPrice] = useState('');
  const [remarks, setRemarks] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !name || !mobile || !remarks) {
      toast.error('Please fill all required fields');
      return;
    }
    
    const newPatient: Patient = {
      id: crypto.randomUUID(),
      date,
      name,
      mobile,
      rightEye,
      leftEye,
      framePrice,
      glassPrice,
      remarks
    };
    
    if (PatientService.add(newPatient)) {
      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setName('');
      setMobile('');
      setRightEye({ sphere: '', cylinder: '', axis: '', add: '' });
      setLeftEye({ sphere: '', cylinder: '', axis: '', add: '' });
      setFramePrice('');
      setGlassPrice('');
      setRemarks('');
      
      onSuccess();
    }
  };

  const handleRightEyeChange = (field: keyof EyeDetails, value: string) => {
    setRightEye(prev => ({ ...prev, [field]: value }));
  };

  const handleLeftEyeChange = (field: keyof EyeDetails, value: string) => {
    setLeftEye(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Patient</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="mobile">Mobile *</Label>
              <Input
                id="mobile"
                type="tel"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium mb-3">Right Eye</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="rsphere">Sphere</Label>
                  <Input
                    id="rsphere"
                    value={rightEye.sphere}
                    onChange={(e) => handleRightEyeChange('sphere', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rcylinder">Cylinder</Label>
                  <Input
                    id="rcylinder"
                    value={rightEye.cylinder}
                    onChange={(e) => handleRightEyeChange('cylinder', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="raxis">Axis</Label>
                  <Input
                    id="raxis"
                    value={rightEye.axis}
                    onChange={(e) => handleRightEyeChange('axis', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="radd">Add</Label>
                  <Input
                    id="radd"
                    value={rightEye.add}
                    onChange={(e) => handleRightEyeChange('add', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-md font-medium mb-3">Left Eye</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lsphere">Sphere</Label>
                  <Input
                    id="lsphere"
                    value={leftEye.sphere}
                    onChange={(e) => handleLeftEyeChange('sphere', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lcylinder">Cylinder</Label>
                  <Input
                    id="lcylinder"
                    value={leftEye.cylinder}
                    onChange={(e) => handleLeftEyeChange('cylinder', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="laxis">Axis</Label>
                  <Input
                    id="laxis"
                    value={leftEye.axis}
                    onChange={(e) => handleLeftEyeChange('axis', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ladd">Add</Label>
                  <Input
                    id="ladd"
                    value={leftEye.add}
                    onChange={(e) => handleLeftEyeChange('add', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="framePrice">Frame Price</Label>
              <Input
                id="framePrice"
                type="text"
                value={framePrice}
                onChange={(e) => setFramePrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="glassPrice">Glass Price</Label>
              <Input
                id="glassPrice"
                type="text"
                value={glassPrice}
                onChange={(e) => setGlassPrice(e.target.value)}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="remarks">Remarks *</Label>
            <Textarea
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Enter any additional notes"
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full sm:w-auto">Add Patient</Button>
        </CardFooter>
      </form>
    </Card>
  );
};
