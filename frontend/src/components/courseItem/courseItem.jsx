import './courseItem.css'

function CourseItem(props) {
    if (props.item) {
        return (
            <div className='courseItem' style={{'backgroundColor': '#262626a0'}}>
                <img src={props.icons[1]} alt={props.item.subject} style={{width: '100px', height: '100px', margin: '5px', paddingLeft: '75px'}} />
                {/*<props.icon sx={{width: '250px', height: '100px', margin: '5px'}} />*/}
                <div className='courseItemText'>
                    <img src={props.icons[0]} alt={props.item.subject} style={{width: '30px', height: '30px'}}/>
                    {/*<props.icon />*/}
                    <p>
                        {props.item.title}
                    </p>
                </div>
            </div>
        )
    } else {
        return (
            <div onClick={props.onClick} className='courseItem' style={{alignItems: 'center', lineHeight: '150px'}}>
                {props.title}
            </div>
        )
    }
}

export default CourseItem;