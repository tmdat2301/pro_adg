import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ItemOptions } from '@components/Item/Details/index';
import serviceUrls from '@services/serviceUrls';
import { ItemResultMission } from '@interfaces/lead.interface';
import { ResponseReturn } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import { ModalizeDetailsType } from '@helpers/constants';
export interface IMissionBottomSheetProps {
  onPress: (id: number) => void;
  type: ModalizeDetailsType;
}

const AppointmentBottomSheet = (props: IMissionBottomSheetProps) => {
  const { t } = useTranslation();
  const { type, onPress } = props;
  const [arrResult, setArrResult] = useState<ItemResultMission[]>([]);
  const getResultMission = async () => {
    try {
      const url = serviceUrls.path.resultMisison;
      const response: ResponseReturn<ItemResultMission[]> = await apiGet(url, {});
      if (response.error) {
        return;
      }
      if (response.response && response.response.data) {
        setArrResult(response.response.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    if (arrResult.length === 0) {
      getResultMission();
    }
  });
  const arrFilter = [
    {
      id: -99,
      name: t('lead:all_status'),
      isCompleted: null,
      isExpired: null,
    },
    {
      id: 2,
      name: t('lead:incomplete'),
      isCompleted: false,
      isExpired: null,
    },
    {
      id: 1,
      name: t('lead:complete_in'),
      isCompleted: true,
      isExpired: true,
    },
    {
      id: 3,
      name: t('lead:complete_out'),
      isCompleted: true,
      isExpired: false,
    },
  ];
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
  return (
    <>
      {arrResult.map((v, i) => {
        return (
          <ItemOptions
            key={v.label}
            value={v.value}
            onPress={() => {
              onPress(v.label);
            }}
          />
        );
      })}
    </>
  );
};

export default AppointmentBottomSheet;
