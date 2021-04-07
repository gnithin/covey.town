import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { MenuItem, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatEditorType } from '../../../classes/SpatialChat';
import {
  changeBroadcastRadius,
  changeEditorTypeAction,
} from '../../../redux/actions/chatReducerActions';
import { RootState } from '../../../redux/store';

/**
 * Component to update chat settings such as chat radius, chat editor, etc.
 * @returns Chat Settings Component
 */
export default function ChatSettings() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chateditorOptions = [
    { type: ChatEditorType.DEFAULT_EDITOR, text: 'Default Editor' },
    { type: ChatEditorType.RICH_TEXT_EDITOR, text: 'Rich Text Editor' },
  ];
  const dispatch = useDispatch();
  const currentEditorType: ChatEditorType = useSelector(
    (state: RootState) => state.chat.settingChatEditorType,
  );
  const [lastEditorType, setLastEditorType] = useState<string | null>();
  const currentRadius: number = useSelector(
    (state: RootState) => state.chat.settingChatBroadcastRadius,
  );
  const [lastRadius, setLastRadius] = useState<string>();

  const changeChatEditor = (editorType: ChatEditorType) => {
    dispatch(changeEditorTypeAction(editorType));
  };
  const changeChatRadius = (radius: number) => {
    dispatch(changeBroadcastRadius(radius));
  };
  useEffect(() => {
    setLastRadius(currentRadius.toString());
  }, [currentRadius]);

  const openSettings = () => {
    onOpen();
  };

  // Resetting the local states on close modal.
  const closeSettings = () => {
    setLastEditorType(null);
    setLastRadius(currentRadius.toString());
    onClose();
  };

  const toast = useToast();

  const isNumeric = (str: any): boolean =>  !Number.isNaN(Number(str));

  const validateSettings = () => {
    if (!lastRadius || lastRadius?.trim().length === 0 || !isNumeric(lastRadius) ||  Number(lastRadius) < 80 || Number(lastRadius) > 1000)
     {
      toast({
        title: 'Unable to update chat settings',
        description: 'Broadcast Radius should be between 80 and 1000',
        status: 'error',
      });
      return false;
    }
    return true;
  };

  const updateChatEditor = () => {
    if (lastEditorType === '1') {
      changeChatEditor(ChatEditorType.DEFAULT_EDITOR);
    } else {
      changeChatEditor(ChatEditorType.RICH_TEXT_EDITOR);
    }
  };
  const updateChatRadius = () => {
    if (lastRadius) {
      changeChatRadius(Number(lastRadius));
    }
  };

  const updateSettings = () => {
    try {
      if (validateSettings()) {
        updateChatEditor();
        updateChatRadius();
        toast({
          title: 'Chat Settings Updated',
          status: 'success',
        });
        closeSettings();
      }
    } catch (err) {
      toast({
        title: 'Unable to update chat settings',
        description: err.toString(),
        status: 'error',
      });
    }
  };

  return (
    <>
      <MenuItem onClick={openSettings}>
        <Typography variant='body1'>Chat Settings</Typography>
      </MenuItem>
      <Modal isOpen={isOpen} onClose={closeSettings}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Chat Settings</ModalHeader>
          <ModalCloseButton />
          <form
            onSubmit={ev => {
              ev.preventDefault();
              updateSettings();
            }}>
            <ModalBody pb={8}>
              <FormControl fullWidth>
                <FormLabel>Chat Editor Type</FormLabel>
                <Select
                  value={lastEditorType || currentEditorType.toString()}
                  onChange={e => setLastEditorType(e.target.value)}>
                  {chateditorOptions.map((editor, index) => (
                    <option value={editor.type.toString()} key={editor.type.toString()}>
                      {editor.text}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel htmlFor='chatRadius'>Chat Radius</FormLabel>
                <Input
                  data-testid='chatRadius'
                  id='chatRadius'
                  placeholder='80'
                  value={lastRadius}
                  onChange={e => setLastRadius(e.target.value)}
                  name='chatRadius'
                  type='text'
                />
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                data-testid='updatebutton'
                colorScheme='blue'
                mr={3}
                value='update'
                name='action2'
                onClick={() => updateSettings()}>
                Update
              </Button>
              <Button onClick={closeSettings}>Cancel</Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
