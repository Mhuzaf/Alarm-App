
export interface AlarmSound {
  id: string;
  name: string;
  file: string;
}

export const alarmSounds: AlarmSound[] = [
  {
    id: 'default',
    name: 'Default',
    file: '/sounds/alarm-clock.mp3',
  },
  {
    id: 'digital',
    name: 'Digital',
    file: '/sounds/digital-alarm.mp3',
  },
  {
    id: 'bell',
    name: 'Bell',
    file: '/sounds/bell-alarm.mp3',
  },
  {
    id: 'chime',
    name: 'Chime',
    file: '/sounds/chime-alarm.mp3',
  },
];

let audio: HTMLAudioElement | null = null;

export const playAlarmSound = (soundId: string = 'default'): void => {
  stopAlarmSound();
  
  const sound = alarmSounds.find(s => s.id === soundId) || alarmSounds[0];
  audio = new Audio(sound.file);
  audio.loop = true;
  audio.play().catch(error => {
    console.error("Error playing alarm sound:", error);
  });
};

export const stopAlarmSound = (): void => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
};
