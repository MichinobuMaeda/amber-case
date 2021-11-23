import React, { useContext, useState } from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import SaveAlt from '@mui/icons-material/SaveAlt';
import Cancel from '@mui/icons-material/Cancel';
import { useTranslation } from 'react-i18next';

import '../conf/i18n';
import { AppContext } from '../api';
import EditButton from './EditButton';

const GroupsPanel = () => {
  const { t } = useTranslation();
  const context = useContext(AppContext);
  const [editItems, setEditItems] = useState(null);

  const onSubmit = () => {
    setEditItems(null);
  };

  const onCancel = () => {
    setEditItems(null);
  };

  return (
    <Grid container spacing={2} data-testid="groups-panel">
      <Grid item xs={12}>
        <List sx={{ width: '100%', overflow: 'auto', maxHeight: 480 }}>
          {editItems ? (
            <Grid container spacing={2}>
              <Grid item xs={12} container spacing={2} justifyContent="flex-end">
                <Grid item xs="auto">
                  <Button
                    disabled={false}
                    onClick={onSubmit}
                    aria-label="save"
                    startIcon={<SaveAlt />}
                  >
                    {t('Save')}
                  </Button>
                </Grid>
                <Grid item xs="auto">
                  <Button
                    onClick={onCancel}
                    aria-label="cancel"
                    startIcon={<Cancel />}
                    color="secondary"
                  >
                    {t('Cancel')}
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          ) : context.groups.map((group) => (
            <React.Fragment key={group.id}>
              <ListItem>
                <ListItemIcon>
                  <EditButton
                    aria-label={`${group.id}-edit`}
                    onClick={() => { setEditItems({ ...group }); }}
                  />
                </ListItemIcon>
                {context.xs ? (
                  <ListItemText
                    primary={group.name}
                    secondary={group.desc}
                  />
                ) : (
                  <>
                    <ListItemText
                      primary={group.name}
                    />
                    <ListItemText
                      secondary={group.desc}
                    />
                  </>
                )}
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Grid>
    </Grid>
  );
};

export default GroupsPanel;
