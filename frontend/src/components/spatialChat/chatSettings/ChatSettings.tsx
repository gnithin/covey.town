import {
  Button,
  FormControl,
  FormLabel,
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
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Box,
  Tooltip,
} from '@chakra-ui/react';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import { MenuItem, Typography } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ChatEditorType } from '../../../classes/SpatialChat';
import constants from '../../../constants';
import {
  changeBroadcastRadius,
  changeEditorTypeAction,
} from '../../../redux/actions/chatReducerActions';
import { RootState } from '../../../redux/store';

/**
 * Component to update chat settings such as chat radius, chat editor, etc.
 * @returns Chat Settings Component
 */
export default function ChatSettings(): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const chateditorOptions = [
    { type: ChatEditorType.DEFAULT_EDITOR, text: 'Default Editor' },
    { type: ChatEditorType.RICH_TEXT_EDITOR, text: 'Rich Text Editor' },
  ];
  const dispatch = useDispatch();
  const currentEditorType: ChatEditorType = useSelector(
    (state: RootState) => state.chat.settingChatEditorType,
  );
  const [lastEditorType, setLastEditorType] = useState<string>();
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

  useEffect(() => {
    setLastEditorType(currentEditorType.toString());
  }, [currentEditorType]);

  const openSettings = () => {
    onOpen();
  };

  // Resetting the local states on close modal.
  const closeSettings = () => {
    setLastEditorType(currentEditorType.toString());
    setLastRadius(currentRadius.toString());
    onClose();
  };

  const toast = useToast();

  const isNumeric = (str: string): boolean => !Number.isNaN(Number(str));

  const validateSettings = () => {
    if (!lastRadius || lastRadius?.trim().length === 0 || !isNumeric(lastRadius) || Number(lastRadius) < 80 || Number(lastRadius) > 1000) {
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
    changeChatEditor(Number(lastEditorType));
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
      <MenuItem data-testid='' onClick={openSettings}>
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
                  {chateditorOptions.map((editor) => (
                    <option value={editor.type.toString()} key={editor.type.toString()}>
                      {editor.text}
                    </option>
                  ))}
                </Select>
              </FormControl>
              <br />
              <FormControl>
                <FormLabel htmlFor='chatRadius' >
                  Chat Radius {'  '}
                  <Tooltip
                    label="Chat radius allows you to define the 'nearness' of the spatial chat. A bigger radius size would mean that your messages will be sent to users who are further away."
                    aria-label="A tooltip"
                    fontSize="sm"
                  >
                    <QuestionOutlineIcon fontSize="sm" />
                  </Tooltip>
                </FormLabel>
                <Slider
                  aria-label="slider-ex-5"
                  onChange={(val) => {
                    setLastRadius(String(val))
                  }}
                  value={Number(lastRadius)}
                  min={80}
                  max={1000}
                  step={50}
                >
                  <SliderTrack bg="green.100">
                    <Box position="relative" right={10} />
                    <SliderFilledTrack bg="darkgreen" />
                  </SliderTrack>
                  <SliderThumb boxSize={6} />
                </Slider>
                <Box>
                  Radius size: {lastRadius} units
                </Box>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button
                data-testid='updateChatSetting'
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
