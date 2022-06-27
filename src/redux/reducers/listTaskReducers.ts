import { TaskList } from '@interfaces/TaskList';
import actionTypes from '../actionTypes';

export interface ListTaskReducer {
  arrTask: TaskList[];
  type: string;
  errorMessage: string;
  totalCount: number;
}

const initialState: ListTaskReducer = {
  arrTask: [],
  type: '',
  errorMessage: '',
  totalCount: 0,
};
export default (state = initialState, action: any) => {
  state.type = action.type;
  switch (action.type) {
    case actionTypes.TASK_FAILED:
      return {
        ...state,
        errorMessage: action.error,
      };
    case actionTypes.TASK_REQUEST:
      return {
        ...state,
        errorMessage: '',
      };
    case actionTypes.TASK_SUCCESS:
      return {
        ...state,
        arrTask: action.response.listData,
        errorMessage: '',
        totalCount: action.response.total,
      };
    default:
      return state;
  }
};
