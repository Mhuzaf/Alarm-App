
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

// Global audio elements storage
let audioElements: HTMLAudioElement[] = [];

export const playAlarmSound = (soundId: string = 'default'): void => {
  // Stop any currently playing sounds
  stopAlarmSound();
  
  const sound = alarmSounds.find(s => s.id === soundId) || alarmSounds[0];
  
  try {
    // Create multiple audio elements for redundancy
    // This helps overcome browser autoplay restrictions
    const audio1 = new Audio(sound.file);
    const audio2 = document.createElement('audio');
    audio2.src = sound.file;
    document.body.appendChild(audio2);
    
    audioElements = [audio1, audio2];
    
    // Configure audio elements
    audioElements.forEach(audio => {
      audio.loop = true;
      audio.volume = 1.0;
      
      // Attempt to play with different methods
      const playPromise = audio.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing alarm sound:", error);
          
          // Try again with user interaction in mind
          document.addEventListener('click', function playOnClick() {
            audio.play().catch(e => console.error("Even with interaction, play failed:", e));
            document.removeEventListener('click', playOnClick);
          }, { once: true });
        });
      }
      
      // Add success log to verify sound is playing
      audio.onplaying = () => console.log(`Sound ${soundId} is now playing`);
    });
  } catch (error) {
    console.error("Critical error in playAlarmSound:", error);
  }
};

export const stopAlarmSound = (): void => {
  try {
    // Stop and clean up all audio elements we created
    audioElements.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
      if (audio.parentNode) {
        audio.parentNode.removeChild(audio);
      }
    });
    
    // Clear the array
    audioElements = [];
    
    // Also clean up any stray audio elements
    document.querySelectorAll('audio').forEach(el => {
      el.pause();
      el.currentTime = 0;
      if (el.parentNode) {
        el.parentNode.removeChild(el);
      }
    });
  } catch (error) {
    console.error("Error stopping sounds:", error);
  }
};
