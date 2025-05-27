import notificationService from "./NotificationService";

/**
 * Initializes the notification system by requesting permissions
 * and setting up the notification handler.
 */
const initializeNotifications = async () => {
  try {
    // Request permissions and set up notification handler
    await notificationService.requestPermissions();

    // Set up notification handler
    await notificationService.sendImmediateNotification(
      "Notifications Enabled",
      "You will now receive notifications for your vocabulary learning."
    );
  } catch (error) {
    console.error("Failed to initialize notifications:", error);
  }
};

export default initializeNotifications;
