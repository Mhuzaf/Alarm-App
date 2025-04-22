
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
  {
    id: 'gentle',
    name: 'Gentle Wake',
    file: '/sounds/gentle-alarm.mp3',
  },
  {
    id: 'nature',
    name: 'Nature',
    file: '/sounds/nature-alarm.mp3',
  },
  {
    id: 'beep',
    name: 'Classic Beep',
    file: '/sounds/beep-alarm.mp3',
  },
  {
    id: 'marimba',
    name: 'Marimba',
    file: '/sounds/marimba-alarm.mp3',
  }
];

// Global audio storage
let activeAudio: HTMLAudioElement | null = null;

// Create an effective beep sound as fallback when audio files are unavailable
const createBeepSound = (): HTMLAudioElement => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 300);
    
    // Create a dummy audio element to maintain compatibility with the existing interface
    const dummyAudio = new Audio();
    dummyAudio.volume = 1.0;
    
    return dummyAudio;
  } catch (error) {
    console.error("Error creating beep sound:", error);
    return new Audio();
  }
};

export const playSound = (soundFile: string, loop: boolean = false): Promise<HTMLAudioElement> => {
  return new Promise((resolve, reject) => {
    stopAlarmSound(); // Stop any currently playing sound
    
    // Try with standard Audio API first
    const audio = new Audio(soundFile);
    audio.loop = loop;
    audio.volume = 1.0;
    
    // Set up event listeners
    audio.addEventListener('canplaythrough', () => {
      audio.play()
        .then(() => {
          activeAudio = audio;
          console.log(`Sound ${soundFile} is now playing`);
          resolve(audio);
        })
        .catch(err => {
          console.error("Error playing sound:", err);
          
          // Create a beep sound as fallback
          const beepAudio = createBeepSound();
          activeAudio = beepAudio;
          resolve(beepAudio);
        });
    }, { once: true });
    
    audio.addEventListener('error', (err) => {
      console.error("Error loading sound:", err);
      
      // Try with embedded audio element as backup
      const audioElement = document.createElement('audio');
      audioElement.src = soundFile;
      audioElement.loop = loop;
      audioElement.volume = 1.0;
      document.body.appendChild(audioElement);
      
      audioElement.play()
        .then(() => {
          activeAudio = audioElement;
          console.log(`Sound ${soundFile} is now playing (backup method)`);
          resolve(audioElement);
        })
        .catch(() => {
          // Final fallback: create a beep sound
          console.warn("All audio methods failed, using beep fallback");
          const beepAudio = createBeepSound();
          activeAudio = beepAudio;
          resolve(beepAudio);
        });
    }, { once: true });
    
    // Initiate loading
    audio.load();
  });
};

export const playAlarmSound = (soundId: string = 'default'): void => {
  const sound = alarmSounds.find(s => s.id === soundId) || alarmSounds[0];
  
  // Play with looping enabled
  playSound(sound.file, true)
    .catch(error => {
      console.error("Critical error in playAlarmSound:", error);
      // Last resort fallback
      createBeepSound();
    });
};

export const previewAlarmSound = (soundId: string = 'default'): void => {
  const sound = alarmSounds.find(s => s.id === soundId) || alarmSounds[0];
  
  // Play once without looping for preview
  playSound(sound.file, false)
    .catch(error => {
      console.error("Error in previewAlarmSound:", error);
      createBeepSound();
    });
};

export const stopAlarmSound = (): void => {
  try {
    if (activeAudio) {
      activeAudio.pause();
      activeAudio.currentTime = 0;
      
      // Remove from DOM if it was appended
      if (activeAudio.parentNode) {
        activeAudio.parentNode.removeChild(activeAudio);
      }
      
      activeAudio = null;
    }
    
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
