import React from 'react';
import { useParams, useLocation } from 'react-router-dom';

export default function EmergencyInfoDisplay() {
  const { firstName } = useParams();
  const location = useLocation();

  const query = new URLSearchParams(location.search);
  const encodedData = query.get('data');

  if (!encodedData) {
    return <div className="p-6 text-red-600 font-semibold">No emergency data found in QR code.</div>;
  }

  let info;
  try {
    info = JSON.parse(decodeURIComponent(encodedData));
  } catch (err) {
    return <div className="p-6 text-red-600 font-semibold">Invalid emergency data format.</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-orange-600">Emergency Info: {info.fullName}</h2>
      <ul className="space-y-2 text-gray-700">
        <li><strong>DOB:</strong> {info.dateOfBirth}</li>
        <li><strong>Blood Type:</strong> {info.bloodType}</li>
        <li><strong>Phone:</strong> {info.phoneNumber}</li>
        <li><strong>Emergency Contact:</strong> {info.emergencyContact}</li>
        <li><strong>Address:</strong> {info.address}</li>
        <li><strong>Allergies:</strong> {info.allergies}</li>
        <li><strong>Medications:</strong> {info.medications}</li>
        <li><strong>Conditions:</strong> {info.medicalConditions}</li>
      </ul>
    </div>
  );
}
