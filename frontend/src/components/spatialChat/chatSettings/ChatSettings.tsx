import React, { useState, useCallback } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import {
    Button,
    Checkbox,
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
    useDisclosure,
    useToast
  } from '@chakra-ui/react';

export default function ChatSettings() {
  const {isOpen, onOpen, onClose} = useDisclosure()
  
  const openSettings = useCallback(()=>{
    onOpen();    
  }, [onOpen]);

  const closeSettings = useCallback(()=>{
    onClose();    
  }, [onClose]);


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
        <form onSubmit={(ev)=>{ev.preventDefault(); }}>
          <ModalBody pb={6}>
            <FormControl mt={4}>
              <FormLabel htmlFor='isRichTextEditor'>Rich Text Editor</FormLabel>
              <Checkbox id="isRichTextEditor" name="isRichTextEditor"/>
            </FormControl>
            <FormControl isRequired>
              <FormLabel htmlFor="chatRadius">Chat Radius</FormLabel>
              <Input data-testid="chatRadius" id="chatRadius" placeholder="80" name="chatRadius" type="text"  />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button data-testid='updatebutton' colorScheme="blue" mr={3} value="update" name='action2' >
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
