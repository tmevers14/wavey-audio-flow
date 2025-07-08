
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

// Type declaration for Electron API
declare global {
  interface Window {
    electronAPI?: {
      showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
      onDownloadFolderSelected: (callback: (folderPath: string) => void) => void;
      platform: string;
    };
  }
}

interface FileSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (path: string, createFolder: boolean, folderName?: string) => void;
}

const FileSaveDialog = ({ isOpen, onClose, onConfirm }: FileSaveDialogProps) => {
  const [selectedPath, setSelectedPath] = useState('');
  const [createFolder, setCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');
  const isElectron = typeof window !== 'undefined' && window.electronAPI;

  useEffect(() => {
    if (isElectron && window.electronAPI?.onDownloadFolderSelected) {
      window.electronAPI.onDownloadFolderSelected((folderPath: string) => {
        setSelectedPath(folderPath);
      });
    }
  }, [isElectron]);

  const handleSelectDirectory = async () => {
    if (isElectron && window.electronAPI?.showOpenDialog) {
      try {
        const result = await window.electronAPI.showOpenDialog({
          properties: ['openDirectory'],
          title: 'Select Download Folder'
        });
        
        if (!result.canceled && result.filePaths.length > 0) {
          setSelectedPath(result.filePaths[0]);
        }
      } catch (error) {
        console.error('Failed to open folder dialog:', error);
      }
    } else {
      // Fallback for web version - use File System Access API if available
      try {
        if ('showDirectoryPicker' in window) {
          const dirHandle = await (window as any).showDirectoryPicker();
          setSelectedPath(dirHandle.name || 'Selected Folder');
        } else {
          // Fallback simulation for web
          const mockPath = '/Users/username/Downloads';
          setSelectedPath(mockPath);
        }
      } catch (error) {
        console.error('Error selecting directory:', error);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedPath) {
      onConfirm(selectedPath, createFolder, createFolder ? folderName : undefined);
      onClose();
      // Reset form
      setSelectedPath('');
      setCreateFolder(false);
      setFolderName('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && selectedPath && (!createFolder || folderName.trim())) {
      handleConfirm();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Select Save Location</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Button 
              onClick={handleSelectDirectory}
              variant="outline"
              className="w-full"
            >
              Choose Destination Folder
            </Button>
            {selectedPath && (
              <p className="text-sm text-muted-foreground mt-2 break-all">
                Selected: {selectedPath}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="create-folder"
              checked={createFolder}
              onCheckedChange={(checked) => setCreateFolder(checked as boolean)}
            />
            <label
              htmlFor="create-folder"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Create a new folder inside selected location
            </label>
          </div>

          {createFolder && (
            <div>
              <Input
                placeholder="What should the folder be called?"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={!selectedPath || (createFolder && !folderName.trim())}
          >
            Start Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FileSaveDialog;
