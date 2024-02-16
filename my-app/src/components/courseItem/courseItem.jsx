import './courseItem.css'

function CourseItem(props) {
    if (props.icon) {
        return (
            <div onClick={props.onClick} className='courseItem' style={{'backgroundColor': '#262626a0'}}>
                <props.icon sx={{width: '250px', height: '100px', margin: '5px'}} />
                <div className='courseItemText'>
                    <props.icon />
                    <p>
                        {props.title}
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