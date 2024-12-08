export const useOneSignal = () => {
  const { $oneSignal } = useNuxtApp()

  const requestPermission = async () => {
    return await $oneSignal.requestPermission()
  }

  const getUserId = async () => {
    return await $oneSignal.getUserId()
  }

  const sendNotification = async (options: { title: string; message: string; url?: string; icon?: string }) => {
    return await $oneSignal.createNotification(options)
  }

  const sendToUser = async (userId: string, options: { title: string; message: string; url?: string; icon?: string }) => {
    return await $oneSignal.sendToUser(userId, options)
  }

  return {
    requestPermission,
    getUserId,
    sendNotification,
    sendToUser
  }
}
