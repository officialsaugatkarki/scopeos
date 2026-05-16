'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePortal } from '@/components/portal-context';
import { getPortalFiles, uploadPortalFile, deletePortalFile, getPortalFileUrl } from '@/lib/database';
import type { PortalFile } from '@/lib/supabase';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Upload,
  FileText,
  FileImage,
  FileVideo,
  FileArchive,
  File,
  Download,
  Trash2,
  CloudUpload,
  Loader2,
  X,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

const FILE_TYPE_ICONS: Record<string, typeof FileText> = {
  'application/pdf': FileText,
  'image/': FileImage,
  'video/': FileVideo,
  'application/zip': FileArchive,
  'application/x-rar': FileArchive,
};

function getFileIcon(fileType: string | null) {
  if (!fileType) return File;
  for (const [key, Icon] of Object.entries(FILE_TYPE_ICONS)) {
    if (fileType.startsWith(key)) return Icon;
  }
  return File;
}

function formatFileSize(bytes: number | null) {
  if (!bytes) return '—';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface UploadingFile {
  id: string;
  name: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
  error?: string;
}

export default function PortalFilesPage() {
  const { project } = usePortal();
  const [files, setFiles] = useState<PortalFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const loadFiles = useCallback(async () => {
    if (!project) return;
    const data = await getPortalFiles(project.id);
    setFiles(data);
    setIsLoading(false);
  }, [project]);

  useEffect(() => {
    loadFiles();
  }, [loadFiles]);

  const handleUpload = async (fileList: FileList | File[]) => {
    if (!project) return;
    const filesToUpload = Array.from(fileList);

    for (const file of filesToUpload) {
      const uploadId = `upload-${Date.now()}-${file.name}`;
      setUploadingFiles(prev => [...prev, {
        id: uploadId,
        name: file.name,
        progress: 0,
        status: 'uploading',
      }]);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadingFiles(prev => prev.map(u =>
          u.id === uploadId && u.status === 'uploading'
            ? { ...u, progress: Math.min(u.progress + 15, 90) }
            : u
        ));
      }, 200);

      try {
        const result = await uploadPortalFile(project.id, file);
        clearInterval(progressInterval);

        if (result) {
          setUploadingFiles(prev => prev.map(u =>
            u.id === uploadId ? { ...u, progress: 100, status: 'success' } : u
          ));
          await loadFiles();
        } else {
          setUploadingFiles(prev => prev.map(u =>
            u.id === uploadId ? { ...u, status: 'error', error: 'Upload failed' } : u
          ));
        }
      } catch (e) {
        clearInterval(progressInterval);
        setUploadingFiles(prev => prev.map(u =>
          u.id === uploadId ? { ...u, status: 'error', error: 'Upload failed' } : u
        ));
      }

      // Remove completed uploads after delay
      setTimeout(() => {
        setUploadingFiles(prev => prev.filter(u => u.id !== uploadId));
      }, 3000);
    }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    const success = await deletePortalFile(id);
    if (success) {
      setFiles(prev => prev.filter(f => f.id !== id));
    }
    setDeletingId(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  if (!project) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Files</h1>
        <p className="text-sm text-white/40 mt-1">Upload documents, view proposals, and manage project files</p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-8 md:p-12 text-center transition-all duration-300 ${
          isDragging
            ? 'border-blue-500/40 bg-blue-500/5'
            : 'border-white/[0.08] bg-white/[0.01] hover:border-white/[0.12] hover:bg-white/[0.02]'
        }`}
      >
        <input
          type="file"
          multiple
          onChange={(e) => e.target.files && handleUpload(e.target.files)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          id="file-upload"
        />
        <div className="flex flex-col items-center">
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 transition-all ${
            isDragging ? 'bg-blue-500/20 border-blue-500/30' : 'bg-white/[0.03] border-white/[0.06]'
          } border`}>
            <CloudUpload className={`w-7 h-7 ${isDragging ? 'text-blue-400' : 'text-white/30'} transition-colors`} />
          </div>
          <p className="text-sm font-medium text-white/60 mb-1">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </p>
          <p className="text-xs text-white/30">or click to browse • PDF, images, documents up to 50MB</p>
        </div>
      </div>

      {/* Upload Progress */}
      {uploadingFiles.length > 0 && (
        <div className="space-y-2">
          {uploadingFiles.map((upload) => (
            <div key={upload.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                upload.status === 'success' ? 'bg-emerald-500/10' :
                upload.status === 'error' ? 'bg-red-500/10' : 'bg-blue-500/10'
              }`}>
                {upload.status === 'uploading' && <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />}
                {upload.status === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {upload.status === 'error' && <AlertCircle className="w-4 h-4 text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-white/60 truncate">{upload.name}</p>
                <div className="w-full h-1 rounded-full bg-white/[0.04] mt-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      upload.status === 'success' ? 'bg-emerald-500' :
                      upload.status === 'error' ? 'bg-red-500' : 'bg-blue-500'
                    }`}
                    style={{ width: `${upload.progress}%` }}
                  />
                </div>
              </div>
              <span className="text-[10px] text-white/30 flex-shrink-0">
                {upload.status === 'uploading' ? `${upload.progress}%` :
                 upload.status === 'success' ? 'Done' : 'Failed'}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* File List */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="glass-card rounded-xl p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04]" />
                <div className="flex-1">
                  <div className="h-3.5 bg-white/[0.04] rounded w-3/4 mb-1.5" />
                  <div className="h-3 bg-white/[0.04] rounded w-1/2" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : files.length === 0 ? (
        <Card className="glass-card rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-white/20" />
          </div>
          <h3 className="text-lg font-semibold text-white/60 mb-2">No files uploaded</h3>
          <p className="text-sm text-white/30">Upload project documents, proposals, or contracts to share with your agency</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {files.map((file) => {
            const FileIcon = getFileIcon(file.file_type);
            const isImage = file.file_type?.startsWith('image/');
            const fileUrl = getPortalFileUrl(file.storage_path);

            return (
              <Card key={file.id} className="glass-card rounded-xl p-4 hover:border-white/10 transition-all group">
                {/* Image Preview */}
                {isImage && (
                  <div className="w-full h-32 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-3 overflow-hidden">
                    <img
                      src={fileUrl}
                      alt={file.file_name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                    <FileIcon className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/80 truncate">{file.file_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-white/30">{formatFileSize(file.file_size)}</span>
                      <span className="text-[10px] text-white/20">•</span>
                      <span className="text-[10px] text-white/30">
                        {new Date(file.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-white/50 hover:text-white/70 text-xs transition-colors"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    disabled={deletingId === file.id}
                    className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/5 hover:bg-red-500/10 text-red-400/60 hover:text-red-400 text-xs transition-colors"
                  >
                    {deletingId === file.id ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Trash2 className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
