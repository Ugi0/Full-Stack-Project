import DeleteIcon from '@mui/icons-material/Delete';
import './deleteComponentButton.css'

function DeleteComponentButton(props) {
    if (props.editable) {
        return (
        <div className='deleteComponentButton' onClick={() => props.deleteComponent(props.id)}>
            <DeleteIcon style={{fill: "red"}} />
         </div>)
    }
}

export default DeleteComponentButton;