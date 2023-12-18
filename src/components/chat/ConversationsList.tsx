/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { mainApi } from '@/api/main_api'
import * as apiEndpoints from '@/api/api_endpoints'
import { Box, Typography } from '@mui/material'

import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css'
import { Avatar, Conversation, ConversationList } from '@chatscope/chat-ui-kit-react'
import { useEffect, useState } from 'react'

export interface ConversationItem {
    conversationId: string;
    customerId: string;
    customerEmail: string;
    customerFirstName: string;
    customerLastName: string;
    customerAvatar: string;
}

const ConversationsList = ({ currentUser, currentConversation, setCurrentConversation }: any) => {
    const [allConversations, setAllConversations] = useState<ConversationItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const getAllConversations = async () => {
        setIsLoading(true);

        try {
            const conversationsList = await mainApi.get(
                apiEndpoints.GET_ALL_CONVERSATIONS,
                apiEndpoints.getAccessToken(currentUser.token)
            );

            const result: ConversationItem[] = [];

            for (const i in conversationsList.data.data) {
                const conversation = conversationsList.data.data[i];

                const customer = await mainApi.get(
                    apiEndpoints.GET_CUSTOMER(conversation.customerId)
                );

                let avatarUrl = "";

                if (customer.data.data.customerProvider === "Google") {
                    avatarUrl = "https://i.pinimg.com/564x/fb/52/e3/fb52e39c5910bdbcc3b98d58d6ca6944--softball-catcher-avatar.jpg";
                } else {
                    if (customer.data.data.customerAvatar) {
                        const avatar = await mainApi.get(
                            apiEndpoints.GET_CUSTOMER_AVATAR(conversation.customerId)
                        );
    
                        avatarUrl = avatar.data.data;
                    } else
                        avatarUrl = "https://static.vecteezy.com/system/resources/previews/009/734/564/original/default-avatar-profile-icon-of-social-media-user-vector.jpg";
                }

                const item: ConversationItem = {
                    conversationId: conversation._id,
                    customerId: customer.data.data._id,
                    customerEmail: customer.data.data.customerEmail,
                    customerFirstName: customer.data.data.customerFirstName,
                    customerLastName: customer.data.data.customerLastName,
                    customerAvatar: avatarUrl
                };

                result.push(item);
            }

            setAllConversations(result);
            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    const handleChangeConversation = (item: ConversationItem) => {
        setCurrentConversation(item);
    }

    useEffect(() => {
        if (currentUser) {
            if (allConversations.length == 0)
                getAllConversations();
        }
    }, [currentUser]);

    return (
        <Box width="100%" height="100%" className="overflow-hidden">
            <Box width="100%" height="10%" display="flex" justifyContent="center" alignItems="center">
                <Typography sx={{
                        fontWeight: "medium",
                        fontSize: "1.2rem",
                        whiteSpace: "nowrap",
                        textAlign: "right"
                    }}
                    className="text-primary-0">
                        Danh sách cuộc trò chuyện
                </Typography>
            </Box>
            <Box width="100%" height="90%">
                <ConversationList loading={isLoading} scrollable={false} className="overflow-y-auto">
                    {allConversations.map((item: ConversationItem, index: number) => (
                        <Conversation
                            key={index}
                            className="cursor-pointer"
                            name={item.customerLastName + " " + item.customerFirstName}
                            lastSenderName={item.customerFirstName}
                            info="Hello my best friend, come to my house at 5 o'clock !"
                            unreadCnt={9999}
                            active={item.conversationId === currentConversation.conversationId}
                            onClick={() => handleChangeConversation(item)}>
                                <Avatar
                                    src={item.customerAvatar}
                                    name={item.customerFirstName} />
                        </Conversation>
                    ))}
                </ConversationList>
            </Box>
        </Box>
    )
}

export default ConversationsList;