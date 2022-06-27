export interface Data {
  totalCount: number;
  items: ListMissedCall[];
}
export interface ListMissedCall {
  id: number;
  activityId: string;
  creationTime: string;
  name: string;
  type: number;
  callType: 3471 | 3472 | 0;
  phone: string;
  urlAudio: string;
}
