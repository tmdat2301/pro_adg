import * as businessActions from '@redux/actions/businessActions';
import { RootState } from '@redux/reducers';
import SwiperView from '@screen/DashboardScreen/components/SwiperView';
import React, { FC, useEffect } from 'react';
import { RefreshControl } from 'react-native';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { useDispatch, useSelector } from 'react-redux';
import DealStaffRank from './components/DealStaffRank';
import DealSummary from './components/DealSummary';
import LeadSummary from './components/LeadSummary';
import LineChartKPI from './components/LineChartKPI';
import styles from './styles';
export interface BusinessTabProps {
  swiperHeight: number;
  onSelectCategory: () => void;
  handleShowModalValues: () => void;
}

const BusinessTab: FC<BusinessTabProps> = React.memo((props) => {
  const { swiperHeight, onSelectCategory, handleShowModalValues } = props;
  const dispatch = useDispatch();
  const filterReducer = useSelector((state: RootState) => state.filterReducer);
  const businessReducer = useSelector((state: RootState) => state.businessReducer);

  useEffect(() => {
    if (filterReducer.filterBusiness.organizationUnitId) {
      getBusinessData();
    }
  }, [
    filterReducer.filterBusiness.organizationUnitId,
    filterReducer.filterBusiness.startDate,
    filterReducer.filterBusiness.endDate,
  ]);

  const getBusinessData = () => {
    dispatch(businessActions.setRefreshing(true));
    //staff-rank
    dispatch(businessActions.staffRankRequest(filterReducer.filterBusiness));
    //kpi-overview
    dispatch(businessActions.kpiOverviewRequest(filterReducer.filterBusiness));
    //lead-summary
    dispatch(businessActions.leadSummaryRequest(filterReducer.filterBusiness));
    //deal-summary
    dispatch(businessActions.dealSummaryRequest(filterReducer.filterBusiness));
  };

  return (
    <ScrollView
      scrollEventThrottle={200}
      directionalLockEnabled={true}
      nestedScrollEnabled
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={businessReducer.isRefreshing} onRefresh={getBusinessData} />}
      style={[styles.tabContainer, { height: swiperHeight }]}>
      <SwiperView
        firstComponent={<LineChartKPI onSelectCategory={onSelectCategory} />}
        secondComponent={<DealStaffRank arrRankStaff={businessReducer.arrRank} onShowModal={handleShowModalValues} />}
      />
      <View style={styles.viewFooter}>
        <LeadSummary data={businessReducer.objLeadSummary} />
        <DealSummary data={businessReducer.objDealSummary} />
      </View>
    </ScrollView>
  );
});

export default BusinessTab;
