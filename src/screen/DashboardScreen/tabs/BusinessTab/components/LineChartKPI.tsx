import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Dimensions } from 'react-native';
import { DataChart, KPIModel } from '@interfaces/dashboard.interface';
import { isIOS, ScreenWidth } from 'react-native-elements/dist/helpers';
import AppText from '@components/AppText';
import { MyIcon } from '@components/Icon';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Circle, Line, Rect, Text, Path, Pattern } from 'react-native-svg';
import { fontSize, padding, color, responsivePixel } from '@helpers/index';
import { useTranslation } from 'react-i18next';
import { convertCurrency, convertMillion } from '@helpers/untils';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { Tooltip } from 'react-native-elements/dist/tooltip/Tooltip';
import { useSelector } from 'react-redux';
import { RootState } from '@redux/reducers';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export interface LineChartProps {
  onSelectCategory: () => void;
}
const LineChartKPI = (props: LineChartProps) => {
  const { onSelectCategory } = props;
  const { filterBusiness } = useSelector((state: RootState) => state.filterReducer);
  const { arrPreviousPeriod, arrThisPeriod, objKPIOverview } = useSelector((state: RootState) => state.businessReducer);
  const { t } = useTranslation();
  useEffect(() => {
    setTooltipPos({
      x: 0,
      y: 0,
      visible: false,
      index: 0,
    });
  }, [filterBusiness.FilterTimeType, filterBusiness.startDate, filterBusiness.endDate]);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0, visible: false, index: 0 });

  const arrX: string[] = [];
  const arrYB = [];
  const arrYC = [];
  const arrLimit: number[] = [];
  const arrShow: number[] = [];
  const arrHide: number[] = [];
  for (let i = 0; i < arrThisPeriod.length; i++) {
    if (!arrX.some((x) => x === arrThisPeriod[i].x)) {
      arrX.push(arrThisPeriod[i].x.toString());
    }
    arrYC.push(arrThisPeriod[i].y);
    arrLimit.push(i);
    arrHide.push(i);
  }
  arrShow.push(arrLimit[0]);
  if (arrThisPeriod.length > 1) {
    arrShow.push(arrLimit[arrThisPeriod.length - 1]);
    if (filterBusiness && filterBusiness.FilterTimeType) {
      const index = Math.round((arrLimit[arrThisPeriod.length - 1] - arrLimit[0]) / 2);
      switch (filterBusiness.FilterTimeType) {
        case 1:
          break;
        case 3:
          arrShow.push(arrLimit[index]);
          break;
        case 99:
          arrShow.push(arrLimit[index]);
          break;
        case 2:
          for (let q = 0; q < arrLimit.length; q++) {
            const element = arrLimit[q];
            if (!arrShow.some((x) => x === element)) {
              arrShow.push(element);
            }
          }
          break;
        case 4:
          for (let q = 0; q < arrLimit.length; q++) {
            const element = arrLimit[q];
            if (!arrShow.some((x) => x === element)) {
              arrShow.push(element);
            }
          }
          break;
        case 5:
          break;
        default:
          arrShow.push(arrLimit[index]);
          break;
      }
    }
  }

  for (let j = 0; j < arrPreviousPeriod.length; j++) {
    if (!arrX.some((x) => x === arrPreviousPeriod[j].x)) {
      arrX.push(arrPreviousPeriod[j].x);
    }
    arrYB.push(arrPreviousPeriod[j].y);
  }

  arrShow.forEach((element) => {
    const index = arrHide.findIndex((x) => x === element);
    if (index > -1) {
      arrHide.splice(index, 1);
    }
  });

  const getXLabel = (xValue: string) => {
    try {
      let label = '';
      const index = arrX.findIndex((x) => x.toString() === xValue);
      if (index > -1 && arrHide.findIndex((x) => x === index) > -1) {
        label = '';
      } else {
        if (xValue) {
          if (xValue.includes('Tuần ')) {
            label = xValue.replace('Tuần ', 'T');
          } else if (xValue.includes('Thg')) {
            label = xValue.replace('Thg ', 'T');
          } else {
            label = xValue ? xValue : '';
          }
          if (xValue.includes(', ')) {
            const index = label.indexOf(', ');
            label = label.substring(0, index);
          } else {
            label = xValue ? xValue : '';
          }
        }
      }
      return label;
    } catch (error) {
      return '';
    }
  };

  return (
    <View
      onTouchStart={
        tooltipPos.visible === true
          ? () =>
            setTooltipPos({
              x: 0,
              y: 0,
              visible: false,
              index: 0,
            })
          : undefined
      }>
      <View style={styles.viewRow}>
        <View style={styles.row}>
          <AppText
            value={t('business:main_kpi').toString()}
            fontWeight={'semibold'}
            fontSize={fontSize.f16}
            style={styles.mr8}
            color={color.black}
          />
          <Tooltip
            popover={
              <AppText style={{ color: color.white, fontSize: fontSize.f12 }}>{t('business:tooltip_kip')}</AppText>
            }
            overlayColor={'transparent'}
            height={60}
            containerStyle={{
              position: 'absolute',
              top: isIOS ? responsivePixel(110) : responsivePixel(80),
            }}
            backgroundColor={color.midnight}>
            <View style={{ marginLeft: padding.p4 }}>
              <MyIcon.Info />
            </View>
          </Tooltip>
        </View>

        <AppText
          value={convertMillion(objKPIOverview.currentPeriodValue)}
          fontWeight={'bold'}
          fontSize={fontSize.f16}
          color={color.black}
        />
      </View>

      <View style={styles.viewRow}>
        <TouchableOpacity onPress={onSelectCategory} activeOpacity={0.8} style={styles.row}>
          <AppText
            style={styles.mr8}
            value={t('business:revenue').toString()}
            color={color.primary}
            fontSize={fontSize.f14}
          />
          <MyIcon.DropDown color={color.primary} />
        </TouchableOpacity>

        <View style={styles.row}>
          {objKPIOverview.decrease ? (
            <Icon color={color.red} name="arrowdown" type={'antdesign'} size={padding.p10} />
          ) : (
            <Icon color={color.green900} name="arrowup" type={'antdesign'} size={padding.p10} />
          )}

          {/* <MyIcon.ArrowUp fill={color.green900} /> */}
          <AppText
            value={`${objKPIOverview.grownthPercentAbsolute}%`}
            style={styles.ml4}
            color={objKPIOverview.decrease ? color.red : color.green900}
            fontSize={fontSize.f12}
          />
        </View>
      </View>

      {objKPIOverview.hasKPIPlan ? (
        <View style={styles.planRow}>
          <View style={styles.planTextView}>
            <AppText
              value={`${t('business:percent_completed_plan')}: ${objKPIOverview.completionPercent}%`}
              fontSize={fontSize.f12}
              color={color.primary}
            />
          </View>
          {objKPIOverview.completionPercent === 0 ? <MyIcon.Warning fill={color.yellow} /> : null}
        </View>
      ) : null}

      <LineChart
        decorator={() => {
          if (tooltipPos.visible) {
            return (
              <Svg>
                <Line
                  strokeDasharray={[2, 3, 3]}
                  strokeWidth={0.5}
                  stroke={color.primary}
                  x1={0}
                  y1={0}
                  x2={0}
                  y2={ScreenWidth * 0.388}
                  x={tooltipPos.x}
                  y={10}
                />
                <Rect
                  x={tooltipPos.x / 2}
                  y={tooltipPos.y}
                  rx={4}
                  ry={4}
                  width={ScreenWidth * 0.44}
                  height={ScreenWidth * 0.16}
                  fill={color.midnight}
                />

                {/* <Text
                  x={ScreenWidth * 0.0428 + tooltipPos.x / 2}
                  y={ScreenWidth * 0.04 + tooltipPos.y}
                  fill="white"
                  fontSize={`${fontSize.f12}`}
                  fontWeight={'400'}
                  textAnchor="start">
                  {arrX[tooltipPos.index]}
                </Text> */}

                <Pattern width={ScreenWidth * 0.48} height={ScreenWidth * 0.28}>
                  <Path
                    d="M 0 0 L 12 0 L 7 12 z"
                    fill={color.midnight}
                    stroke={color.midnight}
                    strokeWidth={1}
                    x={tooltipPos.x - ScreenWidth * 0.016}
                    y={tooltipPos.y + ScreenWidth * 0.16}
                  />
                </Pattern>

                <Circle
                  x={ScreenWidth * 0.0214 + tooltipPos.x / 2}
                  y={ScreenWidth * 0.06 + tooltipPos.y}
                  r="4"
                  fill={color.green900}
                />
                <Text
                  x={ScreenWidth * 0.0428 + tooltipPos.x / 2}
                  y={ScreenWidth * 0.07 + tooltipPos.y}
                  fill="white"
                  fontSize={`${fontSize.f12}`}
                  fontWeight={'400'}
                  textAnchor="start">
                  {t('business:period_this')}
                </Text>
                <Text
                  x={ScreenWidth * 0.444 - 8 + tooltipPos.x / 2}
                  y={ScreenWidth * 0.071 + tooltipPos.y}
                  fill="white"
                  fontSize={`${fontSize.f12}`}
                  fontWeight={'400'}
                  textAnchor="end">
                  {arrThisPeriod[tooltipPos.index] ? convertCurrency(arrThisPeriod[tooltipPos.index].y) : 0}
                </Text>

                <Circle
                  x={ScreenWidth * 0.0214 + tooltipPos.x / 2}
                  y={ScreenWidth * 0.11 + tooltipPos.y}
                  r="4"
                  fill={color.yellow}
                />
                <Text
                  x={ScreenWidth * 0.0428 + tooltipPos.x / 2}
                  y={ScreenWidth * 0.12 + tooltipPos.y}
                  fill="white"
                  fontSize={`${fontSize.f12}`}
                  fontWeight={'400'}
                  textAnchor="start">
                  {t('business:period_pre')}
                </Text>
                <Text
                  x={ScreenWidth * 0.444 - 8 + tooltipPos.x / 2}
                  y={ScreenWidth * 0.12 + tooltipPos.y}
                  fill="white"
                  fontSize={`${fontSize.f12}`}
                  fontWeight={'400'}
                  textAnchor="end">
                  {arrPreviousPeriod[tooltipPos.index] ? convertCurrency(arrPreviousPeriod[tooltipPos.index].y) : 0}
                </Text>
              </Svg>
            );
          }
          return null;
        }}
        data={{
          labels: arrX,
          datasets: [
            {
              data: arrYC,
              strokeWidth: 2,
              color: (opacity) => color.green900,
            },
            {
              data: arrYB,
              strokeWidth: 2,
              color: (opacity) => color.yellow,
            },
          ],
        }}
        onDataPointClick={(data) => {
          if (tooltipPos.index === data.index) {
            setTooltipPos({
              index: 0,
              x: 0,
              y: 0,
              visible: false,
            });
            return;
          }
          setTooltipPos({
            index: data.index,
            x: data.x,
            y: data.y > ScreenWidth * 0.2 ? data.y - ScreenWidth * 0.22599 : data.y,
            visible: true,
          });
        }}
        withShadow={false}
        withDots={true}
        withOuterLines={true}
        withHorizontalLines={true}
        withVerticalLines={false}
        width={Dimensions.get('window').width - 32}
        height={ScreenWidth / 2}
        yAxisInterval={1}
        chartConfig={{
          backgroundColor: 'transparent',
          backgroundGradientFrom: color.white,
          backgroundGradientTo: color.white,
          decimalPlaces: 1,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          propsForDots: {
            r: '0',
            strokeWidth: '0',
          },
          propsForBackgroundLines: {
            stroke: color.grayLine,
            strokeWidth: 2,
            strokeDasharray: [0],
            x: -16,
          },
          propsForHorizontalLabels: {
            textAnchor: 'start',
            alignmentBaseline: 'middle',
            dx: -40,
            fill: color.black,
          },
          propsForVerticalLabels: {
            textAnchor: 'middle',
            alignmentBaseline: 'middle',
            fill: color.black,
          },
        }}
        style={styles.chart}
        segments={4}
        formatXLabel={(xvalue) => getXLabel(xvalue.toString())}
        formatYLabel={(yValue) => convertMillion(Number(yValue), ' ')}
        fromZero
      />

      <View style={styles.chartNote}>
        <View style={styles.row}>
          <View style={styles.noteIcon}>
            <View style={styles.lineNoteGreen} />
            <View style={styles.circleGreen} />
            <View style={styles.lineNoteGreen} />
          </View>
          <AppText value={t('business:period_this').toString()} fontSize={fontSize.f12} />
        </View>

        <View style={styles.row}>
          <View style={styles.noteIcon}>
            <View style={styles.lineNoteYellow} />
            <View style={styles.circleYellow} />
            <View style={styles.lineNoteYellow} />
          </View>
          <AppText value={t('business:period_pre').toString()} fontSize={fontSize.f12} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.white,
    paddingHorizontal: padding.p8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: padding.p8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  planRow: {
    flexDirection: 'row',
    paddingHorizontal: padding.p8,
    alignItems: 'center',
    marginVertical: padding.p4,
  },
  planTextView: {
    backgroundColor: color.blizzardBlue,
    borderRadius: 4,
    marginRight: padding.p8,
  },
  mr8: {
    marginRight: padding.p8,
  },
  ml4: {
    marginLeft: padding.p4,
  },
  chartNote: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: padding.p8,
  },
  lineNoteGreen: {
    height: 2,
    width: 6,
    borderRadius: 4,
    backgroundColor: color.green900,
  },
  lineNoteYellow: {
    height: 2,
    width: 6,
    borderRadius: 4,
    backgroundColor: color.yellow,
  },
  circleGreen: {
    height: 4,
    width: 4,
    borderRadius: 4,
    backgroundColor: color.green900,
  },
  circleYellow: {
    height: 4,
    width: 4,
    borderRadius: 4,
    backgroundColor: color.yellow,
  },
  noteIcon: {
    width: 16,
    marginRight: padding.p4,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chart: {
    alignItems: 'center',
  },
});

export default LineChartKPI;
