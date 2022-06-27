import { ModalizeDetailsType } from '@helpers/constants';
import { RootState } from '@redux/reducers';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { ItemOptions } from '@components/Item/Details/index';

export interface IActivityBottomSheetProps {
  type: ModalizeDetailsType;
  onPress: (id: number) => void;
}

const ActivityBottomSheet = (props: IActivityBottomSheetProps) => {
  const { type, onPress } = props;
  const { t } = useTranslation();
  const { arrTypeActivity } = useSelector((state: RootState) => state.filterReducer);
  const arrFilter = arrTypeActivity.concat({ icon: '', id: -99, name: t('lead:all_activity'), order: -99 });
  arrFilter.sort((a, b) => {
    return a.id - b.id;
  });
  if (type === ModalizeDetailsType.filter) {
    return (
      <>
        {arrFilter.map((v, i) => {
          return (
            <ItemOptions
              key={v.id}
              value={v.name}
              onPress={() => {
                onPress(v.id);
              }}
            />
          );
        })}
      </>
    );
  }
  return null;
};

export default ActivityBottomSheet;
