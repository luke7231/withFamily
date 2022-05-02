export const caculateElapsedTime = (hours,minutes) => {
    const start = {
        hours,
        minuite: minutes,
    }
    
    const now = new Date();
    const 현재시 = now.getHours();
    const 현재분 = now.getMinutes();
    

    let diffHours = 0;
    let diffMinutes = 0;
    if (start.hours > 현재시) { //안 지났다면,,
        diffHours = start.hours - 현재시;
    
        if (start.minuite >= 현재분) {
        diffMinutes = start.minuite - 현재분;
        return {
            leftHours: diffHours,
            leftMinutes: diffMinutes,
        }
        
        } else {
            diffMinutes = 60 - 현재분 + start.minuite;
            diffHours = start.hours - 현재시 - 1;
            return {
                leftHours: diffHours,
                leftMinutes: diffMinutes,
            }
        }
    } else if ( start.hours == 현재시 ){ //시가 같다면 ,
        if (start.minuite > 현재분) {//시간 남았다면,
        diffMinutes = start.minuite - 현재분;
        return {
            leftHours: diffHours,
            leftMinutes: diffMinutes,
            }
        } else if(start.minuite < 현재분) {
            diffHours = 24 - (1 + 현재시) + start.hours;
            diffMinutes = 60 - 현재분 + start.minuite;
            return {
            leftHours: diffHours,
            leftMinutes: diffMinutes,
            }
        }
        
        
    } else { // 시가 더 높을 때,
        if (현재분 === 0) {
            return {
                leftHours: 24 - 현재시 + start.hours,
                leftMinutes: start.minuite,
            }
        } else if(start.minuite > 현재분) {
            diffMinutes = start.minuite - 현재분,
            diffHours = 24 - 현재시 + start.hours;
            return {
                leftHours: diffHours,
                leftMinutes: diffMinutes
            }
        } else if(start.minuite == 현재분){
            diffHours = 24 - 현재시 + start.hours;
            return {
                leftHours: diffHours,
                leftMinutes: diffMinutes
            }
        } else {
            diffHours = 24 - (1 + 현재시) + start.hours;
            diffMinutes = 60 - 현재분 + start.minuite;
            return {
                leftHours: diffHours,
                leftMinutes: diffMinutes
            }
        }
    }
}

