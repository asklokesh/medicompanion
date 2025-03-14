
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
