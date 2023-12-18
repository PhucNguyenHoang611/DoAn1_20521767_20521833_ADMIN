/* eslint-disable react-hooks/exhaustive-deps */
import { hostURL } from '@/api/main_api'
import ConversationsList from '@/components/chat/ConversationsList'
import MessageBox from '@/components/chat/MessageBox'
import { Box } from '@mui/material'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'
import { io } from 'socket.io-client'

import { ConversationItem } from '@/components/chat/ConversationsList'

const Chat = () => {
    const socket = io(hostURL);
    const [currentConversation, setCurrentConversation] = useState<ConversationItem>({
        conversationId: "",
        customerId: "",
        customerEmail: "",
        customerFirstName: "",
        customerLastName: "",
        customerAvatar: ""
    });
    const currentUser = useSelector((state: RootState) => state.auth.currentUser);

    useEffect(() => {
        if (currentConversation.conversationId !== "") {
            socket.emit("addUser", "ADMIN-SOCKET");
        }
    }, [currentConversation]);

    return (
        <Box width="100%" height="90%" className="p-10">
            <Box width="100%" height="100%" display="flex" className="border-2 shadow-xl">
                <Box width="25%" height="100%" className="border-r-2">
                    <ConversationsList
                        currentUser={currentUser}
                        currentConversation={currentConversation}
                        setCurrentConversation={setCurrentConversation} />
                </Box>
                <Box width="75%" height="100%">
                    <MessageBox
                        socket={socket}
                        currentUser={currentUser}
                        currentConversation={currentConversation} />
                </Box>
            </Box>
        </Box>
    )
}

export default Chat;