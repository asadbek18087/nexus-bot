// Feature 55: File Manager
"use client";

import { useState } from 'react';
import { Folder, File, Upload, Download, Search, MoreVertical } from 'lucide-react';

const FileManager: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const files = [
    { name: 'Study Notes.pdf', type: 'file', size: '2.4 MB', modified: '2 hours ago' },
    { name: 'Projects', type: 'folder', items: 12, modified: 'Yesterday' },
    { name: 'Presentation.pptx', type: 'file', size: '5.1 MB', modified: '3 days ago' },
    { name: 'Resources', type: 'folder', items: 45, modified: 'Last week' }
  ];

  return (
    <div className="bg-gray-900 rounded-xl p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-2">
          <Folder className="w-8 h-8 text-blue-500" />
          File Manager
        </h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2">
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>

      <div className="bg-gray-800 rounded-lg p-4 mb-4 flex items-center gap-4">
        <Search className="w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search files..."
          className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {files.map((file, index) => (
          <div key={index} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-all cursor-pointer">
            <div className="flex items-center justify-between mb-3">
              {file.type === 'folder' ? (
                <Folder className="w-8 h-8 text-blue-400" />
              ) : (
                <File className="w-8 h-8 text-gray-400" />
              )}
              <button className="text-gray-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
            <p className="text-white font-medium mb-1">{file.name}</p>
            <p className="text-gray-500 text-sm">
              {file.type === 'folder' ? `${file.items} items` : file.size}
            </p>
            <p className="text-gray-500 text-xs">{file.modified}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FileManager;
