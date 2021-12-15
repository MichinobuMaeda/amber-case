import React, { useContext, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import BugReport from '@mui/icons-material/BugReport';
import Close from '@mui/icons-material/Close';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ChevronRight from '@mui/icons-material/ChevronRight';

import AppContext from '../api/AppContext';

const makeTree = (base, name, src) => {
  const level = (base.match(/:/g) || []).length;
  const levelMax = 4;
  const primitives = ['boolean', 'string', 'symbol', 'number', 'bigint'];
  const key = `${base}:${name}`;
  if (typeof src === 'function') {
    return (
      <TreeItem
        key={key}
        nodeId={key}
        label={`${name}: () => {}`}
      />
    );
  }
  if (Array.isArray(src)) {
    return (
      <TreeItem
        key={key}
        nodeId={key}
        label={`${name}: ${src.length ? '[...]' : '[]'}`}
      >
        {level < levelMax
          ? src.map((item, index) => makeTree(key, index, item))
          : '...'}
      </TreeItem>
    );
  }
  if (typeof src === 'undefined') {
    return (
      <TreeItem
        key={key}
        nodeId={key}
        label={`${name}: undefined`}
      />
    );
  }
  if (src === null) {
    return (
      <TreeItem
        key={key}
        nodeId={key}
        label={`${name}: null`}
      />
    );
  }
  if (src instanceof Date) {
    return (
      <TreeItem
        key={key}
        nodeId={key}
        label={`${name}: (Date) ${src.toISOString()}`}
      />
    );
  }
  if (primitives.includes(typeof src)) {
    return (
      <TreeItem
        key={key}
        nodeId={key}
        label={`${name}: (${typeof src}) ${src}`}
      />
    );
  }
  return (
    <TreeItem
      key={key}
      nodeId={key}
      label={`${name}: ${Object.keys(src).length ? '{...}' : '{}'}`}
    >
      {level < levelMax
        ? [...Object.keys(src)].sort().map((k) => makeTree(key, k, src[k]))
        : '...'}
    </TreeItem>
  );
};

const Debug = () => {
  const context = useContext(AppContext);
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = React.useState([':context']);
  const handleToggle = (event, nodeIds) => {
    setExpanded(nodeIds);
  };

  return (
    <>
      <IconButton
        aria-label="debug"
        color="inherit"
        onClick={() => setOpen(true)}
      >
        <BugReport />
      </IconButton>
      <Dialog
        fullScreen
        open={open}
      >
        <Toolbar variant="dense">
          <BugReport sx={{ mr: 0.5 }} />
          <Typography variant="h1" component="div" sx={{ flexGrow: 1 }}>
            Debug
          </Typography>
          <IconButton
            edge="start"
            onClick={() => setOpen(false)}
            aria-label="close"
          >
            <Close />
          </IconButton>
        </Toolbar>

        <TreeView
          aria-label="status"
          defaultCollapseIcon={<ExpandMore />}
          defaultExpandIcon={<ChevronRight />}
          expanded={expanded}
          onNodeToggle={handleToggle}
        >
          {makeTree('', 'context', context)}
        </TreeView>
      </Dialog>
    </>
  );
};

export default Debug;
