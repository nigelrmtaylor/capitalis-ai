declare interface Window {
  OneSignal: {
    Notifications: {
      requestPermission(): Promise<boolean>;
      create(options: {
        title: string;
        message?: string;
        icon?: string;
        url?: string;
        [key: string]: any;
      }): Promise<void>;
    };
  };
}
