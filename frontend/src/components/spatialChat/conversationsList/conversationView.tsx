import {
    Tag,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuGroup,
    Switch,
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import React, { useState } from 'react';
import DOMPurify from 'dompurify';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/store'
import { ChatEntry } from '../../../classes/SpatialChat';
import { blockPlayerAction, unblockPlayerAction } from '../../../redux/actions';
import useCoveyAppState from '../../../hooks/useCoveyAppState';

interface IConversationView {
    chatEntry: ChatEntry;
    loggedInPlayerID: string;
}

const ConversationView: React.FunctionComponent<IConversationView> = (
    { chatEntry, loggedInPlayerID }: IConversationView
) => {
    const [displayMenu, setDisplayMenu] = useState(false);
    const blockedPlayerIds: string[] = useSelector((state: RootState) => state.chat.blockedPlayerIds);
    const { socket } = useCoveyAppState();
    const dispatch = useDispatch();

    const onToggleBlock = () => {
        if (blockedPlayerIds.includes(chatEntry.sender.id)) {
            dispatch(unblockPlayerAction(chatEntry.sender.id));
            socket?.emit('unblockPlayerInChat', chatEntry.sender.id);
        } else {
            dispatch(blockPlayerAction(chatEntry.sender.id));
            socket?.emit('blockPlayerInChat', chatEntry.sender.id);
        }
    }

    const renderMenuItems = () => {
        if (chatEntry.sender.id === loggedInPlayerID) {
            return (
                <MenuGroup title="Sent To">
                    {chatEntry.receivingPlayers?.map((sentTo) => (
                        <MenuItem key={sentTo.id} isFocusable={false}>{sentTo.userName}</MenuItem>
                    ))}
                </MenuGroup>
            )
        }

        return (
            <MenuItem>
                <div style={{display: "flex", justifyContent: "space-between", width: "100%"}}>
                    <p>Block Player</p>
                    <Switch
                        size="md"
                        colorScheme="red"
                        isChecked={blockedPlayerIds.includes(chatEntry.sender.id)}
                        onChange={onToggleBlock}
                    />
                </div>
            </MenuItem>
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
                    <Menu size="sm" closeOnSelect={false}>
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