
import { Expo } from 'expo-server-sdk';
export function sendNotification(tokenArr,message){
    
    // Create a new Expo SDK client
    // optionally providing an access token if you have enabled push security
    let expo = new Expo({ accessToken: "CNYHm5pvkGW8ARJllad6xRU1pxQd7qFcmh17HG-7" });

    // Create the messages that you want to send to clients
    let messages = [];
    for (let token of tokenArr) {
        // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

        // Check that all your push tokens appear to be valid Expo push tokens
        if (!Expo.isExpoPushToken(token)) {
            console.error(`Push token ${pushToken} is not a valid Expo push token`);
            continue;
        }

        // Construct a message (see https://docs.expo.io/push-notifications/sending-notifications/)
        messages.push({
            to: token,
            sound: 'default',
            body: message,
            data: { withSome: 'data' },
        })
    }

    // The Expo push notification service accepts batches of notifications so
    // that you don't need to send 1000 requests to send 1000 notifications. We
    // recommend you batch your notifications to reduce the number of requests
    // and to compress them (notifications with similar content will get
    // compressed).
    let chunks = expo.chunkPushNotifications(messages);
    let tickets = [];
    (async () => {
        // Send the chunks to the Expo push notification service. There are
        // different strategies you could use. A simple one is to send one chunk at a
        // time, which nicely spreads the load out over time:
        for (let chunk of chunks) {
            try {
                let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                console.log(ticketChunk);
                tickets.push(...ticketChunk);
                // NOTE: If a ticket contains an error code in ticket.details.error, you
                // must handle it appropriately. The error codes are listed in the Expo
                // documentation:
                // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
            } catch (error) {
                console.error(error);
            }
        }
    })();
}