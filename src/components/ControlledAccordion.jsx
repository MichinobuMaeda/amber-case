import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMore from '@mui/icons-material/ExpandMore';

const ControlledAccordion = ({ panels, expanded, onChange }) => {
  const handleChange = (id) => (event, isExpanded) => {
    if (isExpanded) onChange(id);
  };

  return (
    <>
      {panels.map((panel) => (
        <Accordion
          key={panel.id}
          expanded={expanded === panel.id}
          onChange={handleChange(panel.id)}
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`${panel.id}-body`}
            data-testid={`${panel.id}-title`}
            id={`${panel.id}-header`}
          >
            <Typography color="primary" variant="h3">{panel.title}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {panel.body}
          </AccordionDetails>
        </Accordion>
      ))}
    </>
  );
};

ControlledAccordion.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  panels: PropTypes.array.isRequired,
  expanded: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

ControlledAccordion.defaultProps = {
};

export default ControlledAccordion;
