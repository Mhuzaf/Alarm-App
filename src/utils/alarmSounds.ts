
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
  
  // Fix: Add proper error handling and ensure audio plays
  audio.loop = true;
  
  // Try to play the audio with user interaction consideration
  const playPromise = audio.play();
  
  if (playPromise !== undefined) {
    playPromise.catch(error => {
      console.error("Error playing alarm sound:", error);
      // Create a dummy audio element and try again after user interaction
      const tempAudio = document.createElement('audio');
      tempAudio.src = sound.file;
      document.body.appendChild(tempAudio);
      
      // Try again with the new audio element
      tempAudio.play().catch(e => 
        console.error("Second attempt to play sound failed:", e)
      );
    });
  }
};

export const stopAlarmSound = (): void => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
    audio = null;
  }
  
  // Also stop any other audio elements that might be playing
  document.querySelectorAll('audio').forEach(el => {
    el.pause();
    el.currentTime = 0;
    if (el.parentNode) {
      el.parentNode.removeChild(el);
    }
  });
};
