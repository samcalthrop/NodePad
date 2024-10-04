import fs from 'node:fs';

export const getFileContents = (path: string): string => {
  const fileContents = fs.readFileSync(path, 'utf8');
  // logs the call for getFileContents + what it returns
  console.log('getFileContents', { fileContents });
  return fileContents;
};
