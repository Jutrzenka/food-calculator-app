import { JsonCommunicationType } from 'src/Utils/type/JsonCommunication.type';

export const generateSuccessResponse = (): JsonCommunicationType => {
  return {
    success: true,
    typeData: 'status',
    data: null,
  };
};

export const generateElementResponse = (
  type: 'string' | 'number' | 'boolean' | 'object',
  value: any,
): JsonCommunicationType => {
  return {
    success: true,
    typeData: 'element',
    data: {
      type,
      value,
    },
  };
};

export const generateArrayResponse = (
  elements: number,
  pages: number,
  value: any[],
): JsonCommunicationType => {
  return {
    success: true,
    typeData: 'array',
    data: {
      info: {
        elements,
        pages,
      },
      value,
    },
  };
};
