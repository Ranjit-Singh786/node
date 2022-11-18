import timeStamper from "./timeStamper.js";

export default{
    async  instantOhlc(symbol,interval = '1m'){
        let timestamps = timeStamper.getTimeStamp(interval);
        console.log(timestamps,'chcek out');
    }
}