import * as fs from 'fs';

export const encodeImageAsBase64 = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {

      if (err) {
        reject(err);
      }

      try {
        // Split out the image extension name
        let extensionName = filePath.split('.').pop();

        if (extensionName === 'svg') {
          extensionName = 'svg+xml'
        }
        
        // Convert image file to base64-encoded string
        // @ts-ignore
        const base64Image = new Buffer(data, 'binary').toString('base64');
        
        // Combine strings
        const imgSrcString = `data:image/${extensionName};base64,${base64Image}`;
        
        resolve(imgSrcString);
      } catch (error) {
        reject(error);
      }
    });
  });
};
