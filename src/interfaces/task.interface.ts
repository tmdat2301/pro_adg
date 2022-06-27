import { TaskType } from '@helpers/constants';

export interface CreateTaskModal {
  collaborators: string[] | null;
  completed: boolean;
  createdBy: string;
  createdDate: Date | string;
  duration: Date | string;
  finishDay: Date | string | null;
  ownerId: string;
  relatedObject: string | null;
  result: number | null;
  title: string;
  type: TaskType;
  description?: string;
}

export interface AppointmentModal {
  title: string;
  type: number;
  place: string;
  ownerId: string;
  createdDate: Date | string;
  allDay: boolean;
  result: number | null;
  description: string;
  completed: boolean;
  finishDay: Date | string | null;
  relatedObject: string;
  collaborators: string[] | null;
  startDate: Date | string;
  endDate: Date | string;
  placeId: string | null;
  latitude: number | null;
  longtitude: number | null;
}

export interface BodyTaskCheck {
  id: string;
  latitude: number;
  longtitude: number;
  placeId: string;
  place: string;
}

export interface BodyCost {
  files: string[];
  taskId: string;
  costTypeId: string;
  note: string | null;
  link: string | null;
  price: number;
}
export interface checkIn {
  id: string; // id của cuộc hẹn
  latitude: number;
  longtitude: number;
  placeId: string;
  place: string;
}
export interface checkOut {
  id: string; // id của cuộc hẹn
  latitude: number;
  longtitude: number;
  placeId: string;
  place: string;
}

export interface ResultLocation {
  plus_code: any;
  results: DataLocation[];
  status: number | string | any | null;
}

export interface DataLocation {
  address_components: LongShortName[];
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  reference: string;
  plus_code: {
    compound_code: string;
    global_code: string;
  };
  types: any[];
}

export interface LongShortName {
  long_name: string;
  short_name: string;
}

export interface IdsBody {
  Ids: string[];
}

export interface ItemRelatedObject {
  id: number;
  menuId: number;
  name: string;
}

export interface InitValuesCostFormik {
  total_cost: string;
  costs: ItemCostFormik | "";
  license_link: string;
  note: string;
}

export interface ItemCostFormik {
  email: string | null;
  label: string;
  value: string;
}
