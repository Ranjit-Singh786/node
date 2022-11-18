import exactMath from 'exact-math';
import TimeIntervals from './TimeIntervals.js';
const timeinterval = TimeIntervals.time_interval;
const time_divider = TimeIntervals.time_divider;
const getTimeStamp = (interval = '1m', start_time = null) => {
    if (!timeinterval.includes(interval)) {
        interval = '1m';
    }
    const D = (start_time != null) ? new Date(start_time) : new Date();
    const seconds_diff = 60000;
    let time_diff = 0;
    //set time in universal milliseconds
    D.setUTCMilliseconds(0);
    D.setUTCSeconds(0);

    if (interval.includes('m')) {
        // Setting Time
        let c_minutes = D.getUTCMinutes();
        let min_diff = c_minutes % time_divider[interval];
        c_minutes = exactMath.sub(c_minutes, min_diff);

        // Set Minutes
        D.setUTCMinutes(c_minutes);
        // Setting Time Difference
        time_diff = time_divider[interval];
    }else
    {
        // Set UTC Minutes To Zero
        D.setUTCMinutes(0);
    }
    if(interval == '1d')
    {
        D.setUTCHours(0);
        time_diff = exactMath.mul(24,60);
        
    }
    if(interval == '1w')
    {
        //Set Default to 0
        D.setUTCHours(0);

        let c_date = D.getUTCDate();
        let c_day = D.getUTCDay();

        // Date having Monday
        let set_date = exactMath.sub(c_date , (c_day - 1));
        D.setUTCDate(set_date); // set day to monday

        // Setting Time Difference
        time_diff = exactMath.mul(24, 60 , 7);
    }if(interval == '1M')
    {
        // Set Default to 
        D.setUTCHours(0);

        // Set UTC Date To Start of Month
        D.setUTCDate(1);

        let last_date_of_month = new Date(D.getFullYear(), D.getUTCMonth() + 1).getUTCDate();
        time_diff = exactMath.mul(24, 60 , last_date_of_month);
    }
    time_diff = exactMath.sub(exactMath.mul(time_diff,seconds_diff) , 1 );
    start_time = D.getTime();
    let end_time = exactMath.add(start_time,time_diff);
    // console.log(end_time,'end time is here')
    return {
        start_time,
        end_time,
        time_diff
    }
    
    
}
export default { getTimeStamp }