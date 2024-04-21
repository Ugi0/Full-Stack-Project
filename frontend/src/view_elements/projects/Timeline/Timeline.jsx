import { Rnd } from "react-rnd";
import { useState } from "react";
import AddEvent from "../../../components/addEvent/addEvent";
import EventModal from "../../../components/eventModal/eventModal";
import FolderIcon from '@mui/icons-material/Folder';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CircleIcon from '@mui/icons-material/Circle';
import DeleteComponentButton from "../../../components/deleteComponentButton/deleteComponentButton";
import { getWeek } from "../../../utils/getWeek";
import './Timeline.css'

function Timeline(props) {
    const [x, setX] = useState(props.sx.x);
    const [y, setY] = useState(props.sx.y);
    const [width, setWidth] = useState(props.sx.width);
    const [height, setHeight] = useState(props.sx.height);

    const [openModal, setOpenModal] = useState(false);
    const [openAddModal, setAddOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({})

    const [timelineLength, setTimelineLength] = useState("Bi-week")
    const curDate = new Date();
    curDate.setDate(curDate.getDate() - [6,0,1,2,3,4,5][curDate.getDay()])
    const [currentDate, setCurrentDate] = useState(curDate)
    //Possible values: Bi-week, Bi-month, Year

    props.innerRef.current = () => { return {x :x, y:y, width: width, height: height} }

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ];
    const weekDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

    const getStatusColor = (status) => {
        switch (status) {
            case "Not started":
                return '#AFEEEE'
            case "In progress":
                return '#FCE205'
            case "Stopped":
                return '#324AB2'
            case "Delayed":
                return '#DE1738'
            case "Done":
                return '#39ff14'
            default:
                throw new Error("Not valid status")
        }
    }

    const getDotColor = (status) => {
        switch (status) {
            case "Not started":
                return '#d7f6f6'
            case "In progress":
                return '#fdf082'
            case "Stopped":
                return '#91a0e0'
            case "Delayed":
                return '#f38799'
            case "Done":
                return '#9cff89'
            default:
                throw new Error("Not valid status")
        }
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Lowest":
                return '#2b2b2b'
            case "Low":
                return '#2b2b2b'
            case "Medium":
                return '#2b2b2b'
            case "High":
                return '#7C0A02'
            case "Urgent":
                return '#FF0000'
            default:
                throw new Error("Not valid status")
        }
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "High":
                return <PriorityHighIcon fill='#562e28' style={{fontSize: '17px'}} />
            case "Urgent":
                return <PriorityHighIcon fill='#562e28' style={{fontSize: '17px'}} />
            default:
                return
        }
    }

    const deleteEvent = () => {
        setOpenModal(false)
        props.handleDelete(selectedItem.type, selectedItem.id);
    }
    const saveEvent = (values) => {
        const newItem = selectedItem;
        for (const [key, value] of Object.entries(values)) {
            newItem[key] = value;
          }
        setOpenModal(false)
        props.handleAdd(selectedItem.type,newItem)
    }

    const handleClick = (item) => {
        setSelectedItem(item);
        setOpenModal(true);
    }

    const TimelineDates = () => {
        const cur = new Date(currentDate)
        cur.setDate(cur.getDate() - [6,0,1,2,3,4,5][cur.getDay()])
        switch (timelineLength) {
            case "Bi-week":
                return <>
                    {Array.from(Array(15).keys()).map((e,i) => {
                        const c = <div key={i} className="TimelineDate">
                            <p>
                                {weekDays[[6,0,1,2,3,4,5][cur.getDay()]].charAt(0)}
                            </p>
                            <p>
                                {cur.getDate()}
                            </p>
                        </div>
                        cur.setDate(cur.getDate()+1);
                        return c;
                    })}
                    </>
                    
            case "Bi-month":
                return <>
                    {Array.from(Array(9).keys()).map((e,i) => {
                        const c = <div key={i} className="TimelineDate">
                            <p>
                                W
                            </p>
                            <p>
                                {getWeek(cur)}
                            </p>
                        </div>
                        cur.setDate(cur.getDate()+7);
                        return c;
                    })}
                    </>
            case "Year":
                cur.setMonth(0);
                return <>
                    {Array.from(Array(12).keys()).map((e,i) => {
                        const c = <div key={i} className="TimelineDate">
                            <p>
                                {monthNames[cur.getMonth()].slice(0,3)}
                            </p>
                        </div>
                        cur.setMonth(cur.getMonth()+1);
                        return c;
                    })}
                    </>
            default:
                throw new Error("Not valid timeline length")
        }
    }

    const getLeft = (item) => {
        const cur = new Date(currentDate)
        let itemDate;
        if (item.started === "") {
            itemDate = new Date();
        } else {
            itemDate = new Date(item.started);
        }
        const diffTime = itemDate - cur
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        switch (timelineLength) {
            case "Bi-week":
                if (diffDays > 15) {
                    return undefined
                }
                if (cur > itemDate) {
                    return [0, 0]
                }
                return [`${100*diffDays/15}%`, diffDays]
            case "Bi-month":
                if (diffDays > 60) {
                    return undefined
                }
                if (cur > itemDate) {
                    return [0, 0]
                }
                return [`${100*diffDays/63}%`, diffDays]
            case "Year":
                if (diffDays > 365) {
                    return undefined
                }
                return [`${100*(itemDate.getMonth()*30+itemDate.getDate())/365}%`, diffDays]
            default:
                throw new Error("Not valid item")
        }
    }

    const getWidth = (left, item) => {
        const cur = new Date(currentDate)
        if (new Date(item.time) < cur) return undefined
        const diffTime = new Date(item.time) - cur
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const ans = diffDays + left;
        switch (timelineLength) {
            case "Bi-week":
                if (ans > 15) {
                    return [`${100*(15 - left)/15}%`, 15 - left]
                }
                return [`${100*(diffDays - left)/15}%`, diffDays - left]
            case "Bi-month":
                if (ans > 60) {
                    return [`${100*(63 - left)/63}%`, 63 - left]
                }
                return [`${100*(diffDays - left)/63}%`, diffDays - left]
            case "Year":
                if (ans > 365) {
                    return [`${100*(365 - left)/365}%`, 365 - left]
                }
                return [`${100*(diffDays - left)/365}%`, diffDays - left]
            default:
                throw new Error("Not valid item")
        }
    }

    const ContainerItems = (item) => {
        return <>
            <div className="TimelineContainerItemName">
                <FolderIcon />
                <p style={{textDecoration: `${item.completed ? 'line-through' : ""}`}}>{item.title}</p>
            </div>
            <div className="TimelineContainerItemPriority" style={{backgroundColor: getPriorityColor(item.priority)}}>
                {getPriorityIcon(item.priority)}
                <p>{item.priority}</p>
            </div>
            <div className="TimelineContainerItemUrgency" style={{backgroundColor: getStatusColor(item.status)}}>
                <CircleIcon style={{color: getDotColor(item.status), fontSize: '14px'}}/>
                <p>{item.status}</p>
            </div>
        </>
    }

    const titleText = () => {
        const cur = new Date(currentDate);
        switch (timelineLength) {
            case "Bi-week":
                return `${monthNames[currentDate.getUTCMonth()]} ${currentDate.getFullYear()}`
            case "Bi-month":
                cur.setDate(cur.getDate() + 30);
                return `${monthNames[cur.getUTCMonth()]} ${cur.getFullYear()}`
            case "Year":
                return `${currentDate.getFullYear()}`
            default:
                throw new Error("Not valid item")
        }
    }

    const moveCurTimeNext = () => {
        const cur = new Date(currentDate);
        switch (timelineLength) {
            case "Bi-week":
                cur.setDate(cur.getDate() + 14);
                setCurrentDate(cur);
                break;
            case "Bi-month":
                cur.setMonth(cur.getMonth() + 2);
                setCurrentDate(cur);
                break;
            case "Year":
                cur.setFullYear(cur.getFullYear() + 1);
                setCurrentDate(cur);
                break;
            default:
                throw new Error("Not valid item")
        }
    }

    const moveCurTimePrev = () => {
        const cur = new Date(currentDate);
        switch (timelineLength) {
            case "Bi-week":
                cur.setDate(cur.getDate() - 14);
                setCurrentDate(cur);
                break;
            case "Bi-month":
                cur.setMonth(cur.getMonth() - 2);
                setCurrentDate(cur);
                break;
            case "Year":
                cur.setFullYear(cur.getFullYear() - 1);
                setCurrentDate(cur);
                break;
            default:
                throw new Error("Not valid item")
        }
    }

    return <>
        <Rnd disableDragging={!props.editable} enableResizing={props.editable} size={{ width: width,  height: height }}
        position={{ x: x, y: y }}
        style={{border: props.editable ? "solid whitesmoke 1px" : ""}}
        onDragStop={(e, d) => { setX(d.x); setY(d.y); }}
        onResizeStop={(e, direction, ref, delta, position) => {
            setWidth(`${Math.max(Number(ref.style.width.slice(0,-2)), 500)}px`)
            setHeight(`${Math.max(Number(ref.style.height.slice(0,-2)), 200)}px`);
            setX(position.x);
            setY(position.y);
        }}>
            <div className="TimelineRoot">
                <div className="TimelineRootTitle">
                    <FolderIcon sx={{width: 20, height: 20, fill: 'white'}} />
                    <p> Projects </p>
                </div>
                <div className="Timeline">
                    <div className="TimelineTitle">
                        <div id="TimelineTitleLeft">
                            <KeyboardDoubleArrowRightIcon sx={{width: 20, height: 20, fill: 'white'}} />
                            <p> {titleText()} </p>
                        </div>
                        <div className="TimelineTitleRight">
                            <div className="TimelineTitleRightContainer">
                                <select defaultValue={timelineLength} onChange={(e) => { setTimelineLength(e.target.value); }} className="TimelineSelect">
                                    <option value={"Bi-week"}>Bi-week</option>
                                    <option value={"Bi-month"}>Bi-month</option>
                                    <option value={"Year"}>Year</option>
                                </select>
                            </div>
                            <div className="TimelineTitleRightContainer" id="TimelineTitleRightContainer">
                                <ArrowBackIosIcon sx={{width: 15, height: 15, fill: 'white'}} onClick={() => moveCurTimePrev()} />
                                <ArrowForwardIosIcon sx={{width: 15, height: 15, fill: 'white'}} onClick={() => moveCurTimeNext()}/>
                            </div>
                        </div>
                    </div>
                    <div className="TimelineDates">
                        {TimelineDates()}
                    </div>
                    <div className="TimelineContainer">
                        {[...props.userData.events.projects.values()].sort((a,b) => a.time.localeCompare(b.time)).map((e,i) => {
                            const leftAns = getLeft(e)
                            if (leftAns === undefined) return <></>;
                            const [left, leftDays] = leftAns;
                            const widthAns = getWidth(leftDays, e);
                            if (widthAns === undefined) return <></>;
                            const [width, widthDays] = widthAns;
                            return <div className="TimelineContainerItem" onClick={() => handleClick(e)} style={{left: left, width: width}} key={i}>
                                    {ContainerItems(e)}
                                </div>
                        })}
                    </div>
                    <button className="TimelineNewButton" onClick={() => setAddOpenModal(true)}>
                        + New
                    </button>
                </div>
                <DeleteComponentButton editable={props.editable} id={props.id} deleteComponent={props.deleteComponent} />
            </div>
        <EventModal 
            saveEvent={saveEvent} deleteEvent ={deleteEvent}
            handleClose = {() => setOpenModal(false)}
            open = {openModal}
            item = {selectedItem}
        />
        <AddEvent courses={props.userData.courses} firstValue={"4"} events={props.userData.events} handleAdd={props.handleAdd} time={new Date().toISOString().slice(0,16)} open={openAddModal} onClose={() => setAddOpenModal(false)}/>
        </Rnd>
    </>
}

export default Timeline;