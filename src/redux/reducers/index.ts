import { combineReducers } from 'redux';
// Redux: Root Reducer
import userReducer from './userReducer';
import filterReducer from './filterReducer';
import businessReducer from './businessReducer';
import detailsLeadReducer from './detailsLeadReducer';
import detailsDealReducer from './detailsDealReducer';
import detailsContactReducer from './detailsContactReducer';
import detailsCorporateReducer from './detailsCorporateReducer';
import leadReducers from './leadReducers';
import contactReducers from './contactReducers';
import interpriseReducers from './interpriseReducer';
import dealReducers from './dealReducers';
import listTaskReducers from './listTaskReducers';
import notificationsReducer from './notificationsReducer';
import activityReducer from './activityReducer';


const rootReducer = combineReducers({
  userReducer,
  businessReducer,
  filterReducer,
  detailsLeadReducer,
  detailsDealReducer,
  detailsContactReducer,
  detailsCorporateReducer,
  leadReducers,
  contactReducers,
  interpriseReducers,
  dealReducers,
  listTaskReducers,
  notificationsReducer,
  activityReducer,
});
// Exports
export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
