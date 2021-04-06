import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    MenuItem, Typography
  } from '@material-ui/core';
import {
    Button,
    FormLabel,  
    FormControl, Select , 
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
import { changeEditorTypeAction, changeBroadcastRadius } from '../../../redux/actions/chatReducerActions'
import { ChatEditorType } from '../../../classes/SpatialChat';
import { RootState } from '../../../redux/store'

export default function ChatSettings() {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const chateditorOptions = [
      {type: ChatEditorType.DEFAULT_EDITOR, text: 'Default Editor'},
      {type: ChatEditorType.RICH_TEXT_EDITOR, text: 'Rich Text Editor'}
    ]
  const dispatch = useDispatch();  
  const localEditorType: ChatEditorType = useSelector((state: RootState) => state.chat.settingChatEditorType);
  const [lastEditorType, setLastEditorType] = useState<string>(
    localEditorType.toString()
  );
  const localRadius: number = useSelector((state: RootState) => state.chat.settingChatBroadcastRadius);
  const [lastRadius, setLastRadius] = useState<number>(
    localRadius
  );
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
    if(lastEditorType === '1')    
    changeChatEditor(ChatEditorType.DEFAULT_EDITOR);
    else
    changeChatEditor(ChatEditorType.RICH_TEXT_EDITOR);
    changeBroadcastRadius(lastRadius);
    closeSettings();
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
          <FormLabel>
            Chat Editor Type
          </FormLabel>
            <Select       
            value ={lastEditorType }
            onChange={(e) => setLastEditorType(e.target.value) }  >
            {chateditorOptions.map((editor, index) => (
              <option value={editor.type.toString()} key={editor.type.toString()}>
                {editor.text}
              </option>
            ))}
          </Select>
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="chatRadius">Chat Radius</FormLabel>
              <Input data-testid="chatRadius" id="chatRadius" placeholder="80"
              value = {lastRadius  }
              onChange = {(e) => setLastRadius(Number(e.target.value))}
              name="chatRadius" type="text"  />
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
