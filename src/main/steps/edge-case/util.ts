import { ResourceReader } from '../../modules/resourcereader/ResourceReader';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const getEnumKeyByValue = (enumObj: any, value: string | undefined): string | undefined => {
  return Object.keys(enumObj).find(key => enumObj[key] === value);
};

export const loadResources = (fileToLoad: string): ResourceReader => {
  const resourceLoader = new ResourceReader();
  resourceLoader.Loader(fileToLoad);
  return resourceLoader;
};
