import AppField, { AppFieldI } from '@components/Input/MultiInput/AppField';
import { FieldType } from '@helpers/constants';
import { PipeLineStatusDeal } from '@interfaces/deal.interface';
import { DataResult } from '@interfaces/profile.interface';
import { ResponseReturnArray } from '@interfaces/response.interface';
import { apiGet } from '@services/serviceHandle';
import serviceUrls from '@services/serviceUrls';
import React, { memo, useEffect, useState } from 'react';

interface ModalFailReasonProps extends AppFieldI {
  idPipeline?: number;
}

export default (props: ModalFailReasonProps) => {
  const { idPipeline, ...restProps } = props;
  const [options, setOptions] = useState<DataResult[]>([]);
 
  useEffect(() => {
    const getListPipelineDetails = async (id: number) => {
      try {
        const response: ResponseReturnArray<PipeLineStatusDeal[]> = await apiGet(
          `${serviceUrls.path.getStatus}${id}`,
          {},
        );
        if (response.error) {
          return;
        }
        if (response.response && response.response.length > 0) {
          setOptions(response.response.map((item) => ({ ...item, email: null })));
        }
      } catch (error) {}
    };
    if (idPipeline) {
      getListPipelineDetails(idPipeline);
    }
  }, [idPipeline]);

  return (
    <AppField
      disabled={!idPipeline}
      keyShow="value"
      dataSelect={options}
      typeSelect={FieldType.Choice}
      {...restProps}
    />
  );
};
