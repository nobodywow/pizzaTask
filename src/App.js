import React , { Component } from 'react';
import Pizza from './Pizza';
import Loading from './Loading';
import Table from './Table';
import {getAllRequests} from './api';
import './index.css';


class App extends Component {
    
    state = {
        guests: [],
        isLoading: false,
        toShow: false
    }    

    fetchData = async () => {
        this.setState({isLoading: true});
        let guestArray = [];
        guestArray = await getAllRequests(guestArray);
        this.setState({
            guests: guestArray,
            isLoading: false,
            toShow: true
        });
    }

    payPrice = (guestName) => {
        let newGuests = this.state.guests.map((item) => item.name === guestName.name ? {...item, priceToPay: 0} : item);
        this.setState({
            guests: newGuests
        });
    }

    render() {        
        let price = this.state.guests.reduce((accum, item) => accum + item.priceToPay, 0);
        let pizzaEaters = this.state.guests.reduce((number, item) => item.eatsPizza ? number + 1 : number, 0);
        let isVegans = this.state.guests.reduce((accum, item) => {
            if(item.eatsPizza) {
                item.isVegan ? accum.vegans = accum.vegans + 1 : accum.nonVegans = accum.nonVegans + 1;
            }            
            return accum;            
        }
        , {vegans: 0, nonVegans: 0});
        let pizzaColor = isVegans.vegans > isVegans.nonVegans ? "vegan" : "meat";
        let content;
        if (this.state.isLoading) {
            content = <Loading />
        }

        if(!this.state.isLoading  && this.state.toShow) {
            content = <div><Pizza color={pizzaColor} number={pizzaEaters} /><Table guest={this.state.guests} func={this.payPrice} priceLeft={price}/></div>;
        }
        return (
            <div className="container padding">
                <button className="btn" onClick={this.fetchData}>Load Party</button>
                {content}
            </div>
        )
    }
}

export default App;