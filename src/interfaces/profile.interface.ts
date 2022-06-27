export interface ProfileModel {
  email: number;
  groupsid?: string | null;
  name: string;
  sub: string;
}
export interface userInfo {
  data: Data;
  code: number;
  locale: string;
  message: string;
  result: boolean;
}

export interface UserSearch {
  id: string;
  userName: string;
  email: string;
  name: string;
  combineName: string;
}
export interface Data {
  organizationUnitId: string;
  parentId: string;
  roleId: string;
  roleName: string;
  organizationUnitName: string;
  parentName: string;
  userName: string;
  name: string;
  email: string;
  lockoutEnabled: boolean;
  id: string;
  lastModificationTime: Date;
  emailConfirmed: boolean;
  phoneNumber: string;
}

export interface UserDetailModel {
  organizationUnitId?: string | null;
  parentId?: string | null;
  roleId?: string | null;
  roleName?: string | null;
  organizationUnitName?: string | null;
  parentName?: string | null;
  userName?: string | null;
  name?: string | null;
  email?: string | null;
  lockoutEnabled?: boolean;
  id: string | null;
  lastModificationTime: Date | null;
  emailConfirmed?: boolean;
  phoneNumber: string | null;
}

export interface DataRelated {
  id: number;
  name: string;
  menuId: number;
}
export interface DataResult {
  label: any;
  value: string;
  email: string | null;
  id?: any;
  key?: any;
  order?: any;
}


export interface CatalogResult {
  value: string;
  id: string;
  key: string;
  order: number;
}
