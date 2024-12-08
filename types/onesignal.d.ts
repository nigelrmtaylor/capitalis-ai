declare interface Window {
  OneSignal: {
    push(callback: () => void): void;
    init(options: {
      appId: string;
      allowLocalhostAsSecureOrigin?: boolean;
      serviceWorkerPath?: string;
      welcomeNotification?: {
        disable?: boolean;
      };
    }): Promise<void>;
    showNativePrompt(): Promise<void>;
    getNotificationPermission(): Promise<NotificationPermission>;
    getUserId(): Promise<string>;
    on(event: string, callback: (data: any) => void): void;
  };
}
