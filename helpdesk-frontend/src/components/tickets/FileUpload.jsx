// FileUpload.jsx
import React, { useState } from 'react';
import { Upload, X, FileText, Image } from 'lucide-react';
import { Button } from '../ui/Button';

export const FileUpload = ({ onUpload, multiple = true }) => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const getFileIcon = (type) => {
        if (type?.startsWith('image/')) return Image;
        return FileText;
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);  // เก็บไฟล์ที่เลือกเป็น array
    };

    const removeFile = (index) => {
        setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setLoading(true);
        setError('');

        try {
            const formData = new FormData();
            files.forEach(file => {
                formData.append('files', file);
            });

            await onUpload(formData);
            setFiles([]);  // ล้างไฟล์หลังจาก upload สำเร็จ
        } catch (err) {
            console.error('Upload error:', err);
            setError(err.message || 'Upload failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                        <label className="cursor-pointer">
                            <span className="text-blue-600 hover:text-blue-500">Upload files</span>
                            <input
                                type="file"
                                className="hidden"
                                multiple={multiple}
                                onChange={handleFileChange}
                                accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                            />
                        </label>
                        <p className="text-sm text-gray-500 mt-1">Up to 5 files, max 5MB each</p>
                    </div>
                </div>
            </div>

            {files.length > 0 && (
                <div className="space-y-2">
                    {files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                            <div className="flex items-center space-x-2">
                                {React.createElement(getFileIcon(file.type), {
                                    className: "h-4 w-4 text-gray-500"
                                })}
                                <span className="text-sm text-gray-700">{file.name}</span>
                                <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                </span>
                            </div>
                            <button
                                onClick={() => removeFile(index)}
                                className="text-gray-400 hover:text-red-500"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    ))}

                    <div className="flex justify-end mt-4">
                        <Button
                            onClick={handleUpload}
                            disabled={loading}
                        >
                            {loading ? 'Uploading...' : 'Upload'}
                        </Button>
                    </div>
                </div>
            )}

            {error && (
                <div className="text-red-500 text-sm">{error}</div>
            )}
        </div>
    );
};