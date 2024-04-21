import toast from "react-hot-toast";

var dismissed = [];

function checkForNotifications(userData) {
    const currentTime = new Date();

    const wordToUse = (type) => {
        switch (type) {
            case 'projects':
            case 'assignments':
                return 'deadline'
            case 'events':
            case 'exams':
            case 'lectures':
                return 'starting'
            default:
                return
        }
    }

    Object.values(userData.events).forEach((event, i) => {
        [...event.values()].forEach((e, j) => {
            const cur = new Date(e.time);
            if (cur - currentTime < 60*60*1000 && cur > currentTime) {
                if (dismissed.includes(e.id)) return;
                dismissed.push(e.id);
                const itemType = e.type[0].toUpperCase() + e.type.slice(1,-1);
                toast(() => (
                    <>
                        <span>
                            <h3 style={{margin: 3}}> {e.title} </h3>
                            {`${itemType} ${wordToUse(e.type)} in ${parseInt((cur-currentTime) / (1000*60))} minutes `}
                        </span>
                        <button onClick={() => toast.dismiss(e.id)} style={{background: 'none', border: 'none'}}>
                            Dismiss
                        </button>
                    </>
                ),
                {
                    duration: Infinity,
                    id: e.id,
                }
            )
            }
        })
    })
}

export default checkForNotifications;