

export default defineNuxtPlugin(nuxtApp => {
  if (process.client) {
    // Initialize OneSignal
    window.OneSignal = window.OneSignal || [];
    const OneSignal = (window as any).OneSignal;
    window.OneSignal.push(function() {
      OneSignal.init({
        appId: '217eb07a-530e-4fb0-b333-0a5b27bf16fd', // Replace with your OneSignal App ID
        allowLocalhostAsSecureOrigin: true,
        serviceWorker: {
          path: '/OneSignalSDKWorker.js',
          scope: '/'
        },
        promptOptions: {
          prompts: [
            {
              type: 'push',
              autoPrompt: true,
              text: {
                actionMessage: "We'd like to show you notifications",
                acceptButton: "ALLOW",
                cancelButton: "NO THANKS"
              }
            }
          ]
        }
      });
    });

    // Provide OneSignal instance globally
    nuxtApp.provide('OneSignal', window.OneSignal);
  }
});
