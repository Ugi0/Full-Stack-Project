import FolderIcon from '@mui/icons-material/Folder';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AbcIcon from '@mui/icons-material/Abc';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CircleIcon from '@mui/icons-material/Circle';
import EventModal from '../../../components/eventModal/eventModal';
import { Icons } from '../../../utils/icons';
import './ProjectList.css'
import { useState } from 'react';

function ProjectList(props) {
    const [openModal, setOpenModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState({})
    
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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "Lowest":
                return '#3b3b3b'
            case "Low":
                return '#3b3b3b'
            case "Medium":
                return '#3b3b3b'
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
                return <PriorityHighIcon fill='#562e28' />
            case "Urgent":
                return <PriorityHighIcon fill='#562e28' />
            default:
                return
        }
    }

    const getTimeText = (time, started) => {
        time = new Date(time);
        if (started !== "") {
            started = new Date(started);
            return `${started.getUTCDate()}/${started.getMonth()}/${started.getFullYear()} → ${time.getUTCDate()}/${time.getMonth()}/${time.getFullYear()}`
        } else {
            return `${time.getUTCDate()}/${time.getMonth()}/${time.getFullYear()}`
        }
    }

    const handleProjectClick = (item) => {
        setSelectedItem(item)
        setOpenModal(true)
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

    const renderNextCheckpoint = (data) => {
        const items = data.data.split(";")
                    .map(e => [e.split(",")[0], e.split(",")[1]])
                    .filter(e => e[0] !== "")
        const index =  data.data.split(";")
            .map(e => [e.split(",")[0], e.split(",")[1]])
            .filter(e => e[0] !== "")
            .map(e => e[1])
            .indexOf("0")
        if (index === -1) {
            return <>
                <CheckCircleOutlineIcon />
                All done
                </>
        } else {
            return <>
                <input type="checkbox" checked={false} onChange={() => {
                    items[index][1] = '1'
                    data.data = items.map(e => `${e[0]},${e[1]}`).join(";")
                    props.handleAdd(data.type, data)
                }}/>
                {items[index][0]}
            </>
        }
    }

    return (
        <div className="ProjectListRoot">
            <div className="ProjectListIconName">
                <FolderIcon sx={{width: 20, height: 20, fill: 'white'}} />
                <p> Projects </p>
            </div>
            <div id='ProjectList'>
                <div className="ProjectListTitles">
                    <div className="ProjectListTitle">
                        <TrackChangesIcon sx={{fontSize: 15}}/>
                        <p> Status </p>
                    </div>
                    <div className="ProjectListTitle">
                        <AbcIcon sx={{fontSize: 15}}/>
                        <p> Name </p>
                    </div>
                    <div className="ProjectListTitle">
                        <PriorityHighIcon sx={{fontSize: 15}}/>
                        <p> Priority </p>
                    </div>
                    <div className="ProjectListTitle">
                        <ViewTimelineIcon sx={{fontSize: 15}}/>
                        <p> Timeframe </p>
                    </div>
                    <div className="ProjectListTitle">
                        <CheckCircleIcon sx={{fontSize: 15}}/>
                        <p> To Do </p>
                    </div>
                </div>
                {[...props.projects.values()].sort((a,b) => a.time.localeCompare(b.time)).map((e,i) => {
                    const date = new Date(e.time)
                    return (
                        <div key={i} className="ProjectListValues">
                            <div className='ProjectListValue'>
                                <div id="ProjectListStatus" style={{backgroundColor: getStatusColor(e.status)}}>
                                    <CircleIcon sx={{fontSize: 10}}/>
                                    <p> {e.status} </p>
                                </div>
                            </div>
                            <div className='ProjectListValue' id="ProjectListName" onClick={() => handleProjectClick(e)}>
                                <p> {e.title} </p>
                            </div>
                            <div className='ProjectListValue' onClick={() => handleProjectClick(e)}>
                                <div id="ProjectListPriority" style={{backgroundColor: getPriorityColor(e.priority)}}>
                                    {getPriorityIcon(e.priority)}
                                    <p> {e.priority} </p>
                                </div>
                            </div>
                            <div className='ProjectListValue' id="ProjectListTime" onClick={() => handleProjectClick(e)}>
                                <p> {getTimeText(e.time, e.started)} </p>
                            </div>
                            <div className='ProjectListValue' id="ProjectListTodo">
                                <p> {renderNextCheckpoint(e)}</p>
                            </div>
                        </div>
                )})}
                </div>
                <EventModal 
                    saveEvent={saveEvent} deleteEvent ={deleteEvent}
                    handleClose = {() => setOpenModal(false)}
                    open = {openModal}
                    item = {selectedItem}
                />
        </div>
    )
}

export default ProjectList;