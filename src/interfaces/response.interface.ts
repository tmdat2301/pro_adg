export interface Response<T> {
  code: number;
  data: T;
  locale: string | null;
  message: string | null;
  result: boolean;
}

export interface ResponseReturn<T> {
  error: boolean;
  response?: Response<T>;
  errorMessage?: string;
  detail?: any;
  duplicates?: any[];
  code?: number;
}
export interface ResponseReturnArray<T> {
  error: boolean;
  response?: T;
  errorMessage?: string;
  detail?: any;
  code?: number;
}

export interface ExtensionBodyFieldFormikModel {
  multiSelectExtension?: any;
  numberExtension?: any;
  choiceExtension?: any;
  textExtension?: any;
  dateExtension?: any;
}
