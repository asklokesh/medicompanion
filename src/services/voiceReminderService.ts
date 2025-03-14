
export interface VoiceOptions {
  rate?: number; // 0.1 to 10
  pitch?: number; // 0 to 2
  volume?: number; // 0 to 1
  voice?: SpeechSynthesisVoice | null;
}

class VoiceReminderService {
  private static instance: VoiceReminderService;
  private synth: SpeechSynthesis;
  private isSpeaking: boolean = false;
  private enabled: boolean = false;
  private options: VoiceOptions = {
    rate: 1,
    pitch: 1,
    volume: 1,
    voice: null
  };
  private timeOfDayGreeted: {
    morning: boolean;
    evening: boolean;
  } = {
    morning: false,
    evening: false,
  };

  private constructor() {
    this.synth = window.speechSynthesis;
    this.loadSettings();
    
    // Initialize voice
    if (this.synth) {
      // Wait for voices to be loaded
      if (this.synth.getVoices().length === 0) {
        window.speechSynthesis.addEventListener('voiceschanged', () => {
          this.initializeVoice();
        });
      } else {
        this.initializeVoice();
      }
    }

    // Reset the time-of-day greeting flags at midnight
    this.setupDailyReset();
  }

  private setupDailyReset(): void {
    const resetGreetings = () => {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      
      const timeUntilMidnight = midnight.getTime() - now.getTime();
      
      setTimeout(() => {
        this.timeOfDayGreeted = {
          morning: false,
          evening: false
        };
        // Set up the next day's reset
        resetGreetings();
      }, timeUntilMidnight);
    };
    
    resetGreetings();
  }

  private initializeVoice(): void {
    const voices = this.synth.getVoices();
    // Try to find a friendly voice (prefer female voices for medication reminders)
    const preferredVoice = voices.find(voice => 
      voice.name.includes('female') || 
      voice.name.includes('Samantha') || 
      voice.name.includes('Google UK English Female') ||
      voice.name.includes('Microsoft Zira')
    );
    
    this.options.voice = preferredVoice || null;
  }

  private loadSettings(): void {
    try {
      const savedSettings = localStorage.getItem('voiceReminderSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        this.enabled = settings.enabled ?? false;
        this.options.rate = settings.rate ?? 1;
        this.options.pitch = settings.pitch ?? 1;
        this.options.volume = settings.volume ?? 1;
      }
    } catch (error) {
      console.error('Error loading voice reminder settings:', error);
    }
  }

  private saveSettings(): void {
    try {
      const settings = {
        enabled: this.enabled,
        rate: this.options.rate,
        pitch: this.options.pitch,
        volume: this.options.volume
      };
      localStorage.setItem('voiceReminderSettings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving voice reminder settings:', error);
    }
  }

  public static getInstance(): VoiceReminderService {
    if (!VoiceReminderService.instance) {
      VoiceReminderService.instance = new VoiceReminderService();
    }
    return VoiceReminderService.instance;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggleEnabled(): boolean {
    this.enabled = !this.enabled;
    this.saveSettings();
    return this.enabled;
  }

  public speak(text: string, options?: VoiceOptions): void {
    if (!this.enabled || !this.synth) return;

    // Check if speech synthesis is already speaking
    if (this.isSpeaking) {
      this.synth.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Apply options
    const mergedOptions = { ...this.options, ...options };
    
    utterance.voice = mergedOptions.voice;
    utterance.rate = mergedOptions.rate || 1;
    utterance.pitch = mergedOptions.pitch || 1;
    utterance.volume = mergedOptions.volume || 1;

    // Set event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
    };
    
    utterance.onend = () => {
      this.isSpeaking = false;
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      this.isSpeaking = false;
    };

    // Speak the text
    this.synth.speak(utterance);
  }

  public speakTimeBasedGreeting(dearOnes: { name: string, relation: string }[] = []): void {
    if (!this.enabled || !this.synth) return;
    
    const hour = new Date().getHours();
    let timeOfDay = '';
    let shouldSpeak = false;
    
    // Determine time of day and whether we should speak
    if (hour >= 5 && hour < 12) {
      timeOfDay = 'morning';
      if (!this.timeOfDayGreeted.morning) {
        this.timeOfDayGreeted.morning = true;
        shouldSpeak = true;
      }
    } else if (hour >= 18 && hour < 24) {
      timeOfDay = 'evening';
      if (!this.timeOfDayGreeted.evening) {
        this.timeOfDayGreeted.evening = true;
        shouldSpeak = true;
      }
    }
    
    if (!shouldSpeak || !timeOfDay) return;
    
    // Create personalized message with dear ones if available
    let message = '';
    if (dearOnes && dearOnes.length > 0) {
      const randomIndex = Math.floor(Math.random() * dearOnes.length);
      const dearOne = dearOnes[randomIndex];
      
      if (timeOfDay === 'morning') {
        message = `Good morning! Taking your medications regularly makes ${dearOne.name} happy and helps you live a long, healthy life together.`;
      } else {
        message = `Good evening! Remember, ${dearOne.name} cares about your health. Taking your medications helps you stay well for many more precious moments together.`;
      }
    } else {
      if (timeOfDay === 'morning') {
        message = "Good morning! Remember that taking your medications helps you stay healthy and enjoy life to its fullest.";
      } else {
        message = "Good evening! Taking your medications regularly keeps you healthy for all the wonderful moments life has to offer.";
      }
    }
    
    this.speak(message);
  }

  public stop(): void {
    if (this.synth) {
      this.synth.cancel();
      this.isSpeaking = false;
    }
  }

  public setOptions(options: VoiceOptions): void {
    this.options = { ...this.options, ...options };
    this.saveSettings();
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    return this.synth ? this.synth.getVoices() : [];
  }
}

export default VoiceReminderService;
