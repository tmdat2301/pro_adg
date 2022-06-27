import { DATE_FORMAT_EN } from "@helpers/constants";
import dayjs from "dayjs";
import { i18n } from "src/context/locales";
import { store } from "store";

// const filterReducer = useSelector((state: RootState) => state.filterReducer);
const filterReducer = store.getState().filterReducer;

// const { t } = useTranslation();
const today = new Date();
const last30Days = new Date(today);
last30Days.setDate(last30Days.getDate() - 30);

const startMonth = dayjs().startOf('month').toDate();
const endMonth = dayjs().endOf('month').toDate();

const startLastMonth = dayjs(last30Days).startOf('month').toDate();
const endLastMonth = dayjs(last30Days).endOf('month').toDate();

const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 30);

const sevenDaysAgo = new Date();



const startWeek = dayjs().startOf('week').toDate();
const endWeek = dayjs().endOf('week').toDate();

sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

const startLastWeek = dayjs(sevenDaysAgo).startOf('week').toDate();
const endLastWeek = dayjs(sevenDaysAgo).endOf('week').toDate();



const startQui1 = dayjs(today).startOf('year').toDate();
const qui1 = new Date(startQui1);
const endQui1 = dayjs(qui1.setMonth(qui1.getMonth() + 2))
    .endOf('month')
    .toDate();

const startQui2 = new Date(endQui1);
startQui2.setDate(startQui2.getDate() + 1);
const qui2 = new Date(startQui2);
const endQui2 = dayjs(qui2.setMonth(qui2.getMonth() + 2))
    .endOf('month')
    .toDate();

const startQui3 = new Date(endQui2);
startQui3.setDate(startQui3.getDate() + 1);
const qui3 = new Date(startQui3);
const endQui3 = dayjs(qui3.setMonth(qui3.getMonth() + 2))
    .endOf('month')
    .toDate();

const startQui4 = new Date(endQui3);
startQui4.setDate(startQui4.getDate() + 1);
const qui4 = new Date(startQui4);
const endQui4 = dayjs(qui4.setMonth(qui4.getMonth() + 2))
    .endOf('month')
    .toDate();

export default {
    dataMonth: [
        { id: 1, label: i18n.t('business:30DaysAgo'), valueStart: last30Days, valueEnd: today, type: 3 },
        { id: 2, label: i18n.t('business:thisMonth'), valueStart: startMonth, valueEnd: endMonth, type: 3 },
        { id: 3, label: i18n.t('business:lastMonth'), valueStart: startLastMonth, valueEnd: endLastMonth, type: 3 },
    ],


    dataDay: [
        { id: 1, label: i18n.t('business:today'), value: today, type: 1 },
        { id: 2, label: i18n.t('business:yesterday'), value: yesterday, type: 1 },
        { id: 3, label: i18n.t('business:option'), value: dayjs(filterReducer.filterBusiness.endDate).format(DATE_FORMAT_EN) || dayjs(new Date()).format(DATE_FORMAT_EN), type: 1 },
    ],

    dataOther: [
        {
            id: 1,
            label: i18n.t('business:startDate'),
            value: dayjs(filterReducer.filterBusiness.startDate).format(DATE_FORMAT_EN) || dayjs(sevenDaysAgo).format(DATE_FORMAT_EN),
            type: 99,
            isStart: true,
        },
        {
            id: 2,
            label: i18n.t('business:endDate'),
            value: dayjs(filterReducer.filterBusiness.endDate).format(DATE_FORMAT_EN) || dayjs(new Date()).format(DATE_FORMAT_EN),
            type: 99,
            isStart: false,
        },
    ],
    dataWeek: [
        { id: 1, label: i18n.t('business:sevenDaysAgo'), valueStart: sevenDaysAgo, valueEnd: today, type: 2 },
        { id: 2, label: i18n.t('business:thisWeek'), valueStart: startWeek, valueEnd: endWeek, type: 2 },
        { id: 3, label: i18n.t('business:lastWeek'), valueStart: startLastWeek, valueEnd: endLastWeek, type: 2 },
        {
            id: 4,
            label: i18n.t('business:option'),
            valueStart: dayjs(filterReducer.filterBusiness.startDate).format(DATE_FORMAT_EN) || dayjs(sevenDaysAgo).format(DATE_FORMAT_EN),
            valueEnd: dayjs(filterReducer.filterBusiness.endDate).format(DATE_FORMAT_EN) || dayjs(new Date()).format(DATE_FORMAT_EN),
            type: 2,
        },
    ],
    dataQuarter: [
        { id: 1, label: i18n.t('business:quarter', { value: 'I' }), valueStart: startQui1, valueEnd: endQui1, type: 4 },
        { id: 2, label: i18n.t('business:quarter', { value: 'II' }), valueStart: startQui2, valueEnd: endQui2, type: 4 },
        { id: 3, label: i18n.t('business:quarter', { value: 'III' }), valueStart: startQui3, valueEnd: endQui3, type: 4 },
        { id: 4, label: i18n.t('business:quarter', { value: 'IV' }), valueStart: startQui4, valueEnd: endQui4, type: 4 },
    ],
}