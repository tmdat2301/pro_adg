import ModalDate from '@components/ModalDate';
import ModalSelect from '@components/ModalSelect';
import { FieldType } from '@helpers/constants';
import dayjs from 'dayjs';
import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modalize } from 'react-native-modalize';
import FilterBottomSheet from './FilterBottomSheet';
// import { dataSelect } from '..';
export interface ModalPayment {
    bottomSheetModalRef: any;
    typeModal: 'DateFrom' | 'DateTo' | 'TypeFilter' | undefined;
    setModalType: any;
}

export default (props: ModalPayment) => {
    const { bottomSheetModalRef, typeModal, setModalType } = props;
    const formikRef = useFormikContext<any>();
    const { t } = useTranslation();
    useEffect(() => {
        if (typeModal == 'DateTo') {
            bottomSheetModalRef.current?.open();
        }
    }, [typeModal]);

    const handleChangeDateFrom = (data: any) => {
        formikRef?.setFieldValue('startTime', data);
        formikRef.submitForm();
        bottomSheetModalRef.current?.close();
        setModalType('DateTo');
    };

    const handleChangeDateTo = (data: any) => {
        formikRef?.setFieldValue('endTime', data);
        formikRef.submitForm();
        bottomSheetModalRef.current?.close();
    };
    return (
        <Modalize
            adjustToContentHeight
            withHandle={false}
            ref={bottomSheetModalRef}
            onOverlayPress={() => bottomSheetModalRef.current?.close()}>
            {typeModal == 'TypeFilter' && (
                <FilterBottomSheet
                    onPress={(id: any) => {
                        formikRef.setFieldValue('type', id);
                        formikRef.submitForm();
                        bottomSheetModalRef.current?.close();
                    }}
                />
            )}
            {typeModal == 'DateFrom' && (
                <ModalDate
                    date={dayjs(formikRef?.values?.startTime || undefined).toDate() ?? new Date()}
                    handleCancel={() => bottomSheetModalRef.current?.close()}
                    handleConfirm={(data) => handleChangeDateFrom(data)}
                    titleCalendar={t('title:dateFrom')}
                    mode="date"
                    maximumDate={formikRef?.values?.endTime}
                />
            )}
            {typeModal == 'DateTo' && (
                <ModalDate
                    date={dayjs(formikRef?.values?.endTime).toDate() ?? new Date()}
                    handleCancel={() => bottomSheetModalRef.current?.close()}
                    handleConfirm={(data) => handleChangeDateTo(data)}
                    titleCalendar={t('title:dateTo')}
                    mode="date"
                    minimumDate={formikRef?.values?.startTime}
                />
            )}
        </Modalize>
    );
};
