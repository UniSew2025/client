import {useLocation} from "react-router-dom";
import ChatUI from "../ui/chat/ChatUI.jsx";

export default function RequestDetail({ initComments}) {

    const location = useLocation();



    return (

        <ChatUI requestId={location.state?.requestId}
                packageId={location.state?.packageId}
                initComments={initComments}
                />
    );
}
