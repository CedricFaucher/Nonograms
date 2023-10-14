export default function UndoRedo(props) {
    const {
        squareSize,
        setCurrentAction,
        setActionsQueue,
        setRedoQueue,
        actionsQueue,
        redoQueue
    } = props;

    return (
        <table>
            <tbody>
                <tr>
                <td 
                    align="center"
                    padding="none"
                    onClick={() => {
                        if (actionsQueue.length > 0) {
                            setCurrentAction(actionsQueue[actionsQueue.length - 1]);
                            setRedoQueue(prev => [ actionsQueue[actionsQueue.length - 1], ...prev ]);
                            setActionsQueue(prev => [ ...prev.slice(0, -1) ]);
                        }
                    }}
                    style={{ 
                            border: "1px gray solid",
                            borderCollapse: "collapse",
                            cursor: "pointer",
                            width: squareSize,
                            height: squareSize,
                            fontSize: squareSize / 2
                        }}
                >
                    {"<-"}
                </td>
                <td 
                    align="center"
                    padding="none"
                    onClick={() => {
                        if (redoQueue.length > 0) {
                            setCurrentAction(redoQueue[0]);
                            setActionsQueue(prev => [ ...prev, redoQueue[0] ]);
                            setRedoQueue(prev => [ ...prev.slice(1) ]);
                        }
                    }}
                    style={{ 
                            border: "1px gray solid",
                            borderCollapse: "collapse",
                            cursor: "pointer",
                            width: squareSize,
                            height: squareSize,
                            fontSize: squareSize / 2
                        }}
                >
                    {"->"}
                </td>
                </tr>
            </tbody>
        </table>
    );
}