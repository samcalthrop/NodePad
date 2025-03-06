import { rename } from 'node:fs/promises';
import path from 'node:path';
import fs from 'node:fs';

export type returnMessage = {
  success: boolean;
  path?: string;
};

export const getFileContents = (filePath: string): string => {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    console.log('getFileContents', { fileContents });
    return fileContents;
  } catch (error) {
    console.error('Error reading file:', filePath, error);
    throw error;
  }
};

export const renameFile = async (oldPath: string, newTitle: string): Promise<returnMessage> => {
  try {
    const directory = path.dirname(oldPath);
    const newPath = path.join(directory, newTitle.trim() + '.md');

    // old path must exist in order to be renamed
    if (!oldPath) {
      return { success: false, path: newPath };
    }

    await rename(oldPath, newPath);
    return { success: true, path: newPath };
  } catch (error) {
    console.log('rename-title error:', error);
    return { success: false, path: oldPath };
  }
};

export const saveFile = (filePath: string, content: string): returnMessage => {
  fs.writeFile(filePath, content, (err) => {
    if (err) {
      console.log(err);
      return { success: false, err };
    }
    return { success: true, err };
  });
  return { success: true };
};

// used to retrieve the Multi-purpose Internet Mail Extension (MIME) type of the image, so as to correctly encode base64 image data
export const getMimeType = (filePath: string): string => {
  const extension = filePath.toLowerCase();
  if (extension.endsWith('.png')) return 'image/png';
  if (extension.endsWith('.webp')) return 'image/webp';
  if (extension.endsWith('.svg')) return 'image/svg+xml';
  if (extension.endsWith('.gif')) return 'image/gif';
  return 'image/jpeg'; // the default extension for .jpg, .jpeg...
};
