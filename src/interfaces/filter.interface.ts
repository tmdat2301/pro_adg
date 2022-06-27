export interface Filter {
  isFieldExtension: boolean;
  type: string;
  key: string;
  operator: string;
  values: any[];
  title: string;
  start: string;
  end: string;
  settingName: string;
}
