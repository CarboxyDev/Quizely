exports.generateRandomList = (amount,max) => {
    let list = [];
    for (x=0;x<amount;x++){
        let rand = Math.floor(Math.random() * max);
        if (list.includes(rand)){
            x--;
        }
        else {
            list.push(rand);
        }
    }

    return list;
};