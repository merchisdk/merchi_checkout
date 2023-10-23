import camelCase from 'lodash/camelCase';
import snakeCase from 'lodash/snakeCase';

interface JsonObject {
  [key: string]: any;
}

enum TransformationType {
  CAMEL = "camel",
  UNDERSCORE = "underscore"
}

const functionDict: { [key in TransformationType]: (word: string) => string } = {
  [TransformationType.CAMEL]: camelCase,
  [TransformationType.UNDERSCORE]: snakeCase
};

function parseJsonKeyNames(jsonObject: any, standard: keyof typeof functionDict): any {
  if (typeof jsonObject === 'object' && jsonObject !== null) {
    if (Array.isArray(jsonObject)) {
      for (let item of jsonObject) {
        parseJsonKeyNames(item, standard);
      }
    } else {
      const oldKeys = Object.keys(jsonObject);
      for (let old of oldKeys) {
        const newKey = functionDict[standard](old);
        if (newKey !== old) {
          jsonObject[newKey] = jsonObject[old];
          delete jsonObject[old];
          parseJsonKeyNames(jsonObject[newKey], standard);
        } else {
          parseJsonKeyNames(jsonObject[old], standard);
        }
      }
    }
  }
  return jsonObject;
}

function parseJsonKeyCamel(jsonObject: any) {
  return parseJsonKeyNames(jsonObject, TransformationType.CAMEL);
}

interface Counter {
  value: number;
}

interface SerialiseOptions {
  existing?: FormData;
  excludeOld?: boolean;
  _prefix?: string;
}

export function unpackRecursiveJsonIter(jsonObject: JsonObject, options?: SerialiseOptions, fileIndex?: Counter): FormData {
  if (!options) options = {};
  const result = options.existing || new FormData();
  const prefix = options._prefix || '';

  if (!fileIndex) fileIndex = { value: 0 };

  const appendData = (name: string, value: any) => {
    if (prefix) {
      name = prefix + '-' + name;
    }
    if (value !== undefined && value !== null) {
      result.set(name, value.toString());  // Convert to string since FormData accepts only strings or Blobs.
    }
  };

  const processSingleEntityProperty = (key: string, value: any) => {
    let innerPrefix = key + '-0';
    if (prefix) {
      innerPrefix = prefix + '-' + innerPrefix;
    }
    unpackRecursiveJsonIter(value, { existing: result, _prefix: innerPrefix }, fileIndex);
    appendData(key + '-count', '1');
  };

  for (const key in jsonObject) {
    if ([undefined, '', null].includes(jsonObject[key]) || key === 'rights') {
      continue;
    }

    if (Array.isArray(jsonObject[key])) {
      jsonObject[key].forEach((item: any, index: number) => {
        if ((typeof item === "object" || Array.isArray(item)) && item !== null) {
          const arrayPrefix = prefix ? `${prefix}-${key}-${index}` : `${key}-${index}`;
          unpackRecursiveJsonIter(item, { existing: result, _prefix: arrayPrefix }, fileIndex);
        } else {
          appendData(`${key}-${index}`, item);
        }
      });
      appendData(key + '-count', jsonObject[key].length.toString());
    } else if (typeof jsonObject[key] === "object" && jsonObject[key] !== null) {
      processSingleEntityProperty(key, jsonObject[key]);
    } else {
      appendData(key, jsonObject[key]);
    }
  }

  return result;
}

export function encodeMerchiApiData(dataDict: { [key: string]: any }): { [key: string]: any } {
  const dataJson = parseJsonKeyCamel(dataDict);
  return unpackRecursiveJsonIter(dataJson);
}

export function urlSearchParams(inputParams: any): string {
  const params = { ...inputParams };  // Create a shallow copy to prevent mutation
  
  Object.keys(params).forEach(key => {
    if (params[key] === undefined || params[key] === null || params[key] === "") {
      delete params[key];
    } else if (Array.isArray(params[key])) {
      params[key] = params[key].join(',');
    } else if (typeof params[key] === 'object') {
      params[key] = JSON.stringify(params[key]);
    }
  });

  return new URLSearchParams(params).toString();
}
