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
import { ChatEntry } from '../../../classes/SpatialChat';


interface IConversationView {
    chatEntry: ChatEntry;
}

const ConversationView: React.FunctionComponent<IConversationView> = ({ chatEntry }: IConversationView) => {
    const [displayMenu, setDisplayMenu] = useState(false);

    return (
        <>
            <Tag
                size="lg"
                variant="solid"
                style={{
                    backgroundColor: 'rgb(189, 255, 207)',
                    color: "#000",
                    textAlign: 'left',
                    padding: "10px",
                }}
                onMouseOver={() => {
                    setDisplayMenu(true);
                }}
                onMouseOut={() => {
                    setDisplayMenu(false);
                }}
            >
                {chatEntry.message}
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
                            <MenuGroup title="Sent To">
                                {chatEntry.receivingPlayers?.map((sentTo) => (
                                    <MenuItem key={sentTo.id} isFocusable={false}>{sentTo.userName}</MenuItem>
                                ))}
                            </MenuGroup>
                        </MenuList>
                    </Menu>
                </div>
            </Tag>
        </>
    );
};
export default ConversationView;