import React from 'react';
import { FormGroup } from './FormGroup';
import { Toggle } from './Toggle';

interface DeleteDataSectionProps {
  isDeleting: boolean;
  onDeleting: (value: boolean) => void;
}

export const DeleteDataSection: React.FC<DeleteDataSectionProps> = ({ 
  isDeleting, 
  onDeleting 
}) => {
  return (
    <div className={`p-6 ${isDeleting ? 'sticky inset-[0px] z-20 bg-white' : 'relative'}`}>
      <FormGroup title="HAPUS DATA" color={`${isDeleting ?'danger':'normal'}`}>
        {/* Latar belakang tetap putih, hanya border yang berubah warna */}
        <div className={`col-span-2 my-2 p-4 border-2 bg-white rounded-lg flex flex-col gap-3 transition-colors duration-300 ${
          isDeleting ? 'border-red-200' : 'border-gray-200'
        }`}>
          
          {/* Caption / Warning Text */}
          <p className={`text-xs font-bold leading-relaxed transition-colors duration-300 ${
            isDeleting ? 'text-red-600' : 'text-gray-700'
          }`}>
            ⚠️ Hati-hati!
          </p>
          <p className={`text-xs font-light leading-relaxed transition-colors duration-300 ${
            isDeleting ? 'text-red-600' : 'text-gray-500'
          }`}>
            Ini adalah area penghapusan data. 
            Tindakan penghapusan data bersifat permanen. Data yang sudah dihapus tidak dapat dikembalikan lagi.
          </p>
          
          {/* Toggle Hapus */}
          <Toggle 
            label={
              <span className={`transition-colors duration-300 ${isDeleting ? 'text-red-600' : 'text-gray-700'}`}>
                Ya, saya sadar ingin menghapus data ini
              </span>
            } 
            checked={isDeleting} 
            name="deleteData"
            mode="danger"
            onChange={(val: boolean) => onDeleting(val)} 
          />
          
        </div>
      </FormGroup>
    </div>
  );
};