import * as Notifications from 'expo-notifications';

export default async function scheduleNoti(hour,minute) {
    /*const nextTriggerDate = await Notifications.getNextTriggerDateAsync({
        hour,
        minute,
    }); */
    console.log(hour,"시",minute,"분" ,"뒤에 푸쉬 알림이 실행됩니다.")
    /* const trigger = new Date();
    trigger.setDate(trigger.getDate() + 1);
    trigger.setHours(hour);
    trigger.setMinutes(minute);
    trigger.setSeconds(trigger.getSeconds() + 10);
    console.log(trigger,"트리거 console"); */
    
    Notifications.scheduleNotificationAsync({
        content: {
            title: "가족의 9시",
            body: '질문이 도착했어요!!',
        },
        trigger: {
            hour,
            minute,
        }
        /* new Date(nextTriggerDate) */
    });
    await Notifications.cancelAllScheduledNotificationsAsync();
    const a = await Notifications.getAllScheduledNotificationsAsync()
    console.log(a)
}