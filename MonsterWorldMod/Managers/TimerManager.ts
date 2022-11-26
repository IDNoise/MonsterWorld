export class TimerManager {
    timers: Map<AnyNotNil, TimerData> = new Map();

    AddOneTime(id: AnyNotNil, delay: number, callback: () => void){
        this.timers.set(id, {
            Repeat: false,
            Delay: delay,
            Interval: 0,
            IntervalsLeft: 0,
            Callback: callback
        })
    }

    AddInterval(id: AnyNotNil, interval: number, delay: number, callback: () => void | typeof StopTimerSignal, maxIntervals: number = -1){
        this.timers.set(id, {
            Repeat: true,
            Delay: delay,
            Interval: interval,
            IntervalsLeft: maxIntervals,
            Callback: callback
        })
    }

    AddOnObjectSpawn(id:AnyNotNil, objectId: Id, callback: (obj: game_object) => void){
        this.AddInterval(id, 0.05, 0, () => {
            let obj = level.object_by_id(objectId)
            if (obj != null){
                callback(obj);
                return StopTimerSignal;
            }
        })
    }

    Remove(id: AnyNotNil){
        this.timers.delete(id);
    }

    Update(deltaTime: number){
        let timersToDelete: AnyNotNil[] = [];
        for(let [id, timer] of this.timers){
            timer.Delay -= deltaTime;
            if (timer.Delay <= 0){
                let result = timer.Callback();
                let doStop = result == StopTimerSignal

                if (!timer.Repeat || timer.IntervalsLeft == 0 || doStop){
                    timersToDelete.push(id)
                }
                else {
                    timer.Delay = timer.Interval;
                    timer.IntervalsLeft--;
                }
            }
        }

        for(let id of timersToDelete){
            this.Remove(id)
        }
    }
}

type TimerData = {
    Repeat: boolean;
    Delay: number;
    Interval: number;
    IntervalsLeft: number;
    Callback: () => typeof StopTimerSignal | void;
}

export const StopTimerSignal = -1;