/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ArrowForward } from '@mui/icons-material';

import { i18n } from '../conf';
import { PageTitle } from '.';

describe('PageTitle', () => {
  it('show icon if given and title.', () => {
    render(<PageTitle data-testid="test01" icon={<ArrowForward />} title="test01" />);
    expect(screen.queryByTestId('ArrowForwardIcon')).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('test01'))).toBeInTheDocument();
  });
  it('show only title if icon is null.', () => {
    render(<PageTitle data-testid="test02" title="test01" />);
    expect(screen.queryByTestId('ArrowForwardIcon')).toBeNull();
    expect(screen.queryByText(i18n.t('test01'))).toBeInTheDocument();
  });
});
