
// import { where } from "sequelize";
import { ListCrypto } from "../modals/ListCrypto.js";
import { ListCoin } from "../modals/ListCoin.js";
// import fetch from 'node-fetch';
import myCache from './../Node-cache/cache.js';
import Nohlc from "../RunnerEngine/Nohlc.js";
import e from "express";
export default{
 async get_list(req,res){
    const excluded_fields = ['active_status','address','deposit','deposit_min','deposit_max','deposit_commission', 'deposit_commission_type','withdraw','withdraw_min','withdraw_max','withdraw_commission', 'withdraw_commission_type','buy','buy_min','buy_max','buy_commission', 'buy_commission_type','sell','sell_min','sell_max','sell_commission', 'sell_commission_type'];

    var crypto = await ListCrypto.findAll({
        attributes:{
            exclude: excluded_fields
        },
        where: {
            active_status : 1
        }
    });
    var listcoin = await ListCoin.findAll({
        attributes:{
            exclude: excluded_fields
        },
        where: {
            active_status : 1
        }
    });

    let result  = crypto.concat(listcoin);
    // return res.json(result);
    if (myCache.has('getTickers')) {
        var tickers =   myCache.get('getTickers');
    }else{
        var tickers = await get_tickers();      
    }    
    var listed_tickers = await get_Listed_tickers();
    // console.log(listed_tickers,'listed tickers is here')
    var current_prices = myCache.get('getCurrentPrice');
    // console.log(current_prices);
    result.forEach(element => {
        // console.log(element)
        let finder = current_prices?.find(o => o.symbol === element.symbol);
        element.dataValues['price'] = (finder != null) ? finder.price : "0";
        element.dataValues['change'] = (finder != null) ? finder.change : "0";
        element.dataValues['volume'] = (finder != null) ? finder.volume : "0";
        element.dataValues['high'] = (finder != null) ? finder.high : "0";
        element.dataValues['low'] = (finder != null) ? finder.low : "0";
        element.dataValues['chart'] = `${process.env.BASE_URL}image/charts/${element.symbol}.svg`
    });

   let l_result=  result.filter(e=>Object.keys(e.dataValues).includes('current_price'))
//    console.log(results)
if(l_result.length != 0)
          {
              l_result = await getTickerdata(l_result);
              let o_result = result.filter(el => !(Object.keys(el.dataValues).includes('current_price')));
            //   console.log(o_result)
              result = o_result.concat(l_result);
          }

},

}

async function get_tickers(){
    let result_aa = [];
           let attr = [ 'currency' , 'pair_with' , 'symbol'];
           var tickers = await ListCrypto.findAll({
            attributes: attr
           })
           tickers.forEach(element => {
                    let pair = element.currency + element.pair_with;
                    result_aa.push(pair);
           });
           return result_aa;
}

async function get_Listed_tickers(){
    let result_aa = [];
           let attr = [ 'currency' , 'pair_with' , 'symbol'];
           var tickers = await ListCoin.findAll({
            attributes: attr
           })
           tickers.forEach(element => {
                    let pair = element.currency + element.pair_with;
                    result_aa.push(pair);
           });
           return result_aa;
}
async function getTickerdata(listed_coins_array, index = 0){
       if(listed_coins_array==index) return listed_coins_array;
       let element = listed_coins_array[index];
    //    console.log(element,'element is here')
        element = element.dataValues;
        var symbol = (element.currency +element.pair_with);
        // console.log(element_withpair)
        let data = await Nohlc.instantOhlc(symbol,'1d') || []; 
     
}
    