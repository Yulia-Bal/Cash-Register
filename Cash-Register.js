function checkCashRegister(price, cash, cid) {
    let change = cash-price;
    let cidSum = cid.reduce((acc,curr)=>acc+curr[1],0)
    let money = {
      0.01:"PENNY",
      0.05:"NICKEL",
      0.1:"DIME",
      0.25:"QUARTER",
      1:"ONE",
      5:"FIVE",
      10:"TEN",
      20:"TWENTY",
      100:"ONE HUNDRED"
    }
    if (change===cidSum){
      return {status: "CLOSED", change:cid}
    } else if(change > cidSum){
      return {status: "INSUFFICIENT_FUNDS", change: []}
    }
  
    let changeArr = [];
    let moneyArr = Object.keys(money).sort((a,b)=>a-b)  //moneyArr=['0.01', '0.05', '0.1', '0.25', '1', '5', '10', '20', '100']
  
    for (let i=moneyArr.length-2;i>=0;i--){
      if(change>moneyArr[i]){         //change>20,10,5,1...
       for (let j=0;j<cid.length;j++){
        if (cid[j][0]===money[moneyArr[i]]){
          let inDrawer = cid[j][1] //how much money in 20 bills there are in drawer
          let n=0;
          while (inDrawer>0&&change>=moneyArr[i]){  //while there is at least one bill in drawer and change >=one bill
            change = Math.round(100*(change-moneyArr[i]))/100;  //change still left to pay
            inDrawer = inDrawer-moneyArr[i]  //left in Drawer
            n++;                             // how many bills of 20 were given in change
          }
          cid[j][1] = inDrawer;
          changeArr.push([money[moneyArr[i]],n*moneyArr[i]])
        }
       }
      }
    }
    if (cid.reduce((acc,curr) => (acc+curr[1]),0)>0&&change===0){
      return {status: "OPEN", change:changeArr}
    } 
    else {
      return  {status: "INSUFFICIENT_FUNDS", change:[]}
    }
  }
  
  
//Tests

//should return {status: "INSUFFICIENT_FUNDS", change: []}
console.log(JSON.stringify(checkCashRegister(19.5, 20, [["PENNY", 0.01], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 1], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])))
  
//should return {status: "CLOSED", change: [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]]}
console.log(JSON.stringify(checkCashRegister(19.5, 20, [["PENNY", 0.5], ["NICKEL", 0], ["DIME", 0], ["QUARTER", 0], ["ONE", 0], ["FIVE", 0], ["TEN", 0], ["TWENTY", 0], ["ONE HUNDRED", 0]])))
  
//should return {status: "OPEN", change: [["TWENTY", 60], ["TEN", 20], ["FIVE", 15], ["ONE", 1], ["QUARTER", 0.5], ["DIME", 0.2], ["PENNY", 0.04]]}
console.log(JSON.stringify(checkCashRegister(3.26, 100, [["PENNY", 1.01], ["NICKEL", 2.05], ["DIME", 3.1], ["QUARTER", 4.25], ["ONE", 90], ["FIVE", 55], ["TEN", 20], ["TWENTY", 60], ["ONE HUNDRED", 100]])))
  