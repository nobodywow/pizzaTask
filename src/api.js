const dataProcessing = (data, guests) => {
    guests = data.party.map(item => {
        item.isVegan = 'false';
        return item;
    });      
    return guests;     
}

const createURL = (guests) => {
    let url = encodeURI(guests.reduce((str, item) => {
        return item.eatsPizza ? [...str, item.name] : [...str];
    }, []).join()); 
    return url;
}

const priceConverting = (rates, currency, moneyCount) => {
    let result = 0;
    if(currency === 'USD') {
        result = rates.USD * moneyCount;
        return result;
    } 
    else if(currency === 'EUR') {
        result = rates.EUR * moneyCount;
        return result;
    }
    else if(currency === 'BYN') {
        result = rates.BYN * moneyCount;
        return result;
    }
}

const vegansDataProcessing = (data, guests) => {
    guests.map(guest => {
        data.diet.forEach(item => {
            if(item.name === guest.name) {
                guest.isVegan = item.isVegan;
            }
        })
    return guest;
    });    
    return guests;
}

const orderPizzaRequest = (guests) => {
    let isVegans = guests.reduce((accum, item) => {
        if(item.eatsPizza) {
            item.isVegan ? accum.vegans = accum.vegans + 1 : accum.nonVegans = accum.nonVegans + 1;
        }            
        return accum;            
    }
    , {vegans: 0, nonVegans: 0});
    let pizzaEaters = guests.reduce((accum, item) => {
        return item.eatsPizza ? accum + 1 : accum;
    }, 0);
    let urlString = (isVegans.vegans > isVegans.nonVegans) ? `vegan/${pizzaEaters}` : `meat/${pizzaEaters}`;
    return urlString;
}

const pricesProcessing = (currency, colaOrder, pizzaOrder, guests) => {
    let colaPrice = colaOrder.price.split(' ')[0];
    let pizzaPrice = pizzaOrder.price.split(' ')[0];
    let colaPriceBYN = priceConverting(currency, colaOrder.price.split(' ')[1], colaPrice);
    let pizzaPriceBYN = priceConverting(currency, pizzaOrder.price.split(' ')[1], pizzaPrice);
    let pizzaEatersGuests = guests.reduce((accum, item) => {
        return item.eatsPizza ? accum + 1 : accum;
    }, 0);
    let totalGuests = guests.length;
    guests.forEach(guest => {
        guest.eatsPizza ? guest.priceToPay = (colaPriceBYN / totalGuests + pizzaPriceBYN / pizzaEatersGuests) : guest.priceToPay = (colaPriceBYN / totalGuests);
    })
    return guests;
}


export const getAllRequests = async (guestArray) => {
    const guestsResponse = await fetch("https://gp-js-test.herokuapp.com/pizza/guests").then(response => response.json());
    guestArray = dataProcessing(guestsResponse, guestArray);
    const dietsResponse = await fetch("https://gp-js-test.herokuapp.com/pizza/world-diets-book/" + createURL(guestArray)).then(response => response.json());
    guestArray = vegansDataProcessing(dietsResponse, guestArray);
    const [currency, colaOrder, pizzaOrder] = await Promise.all([
        fetch("https://gp-js-test.herokuapp.com/pizza/currency").then(response => response.json()),
        fetch(`https://gp-js-test.herokuapp.com/pizza/order-cola/${guestArray.length}`).then(response => response.json()),
        fetch(`https://gp-js-test.herokuapp.com/pizza/order/${orderPizzaRequest(guestArray)}`).then(response => response.json())
    ]);
    guestArray = pricesProcessing(currency, colaOrder, pizzaOrder, guestArray);    
    return guestArray; 
} 

