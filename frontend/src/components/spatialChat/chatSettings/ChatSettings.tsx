import React, { useState, useRef } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { Theme, useMediaQuery } from '@material-ui/core';

export default function ChatSettings() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);


  return (
    <>
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <Typography variant="body1">Chat Settings</Typography>
        </MenuItem>
    </>
  );
}
