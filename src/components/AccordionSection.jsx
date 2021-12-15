import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const AccordionSection = ({
  'data-testid': dataTestid, title, children, defaultExpanded,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  return (
    <Accordion
      data-testid={dataTestid}
      expanded={expanded}
      onChange={() => { setExpanded(!expanded); }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-label={`${dataTestid}-summary`}
        aria-controls={`${dataTestid}-content`}
        id={`${dataTestid}-header`}
      >
        <Typography variant="h3" component="div" color="primary">{title}</Typography>
      </AccordionSummary>
      <AccordionDetails>
        {children}
      </AccordionDetails>
    </Accordion>
  );
};

AccordionSection.propTypes = {
  'data-testid': PropTypes.string,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  defaultExpanded: PropTypes.bool,
};

AccordionSection.defaultProps = {
  'data-testid': null,
  defaultExpanded: false,
};

export default AccordionSection;
