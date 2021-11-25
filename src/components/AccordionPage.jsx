import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid';

import '../conf/i18n';
import { AppContext } from '../api';
import PageTitle from './PageTitle';
import ControlledAccordion from './ControlledAccordion';

const AccordionPage = ({
  'data-testid': dataTestid, icon, title, route, panels,
}) => {
  const context = useContext(AppContext);
  const navigate = useNavigate();
  const params = useParams();

  const handleOnChangePanel = (id) => {
    navigate(`/${route}/${id}`);
  };

  return (
    <Grid container spacing={2} data-testid={dataTestid}>
      <Grid item xs={12}>
        <PageTitle icon={icon} title={title} />
      </Grid>
      <Grid item xs={12}>
        <ControlledAccordion
          panels={panels.filter((panel) => panel.priv(context))}
          expanded={params.panel}
          onChange={handleOnChangePanel}
        />
      </Grid>
    </Grid>
  );
};

AccordionPage.propTypes = {
  'data-testid': PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  title: PropTypes.string.isRequired,
  route: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  panels: PropTypes.array.isRequired,
};

export default AccordionPage;
