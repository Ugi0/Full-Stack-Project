import FolderIcon from '@mui/icons-material/Folder';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import AbcIcon from '@mui/icons-material/Abc';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PriorityHighIcon from '@mui/icons-material/PriorityHigh';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CircleIcon from '@mui/icons-material/Circle';
import { Icons } from '../../../utils/icons';
import './ProjectList.css'

function ProjectList(props) {
    
    const getStatusColor = (status) => {
        switch (status) {
            case "Not started":
                return '#5a5a5a'
            case "In progress":
                return '#294873'
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
                return '#562e28'
            case "Urgent":
                return '#562e28'
            default:
                throw new Error("Not valid status")
        }
    }

    const getPriorityIcon = (priority) => {
        switch (priority) {
            case "High":
                return <PriorityHighIcon fill='#562e28' />
            case "Urgent":
                return <div><PriorityHighIcon fill='#562e28' /><PriorityHighIcon fill='#562e28' /></div>
            default:
                return
        }
    }

    const handleProjectClick = () => {
        //TODO Open a modal to edit project
    }

    //TODO Add checkpoints to project creation that will be shown in the To Do part
    //TODO When project is moved from "Not Started", mark the time to be shown in timeframe


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
                {[...props.projects.values()].map((e,i) => {
                    const date = new Date(e.time)
                    return (
                        <div className="ProjectListValues" onClick={handleProjectClick}>
                            <div className='ProjectListValue'>
                                <div id="ProjectListStatus" style={{backgroundColor: getStatusColor(e.status)}}>
                                    <CircleIcon sx={{fontSize: 10}}/>
                                    <p> {e.status} </p>
                                </div>
                            </div>
                            <div className='ProjectListValue' id="ProjectListName">
                                <p> {e.title} </p>
                            </div>
                            <div className='ProjectListValue'>
                                <div id="ProjectListPriority" style={{backgroundColor: getPriorityColor(e.priority)}}>
                                    {getPriorityIcon(e.priority)}
                                    <p> {e.priority} </p>
                                </div>
                            </div>
                            <div className='ProjectListValue' id="ProjectListTime">
                                <p> {date.getUTCDate()}/{date.getMonth()}/{date.getFullYear()} </p>
                            </div>
                            <div className='ProjectListValue' id="ProjectListTodo">
                                <p> To Do </p>
                            </div>
                        </div>
                )})}
                </div>
        </div>
    )
}

export default ProjectList;