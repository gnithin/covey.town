import {
    Tag,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { ChatEntry } from '../../../classes/SpatialChat';

interface IConversationView {
    chatEntry: ChatEntry;
    loggedInUsername: string;
}

const ConversationView: React.FunctionComponent<IConversationView> = (
    { chatEntry, loggedInUsername }: IConversationView
) => {
    const [displayMenu, setDisplayMenu] = useState(false);

    const renderMenuItems = () => {
        if (chatEntry.sender.userName === loggedInUsername) {
            return (
                <MenuGroup title="Sent To">
                    {chatEntry.receivingPlayers?.map((sentTo) => (
                        <MenuItem key={sentTo.id} isFocusable={false}>{sentTo.userName}</MenuItem>
                    ))}
                </MenuGroup>
            )
        }

        // TODO: This needs to be done :)
        return (
            <MenuItem>Block User</MenuItem>
        )
    };

    return (
        <>
            <Tag
                size="lg"
                variant="solid"
                style={{
                    backgroundColor: 'rgb(189, 255, 207)',
                    color: "#000",
                    textAlign: 'left',
                }}
                onMouseOver={() => {
                    setDisplayMenu(true);
                }}
                onMouseOut={() => {
                    setDisplayMenu(false);
                }}
            >
                {/* eslint-disable-next-line react/no-danger */}
                <span dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(chatEntry.message) }}
                    className="ql-editor"
                    style={{
                        padding: "10px"
                    }}
                />

                <div
                    className="menu"
                    style={{
                        display: displayMenu ? "block" : "none",
                    }}
                >
                    <Menu size="sm">
                        <MenuButton>
                            <ChevronDownIcon />
                        </MenuButton>
                        <MenuList>
                            {renderMenuItems()}
                        </MenuList>
                    </Menu>
                </div>
            </Tag>
        </>
    );
};
export default ConversationView;