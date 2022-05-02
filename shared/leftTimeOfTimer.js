const time = new Date();
const setTimerToMutation = () => {
    const { leftHours, leftMinutes } = caculateElapsedTime()
    time.setHours(time.getHours() + leftHours)
    time.setMinutes(time.getMinutes() + leftMinutes);
}
setTimerToMutation()


export default time;
