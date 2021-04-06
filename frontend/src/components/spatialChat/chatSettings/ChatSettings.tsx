import React, { useState, useRef } from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { Theme, useMediaQuery } from '@material-ui/core';
import DeviceSelectionDialog from '../../DeviceSelectionDialog/DeviceSelectionDialog';

export default function Menu(props: { buttonClassName?: string }) {
  const isMobile = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'));
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const anchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
        <MenuItem onClick={() => setSettingsOpen(true)}>
          <Typography variant="body1">Chat Settings</Typography>
        </MenuItem>
      <DeviceSelectionDialog
        open={settingsOpen}
        onClose={() => {
          setSettingsOpen(false);
          setMenuOpen(false);
        }}
      />
    </>
  );
}
