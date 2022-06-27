import { ItemCosts } from '@interfaces/lead.interface';
import { TaskType, TypeFieldExtension, TypeSearch } from '@helpers/constants';

export interface QuickSearchModel {
  leads: ObjectSearch;
  deals: ObjectSearch;
  contacts: ObjectSearch;
  accounts: ObjectSearch;
}

export interface SearchItems {
  id: number;
  name: string;
  code: string;
  phoneNumber: string;
  email: string;
  website: string;
  fanpage: string;
  product: string;
  ownerId: string;
  ownerName: string | null;
  ouId: string;
  ouName: string | null;
  erpRef: string | null;
  phoneNumbers: string | null;
  emails: string | null;
  websites: string | null;
  fanpages: string | null;
  products: [string] | null;
  canRead: boolean;
}
export interface ObjectSearch {
  totalCount: number;
  items: SearchItems[];
}

export interface NavigationSearch {
  navigation: any;
  route: {
    key: string;
    name: string;
    params: {
      type: TypeSearch;
    };
  };
}

export interface NavigationId {
  // onPress: () => void;
  navigation: any;
  route: {
    key: string;
    name: string;
    params: {
      id: string;
      type: TypeFieldExtension;
      taskType: TaskType;
    };
  };
}

export interface NavigationField {
  navigation: any;
  route: {
    key: string;
    name: string;
    params: {
      type: TypeFieldExtension;
      idUpdate?: number;
      isGoback?: boolean;
    };
  };
}

export interface NavigationDate {
  navigation: any;
  route: {
    key: string;
    name: string;
    params: {
      index: number;
    };
  };
}

export interface NavigationCost {
  // onPress: () => void;
  navigation: any;
  route: {
    key: string;
    name: string;
    params: {
      taskId: string;
      isAddCost?: boolean;
      item: ItemCosts;
      onRefreshing: () => void;
    };
  };
}
