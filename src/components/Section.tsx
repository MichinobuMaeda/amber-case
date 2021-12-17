import React from 'react';
import PropTypes, { InferProps } from 'prop-types';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

const propTypes = {
  'data-testid': PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

const Section = ({
  'data-testid': dataTestid, title, children,
}: InferProps<typeof propTypes>) => (
  <Paper
    data-testid={dataTestid}
    sx={{
      my: { xs: 1, sm: 2 },
      py: 2,
      px: { xs: 1, sm: 2 },
    }}
  >
    {title && (
    <Typography variant="h3" component="div" sx={{ mb: 2 }}>
      {title}
    </Typography>
    )}
    {children}
  </Paper>
);

Section.propTypes = propTypes;

Section.defaultProps = {
  'data-testid': null,
  title: null,
};

export default Section;
