import * as fs from 'fs';

interface GetFilesProps {
  rootPath: string;
  foldersToCheck: string[];
  imageExtensions: string[];
}

export const getFiles = async (props: GetFilesProps): Promise<string[]> => {
  const {
    rootPath,
    foldersToCheck,
    imageExtensions,
  } = props;

  // const combinedFolders = foldersToCheck.join('|');
  // const combinedExtensions = IMAGE_EXTENSIONS.map((val) => `*.${val}`).join('|');

  let imageFiles: string[] = [];
  const fileRegex = new RegExp(`\.${imageExtensions.join('|')}`);

  return new Promise((resolve, reject) => {

    try {
      let foldersToSearch = foldersToCheck;
      let nextFoldersToSearch: string[] = [];

      while(true) {
        const {
          foundImageFiles,
          foundFoldersToSearch,
        } = checkFolders({ rootPath, foldersToSearch, fileRegex });
        
        imageFiles = [...imageFiles, ...foundImageFiles];
        nextFoldersToSearch = foundFoldersToSearch;

        console.log('nextFoldersToSearch.length ', nextFoldersToSearch.length);

        if (nextFoldersToSearch.length > 0) {
          foldersToSearch = nextFoldersToSearch;
          nextFoldersToSearch = [];
        } else {
          console.log('🧐 imageFiles', imageFiles);      
          resolve(imageFiles);
          break;
        }
      }

    } catch (error) {
      reject(error);
    }
  });
};

interface Props {
  rootPath: string;
  foldersToSearch: string[]
  fileRegex: RegExp;
}
interface CheckFoldersReturnProps {
  foundImageFiles: string[];
  foundFoldersToSearch: string[];
}

const checkFolders = (props: Props): CheckFoldersReturnProps => {
  const {
    rootPath,
    foldersToSearch,
    fileRegex,
  } = props;

  const foundImageFiles: string[] = [];
  const foundFoldersToSearch: string[] = [];

  foldersToSearch.forEach((folderName) => {
    const dir = `${rootPath}/${folderName}`;

    console.log('🧐🧐🧐 dir: ', dir);
    console.log('folderName: ', folderName);

    const files = fs.readdirSync(dir);
    console.log('files', files);

    files.forEach((file) => {
      console.log("file: ", file);
      const fileStat = fs.lstatSync(`${dir}/${file}`);
      console.log('file ', file, ' isDirectory: ', fileStat.isDirectory(), ' isFile: ', fileStat.isFile());

      if (fileStat.isDirectory()) {
        // Is a folder
        foundFoldersToSearch.push(`${folderName}/${file}`);
      } else {
        console.log('Is a file ', file);

        if (file.match(fileRegex)) {
          // Check if the file matches our extensions list
          foundImageFiles.push(`${folderName}/${file}`);
        }
      }
    });
  });

  return {
    foundFoldersToSearch,
    foundImageFiles,
  };
};
