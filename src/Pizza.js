import React from 'react';


const Pizza = (props) => {
    const degreesArr = [];
    const degrees = 360 / props.number;
    for(let i = 0; i < props.number / 2; i++){
        degreesArr.push(degrees * i);
    }
    return (
        <div className="container">
            <div className={props.color === "vegan" ? "pizza vegan" : "pizza meat"}>
                {
                    degreesArr.map(item => {
                        return <div key={item} style={{transform: `rotate(${item}deg)`}} className="diameter"></div>
                    })
                }
            </div>
        </div>        
    )        
}

export default Pizza;