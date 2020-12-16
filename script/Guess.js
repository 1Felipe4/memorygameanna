class Guess {
    constructor(start=new Date(), match = false, clicks = []){
        this.match = match;
        this.clicks = clicks;
        this.start = start;

        this.addClick= function(click){
            this.clicks.push(click);
        }

        this.getClicksInSec = function(secs, start){
            let result = 0;
            let stopper = (start.getTime() - this.start.getTime() )/1000;
            console.log("Secs" + secs);
            // if(stopper < secs || stopper > secs+1){
            //     return 0;
            // }
            
            clicks.forEach(click => {
               let time = ((click.time.getTime() - start.getTime())/ 1000);
               if(time >= secs && time < secs+1){
                   result++;
               }
            })

            return result;
        }

    }

    

}