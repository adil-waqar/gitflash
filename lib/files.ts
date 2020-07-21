import fs from 'fs';
import path from 'path';

export default {
  getCurrentDirectoryBase: (): String => {
    return path.basename(process.cwd());
  },

  directoryExists: (filePath: string): Boolean => {
    return fs.existsSync(filePath);
  }
};
