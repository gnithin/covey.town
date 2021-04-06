import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {MenuItem, FormControl, Select, Typography} from '@material-ui/core';
import {
    Button,
    FormLabel,    
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    useDisclosure,
    useToast
  } from '@chakra-ui/react';
import { changeEditorTypeAction } from '../../../redux/actions/chatReducerActions'
import { ChatEditorType } from '../../../classes/SpatialChat';

export default function ChatSettings() {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const chateditorOptions = [
      {type: ChatEditorType.DEFAULT_EDITOR, text: 'Default Editor'},
      {type: ChatEditorType.RICH_TEXT_EDITOR, text: 'Rich Text Editor'}
    ]
  const dispatch = useDispatch();
  const changeChatEditor = (editorType: ChatEditorType) => {
    dispatch(
        changeEditorTypeAction (editorType)
    );
  };
  
  const openSettings = useCallback(()=>{
    onOpen();    
  }, [onOpen]);

  const closeSettings = useCallback(()=>{
    onClose();    
  }, [onClose]);

  const updateSettings = () => {      
    changeChatEditor(ChatEditorType.RICH_TEXT_EDITOR);
    closeSettings();
  };
  const doNothing = () => {          
    changeChatEditor(ChatEditorType.RICH_TEXT_EDITOR);
  };


  return (
    <>
        <MenuItem onClick={openSettings}>
          <Typography variant="body1">Chat Settings</Typography>
        </MenuItem>
        <Modal isOpen={isOpen} onClose={closeSettings} >
      <ModalOverlay/>
      <ModalContent>
        <ModalHeader>Edit Chat Settings</ModalHeader>
        <ModalCloseButton/>
        <form onSubmit={(ev)=>{ev.preventDefault(); updateSettings(); }}>
          <ModalBody pb={6}>
          <FormControl fullWidth>
          <Typography variant="subtitle2" gutterBottom>
            Chat Editor Type
          </Typography>
            <Select       
            
            onChange={(e) => doNothing() } variant ="outlined"
          >
            {chateditorOptions.map((editor) => (
              <MenuItem  key={editor.type.toString()}>
                {editor.text}
              </MenuItem>
            ))}
          </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="chatRadius">Chat Radius</FormLabel>
              <Input data-testid="chatRadius" id="chatRadius" placeholder="80" name="chatRadius" type="text"  />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button data-testid='updatebutton' colorScheme="blue" mr={3} value="update" name='action2' onClick={()=>updateSettings()} >
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
