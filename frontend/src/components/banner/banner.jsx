import React from "react";
import './banner.css'
import background from '../../images/background.gif'

function Banner(props) {
    return (
        <div style={{width: '100%'}}>
            <img className="BannerImage" src={require('../../images/background.jpg')} alt=""/>
        </div>
    )
}

export default Banner;