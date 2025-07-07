
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface FileSaveDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (path: string, createFolder: boolean, folderName?: string) => void;
}

const FileSaveDialog = ({ isOpen, onClose, onConfirm }: FileSaveDialogProps) => {
  const [selectedPath, setSelectedPath] = useState('');
  const [createFolder, setCreateFolder] = useState(false);
  const [folderName, setFolderName] = useState('');

  const handleSelectDirectory = async () => {
    try {
      // For now, we'll simulate directory selection
      // In a real implementation, you'd use the File System Access API
      const mockPath = '/Users/username/Downloads';
      setSelectedPath(mockPath);
    } catch (error) {
      console.error('Error selecting directory:', error);
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
