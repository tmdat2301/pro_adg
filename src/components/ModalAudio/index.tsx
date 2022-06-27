import React, { useEffect, useRef, useState } from 'react';
import { Platform, StyleSheet, TouchableOpacity, View } from 'react-native';
import Slider from '@react-native-community/slider';
import Sound from 'react-native-sound';
import { color, fontSize, padding } from '@helpers/index';
import AppText from '@components/AppText';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import Toast from 'react-native-toast-message';
import { useTranslation } from 'react-i18next';
import AppPlayer from './AppPlayer';

type compProps = {
  title?: string;
  urlAudio: string;
};

const AudioPlayer = (props: compProps) => {
  const { title, urlAudio } = props;
  const [isPlaying, setPlaying] = useState(true);
  const [durationTime, setDuration] = useState(0);
  const [currentTimeData, setCurrentTime] = useState(0);
  const sound = useRef<Sound | null>(null);
  const { t } = useTranslation();
  let sliderEditing = false;
  useEffect(() => {
    play();
    const timeout = setInterval(() => {
      if (sound.current && sound.current.isLoaded() && isPlaying && !sliderEditing) {
        sound.current.getCurrentTime((seconds, isPlaying) => {
          setCurrentTime(seconds);
        });
      }
    }, 100);
    return () => {
      if (sound.current !== null) {
        sound.current.release();
        sound.current = null;
      }
      if (timeout) {
        clearInterval(timeout);
      }
    };
  }, []);

  const onSliderEditStart = () => {
    sliderEditing = true;
  };
  const onSliderEditEnd = () => {
    sliderEditing = false;
  };
  const onSliderEditing = (value: number) => {
    if (sound.current != null) {
      sound.current.setCurrentTime(value);
      setCurrentTime(value);
    }
  };

  const play = async () => {
    if (sound.current != null) {
      sound.current?.play(playComplete);
      setPlaying(true);
    } else {
      const filepath = urlAudio;
      sound.current = new Sound(filepath, undefined, (error) => {
        if (error) {
          Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('error:audio_error') });
          setPlaying(false);
        } else {
          setPlaying(true);
          setDuration(sound.current?.getDuration() || 0);
          sound.current?.play(playComplete);
        }
      });
    }
  };

  const playComplete = (success: boolean) => {
    if (sound.current !== null) {
      if (success) {
      } else {
        Toast.show({ type: 'error', text1: t('lead:notice'), text2: t('error:audio_error') });
      }
      setPlaying(false);
      setCurrentTime(0);
      sound.current?.setCurrentTime(0);
    }
  };

  const pause = () => {
    setPlaying(false);
    if (sound.current !== null) {
      sound.current.pause();
    }
  };

  const jumpPrev10Seconds = () => {
    jumpSeconds(-10);
  };
  const jumpNext10Seconds = () => {
    jumpSeconds(10);
  };
  const jumpSeconds = (secsDelta: number) => {
    if (sound.current !== null) {
      sound.current?.getCurrentTime((secs: number, isPlaying) => {
        let nextSecs = secs + secsDelta;
        if (nextSecs < 0) {
          nextSecs = 0;
        } else if (nextSecs > durationTime) {
          nextSecs = durationTime;
        }
        sound.current?.setCurrentTime(nextSecs);
        setTimeout(() => {
          setCurrentTime(nextSecs);
        }, 100);
      });
    }
  };
  return (
    <View style={styles.playerMaxView}>
      <AppText fontWeight="bold" style={styles.trackTitle}>
        {title || ''}
      </AppText>
      <View style={styles.progrsBarSection}>
        <AppText style={{ color: color.subText, alignSelf: 'center' }}>
          {AppPlayer.secondsToHHMMSS(currentTimeData)}
        </AppText>
        <Slider
          onTouchStart={onSliderEditStart}
          onTouchEnd={onSliderEditEnd}
          onValueChange={onSliderEditing}
          value={currentTimeData}
          maximumValue={durationTime}
          maximumTrackTintColor={color.icon}
          minimumTrackTintColor={color.navyBlue}
          thumbTintColor={color.primary}
          style={{ flex: 1, alignSelf: 'center', marginHorizontal: Platform.select({ ios: 5 }) }}
        />
        <AppText style={{ color: color.subText, alignSelf: 'center' }}>
          {AppPlayer.secondsToHHMMSS(durationTime)}
        </AppText>
      </View>
      <View style={styles.buttonsSection}>
        <View style={[styles.buttonsCol, { alignItems: 'flex-end' }]}>
          <TouchableOpacity onPress={jumpPrev10Seconds}>
            <Icon type="feather" name="rotate-ccw" color={color.navyBlue} size={32} />
          </TouchableOpacity>
        </View>

        <View style={styles.buttonsCol}>
          {isPlaying ? (
            <TouchableOpacity
              hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
              onPress={() => pause()}
              style={styles.playPauseButton}>
              <Icon type="font-awesome" name="pause" color={color.white} size={24} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              hitSlop={{ top: 8, left: 8, bottom: 8, right: 8 }}
              onPress={() => play()}
              style={styles.playPauseButton}>
              <Icon style={{ marginLeft: 6 }} type="font-awesome" name="play" color={color.white} size={24} />
            </TouchableOpacity>
          )}
        </View>
        <View style={[styles.buttonsCol, { alignItems: 'flex-start' }]}>
          <TouchableOpacity onPress={jumpNext10Seconds}>
            <Icon type="feather" name="rotate-cw" color={color.navyBlue} size={32} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  playerMaxView: {
    height: 160,
    paddingHorizontal: padding.p16, 
    justifyContent: 'space-between',
  },
  topSection: {
    flex: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 10,
  },
  progrsBarSection: {
    alignItems: 'center',
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  buttonsSection: {
    paddingTop: 8,
    flexDirection: 'row',
    paddingBottom: 20,
  },
  buttonsCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 10,
  },
  playPauseButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.primary900,
    width: 50,
    height: 50,
    borderRadius: 25,
  },

  trackArtBox: {
    flex: 2,
    display: 'flex',
  },
  trackArt: {
    borderWidth: 2,
  },
  trackDesc: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackTitle: {
    fontSize: fontSize.f16,
    color: color.text,
    textAlign: 'center',
    paddingTop: 8,
  },
  trackSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#3d3d5c',
  },
});
export default AudioPlayer;
