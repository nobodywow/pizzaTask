import React from 'react';


const Table = (props) => {

    
    return (
        <div className="table-container">
        <div className="table-item">Name</div>
        <div className="table-item">Share to pay</div>
        <div className="table-item">Pay</div>
        {            
            props.guest.map((item) => 
                <React.Fragment key={item.name}>
                    <div className="table-item">{item.name}</div>
                    <div className="table-item">{`${item.priceToPay.toFixed(1)} BYN`}</div>
                    <div className="table-item"><button className={item.priceToPay === 0 ? "btn-pay loading" : "btn-pay"} disabled={item.priceToPay === 0} onClick={() => props.func(item)}>{item.priceToPay === 0 ? "PAID" : "PAY"}</button></div>
                </React.Fragment>
            )
        }
        <div className="table-item">Money to collect</div>
        <div className="table-item">{`${props.priceLeft.toFixed(1)} BYN`}</div>
        <div className="table-item"></div>
        </div>
        
    );
}

export default Table;