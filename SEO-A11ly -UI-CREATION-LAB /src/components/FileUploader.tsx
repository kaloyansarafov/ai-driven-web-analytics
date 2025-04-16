
import { useState } from 'react';
import { toast } from 'sonner';
import { Upload, FileText, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FileUploaderProps {
  onFileUpload: (file: File) => void;
  acceptedFileTypes?: string;
  maxFileSizeMB?: number;
  className?: string;
}

const FileUploader = ({
  onFileUpload,
  acceptedFileTypes = '.html,.htm,.js,.css',
  maxFileSizeMB = 10,
  className,
}: FileUploaderProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (file: File) => {
    const maxSizeBytes = maxFileSizeMB * 1024 * 1024;
    
    // Validate file size
    if (file.size > maxSizeBytes) {
      toast.error(`File is too large. Maximum size is ${maxFileSizeMB}MB.`);
      return;
    }
    
    // If file type validation is needed, could check here
    // For now, setting the file
    setFile(file);
  };

  const handleRemoveFile = () => {
    setFile(null);
    setUploadProgress(0);
  };

  const handleUpload = () => {
    if (!file) return;
    
    setIsUploading(true);
    
    // Simulate upload progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      
      if (progress >= 100) {
        clearInterval(interval);
        setIsUploading(false);
        onFileUpload(file);
        toast.success('File uploaded successfully!');
      }
    }, 200);
  };

  return (
    <div className={cn("w-full", className)}>
      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "border-2 border-dashed rounded-lg p-8 transition-colors",
            "flex flex-col items-center justify-center space-y-4",
            isDragging 
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-secondary/50",
          )}
        >
          <div className="bg-[#F3F6FD] p-4 rounded-full">
            <Upload className="h-8 w-8 text-primary" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="font-medium">Drag & Drop your files here</h3>
            <p className="text-sm text-muted-foreground">
              or click to browse from your computer
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {maxFileSizeMB}MB
            </p>
          </div>
          <input
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button variant="outline" type="button" className="cursor-pointer">
              Browse Files
            </Button>
          </label>
        </div>
      ) : (
        <div className="border rounded-lg p-6 space-y-4 bg-white shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRemoveFile}
              className="p-1 rounded-full hover:bg-secondary transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {isUploading ? (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Uploading...</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          ) : uploadProgress === 100 ? (
            <div className="flex items-center text-sm text-success">
              <CheckCircle className="mr-2 h-4 w-4" />
              Upload complete
            </div>
          ) : (
            <Button 
              onClick={handleUpload} 
              className="w-full"
            >
              Start Analysis
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
