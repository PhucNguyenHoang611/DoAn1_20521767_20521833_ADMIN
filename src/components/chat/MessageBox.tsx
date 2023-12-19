/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { mainApi, baseURL } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Box, Typography } from '@mui/material';

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { Avatar, ChatContainer, ConversationHeader, InfoButton, Message, MessageInput, MessageList } from '@chatscope/chat-ui-kit-react';
import { useEffect, useState } from 'react';
import CustomerDetailsModal from '../modals/customer/CustomerDetailsModal';
import axios from 'axios';

export interface MessageItem {
    conversationId: string;
    senderId: string;
    messageText: string;
    messageSentDate: Date;
}

const MessageBox = ({ setOutgoingMessage, arrivalMessage, setArrivalMessage, socket, currentUser, currentConversation }: any) => {
    const [openDetailsModal, setOpenDetailsModal] = useState(false);
    const [allMessages, setAllMessages] = useState<MessageItem[]>([]);

    // const [arrivalMessage, setArrivalMessage] = useState<MessageItem>({
    //     conversationId: "",
    //     senderId: "",
    //     messageText: "",
    //     messageSentDate: new Date()
    // });

    const [inputMessage, setInputMessage] = useState("");

    const getAllMessages = async () => {
        try {
            const messages = await mainApi.get(
                apiEndpoints.GET_ALL_MESSAGES(currentConversation.conversationId)
            );

            const result: MessageItem[] = [];

            for (const i in messages.data.data) {
                const message = messages.data.data[i];

                const item: MessageItem = {
                    conversationId: message.conversationId,
                    senderId: message.senderId,
                    messageText: message.messageText,
                    messageSentDate: new Date(message.messageSentDate)
                };

                result.push(item);
            }

            setAllMessages(result);
        } catch (error) {
            console.log(error);
        }
    }

    const markAllMessagesAsRead = async () => {
        try {
            await axios({
                method: "PUT",
                url: `${baseURL}/messages/markAllMessagesAsRead/${currentConversation.conversationId}`,
                headers: {
                    Authorization: "Bearer " + currentUser.token
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleSendMessage = async () => {
        try {
            // Store message to database
            await mainApi.post(
                apiEndpoints.CREATE_MESSAGE,
                apiEndpoints.getCreateMessageBody(currentConversation.conversationId, currentUser.id, inputMessage)
            );

            // Use socket to send message
            socket.emit("sendMessage", {
                conversationId: currentConversation.conversationId,
                senderId: "ADMIN-SOCKET",
                receiverId: currentConversation.customerId,
                messageText: inputMessage
            });

            // Set outgoing message
            setOutgoingMessage({
                conversationId: currentConversation.conversationId,
                senderId: currentUser.id,
                messageText: inputMessage,
                messageSentDate: new Date()
            });

            // Update allMessages array
            const messages: MessageItem[] = [...allMessages];
            messages.push({
                conversationId: currentConversation.conversationId,
                senderId: currentUser.id,
                messageText: inputMessage,
                messageSentDate: new Date()
            });
            setAllMessages(messages);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if (currentConversation.conversationId !== "") {
            markAllMessagesAsRead();
            getAllMessages();
        }
    }, [currentConversation]);

    useEffect(() => {
        if (socket) {
            socket.on("receiveMessage", (sender: string, text: string) => {
                if (sender === currentConversation.customerId) {
                    setArrivalMessage({
                        conversationId: currentConversation.conversationId,
                        senderId: sender,
                        messageText: text,
                        messageSentDate: new Date()
                    });
                }
            });
        }
    }, [socket]);

    useEffect(() => {
        (arrivalMessage.conversationId !== "") && setAllMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage]);

    return (
        <Box width="100%" height="100%">
            {currentConversation.conversationId === "" ? (
                <Box width="100%" height="100%" display="flex" justifyContent="center" alignItems="center">
                    <Typography sx={{
                            fontWeight: "medium",
                            fontSize: "1.5rem",
                            whiteSpace: "nowrap",
                            textAlign: "right"
                        }}>
                            Hãy chọn một cuộc trò chuyện để bắt đầu
                    </Typography>
                </Box>
            ) : (
                <>
                    <ChatContainer>
                        <ConversationHeader>
                            <Avatar
                                src={currentConversation.customerAvatar}
                                name={currentConversation.customerFirstName} />

                            <ConversationHeader.Content
                                userName={currentConversation.customerLastName + " " + currentConversation.customerFirstName} />

                            <ConversationHeader.Actions>
                                <InfoButton className="text-primary-1" onClick={() => setOpenDetailsModal(true)} />
                            </ConversationHeader.Actions>
                        </ConversationHeader>

                        <MessageList className="p-2">
                            {allMessages.length == 0 ? (
                                <MessageList.Content style={{
                                    display: "flex",
                                    "flexDirection": "column",
                                    "justifyContent": "center",
                                    height: "100%",
                                    textAlign: "center",
                                    fontSize: "1.3em"
                                  }}>
                                    Gửi tin nhắn để bắt đầu cuộc trò chuyện
                                </MessageList.Content>
                            ) : (
                                <MessageList.Content>
                                    {allMessages.map((item: MessageItem, index: number) => (
                                        <Message
                                            key={index}
                                            model={{
                                                message: item.messageText,
                                                sentTime: item.messageSentDate.toLocaleDateString(),
                                                direction: item.senderId === currentConversation.customerId ? "incoming" : "outgoing",
                                                position: "normal"
                                            }}
                                            className={item.senderId === currentConversation.customerId ? "incoming-message" : "outgoing-message"}
                                            avatarSpacer={
                                                (item.senderId === currentConversation.customerId)
                                                    && (item.senderId === allMessages[index + 1]?.senderId) ? true : false
                                            }>
                                                {(item.senderId === currentConversation.customerId)
                                                    && (item.senderId !== allMessages[index + 1]?.senderId)
                                                    && (
                                                    <Avatar
                                                        src={currentConversation.customerAvatar}
                                                        name={currentConversation.customerFirstName} />
                                                )}
                                        </Message>
                                    ))}
                                </MessageList.Content>
                            )}
                        </MessageList>

                        <MessageInput
                            placeholder="Nhập tin nhắn ở đây..."
                            attachButton={false}
                            onChange={(message: string) => setInputMessage(message)}
                            onSend={handleSendMessage} />
                    </ChatContainer>
                    <CustomerDetailsModal customerId={currentConversation.customerId} isModalOpen={openDetailsModal} setIsModalOpen={setOpenDetailsModal} />
                </>
            )}
        </Box>
    )
}

export default MessageBox;