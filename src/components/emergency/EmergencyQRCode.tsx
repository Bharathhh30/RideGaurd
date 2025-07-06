import React, { useState } from 'react';
import { Shield } from 'lucide-react';
import type { EmergencyInfo } from '../../types/emergency';
import EmergencyForm from './EmergencyForm';
import QRCodeDisplay from './QRCodeDisplay';
import { downloadQRCode } from '../../utils/qrcode';

export default function EmergencyQRCode() {
  const [emergencyInfo, setEmergencyInfo] = useState<EmergencyInfo>({
    fullName: '',
    email : '',
    bloodType: '',
    emergencyContact: '',
    allergies: '',
    medications: '',
    medicalConditions: '',
    photo: '',
    dateOfBirth: '',
    address: '',
    phoneNumber: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEmergencyInfo(prev => ({ ...prev, [name]: value }));
    // console.log("data",emergencyInfo) -- info is collected all good
  };

  const handlePhotoChange = (photo: string) => {
    setEmergencyInfo(prev => ({ ...prev, photo }));
  };

  // const handleDownload = () => {
  //   if (!emergencyInfo.fullName) {
  //     alert('Please enter your full name before downloading the QR code.');
  //     return;
  //   }
  //   const filename = `emergency-info-${emergencyInfo.fullName.toLowerCase().replace(/\s+/g, '-')}`;
  //   downloadQRCode(generateQRData(), filename);
  // };

  const handleDownload = async () => {
  if (!emergencyInfo.fullName || !emergencyInfo.email) {
    alert('Please enter your full name and email before downloading the QR code.');
    return;
  }

  try {
    // Send to backend
    const res = await fetch('http://localhost:3000/api/emergencyinfo', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emergencyInfo),
    });

    if (!res.ok) throw new Error('Failed to save to backend');

    const filename = `emergency-info-${emergencyInfo.fullName.toLowerCase().replace(/\s+/g, '-')}`;
    downloadQRCode(generateQRData(), filename);
  } catch (err) {
    console.error(err);
    alert('Something went wrong while saving data.');
  }
};



// apporach - 3
// const generateQRData = () => {
//   const { photo, ...dataWithoutPhoto } = emergencyInfo;
//   const data = {
//     ...dataWithoutPhoto,
//     generatedAt: new Date().toISOString(),
//   };
//   console.log(data,"here")
//   // const firstName = data.fullName.trim().split(" ")[0].toLowerCase();
//   const baseUrl = window.location.origin;
//   const encodedData = encodeURIComponent(JSON.stringify(data));

//   return `${baseUrl}/emergencyinfo/${firstName}?data=${encodedData}`;
// };

const generateQRData = () => {
  const { photo, ...dataWithoutPhoto } = emergencyInfo;
  const baseUrl = window.location.origin;
  const email = dataWithoutPhoto.email?.trim().toLowerCase();

  return `${baseUrl}/emergencyinfo/${encodeURIComponent(email)}`;
};



  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center mb-8">
          <Shield className="h-8 w-8 text-orange-500 mr-3" />
          <h3 className="text-2xl font-bold text-gray-900">Emergency Information QR Code</h3>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h4>
            <EmergencyForm 
              emergencyInfo={emergencyInfo}
              onChange={handleChange}
              onPhotoChange={handlePhotoChange}
            />
          </div>
          <div className="lg:border-l lg:pl-8">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Your Emergency QR Code</h4>
            <QRCodeDisplay 
              qrValue={generateQRData()}
              onDownload={handleDownload}
            />
          </div>
          {/* testing */}
          <div>
            <button className='bg-blue-300 p-3 rounded-lg' onClick={() => {
      window.location.href = "/emergencyinfo/test";
    }}>Click me i say </button>
          </div>
        </div>
      </div>
    </div>
  );
}