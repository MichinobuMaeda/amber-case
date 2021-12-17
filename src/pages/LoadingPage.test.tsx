import {
  render, screen,
} from '@testing-library/react';
import React from 'react';

import { i18n } from '../conf';
import { initializeMock, mockContext } from '../setupTests';
import AppContext from '../api/AppContext';
import { Conf } from '../api/models';
import LoadingPage from './LoadingPage';

beforeEach(() => {
  initializeMock();
});

describe('LoadingPage', () => {
  it('shows error message on failure to load conf.', async () => {
    mockContext.conf = { error: true } as Conf;
    render(
      <AppContext.Provider value={mockContext}>
        <LoadingPage />
      </AppContext.Provider>,
    );

    expect(screen.queryByText(`${i18n.t('loading config')}`)).toBeNull();
    expect(screen.getByText(`${i18n.t('failed to load config')}`)).toBeInTheDocument();
  });

  it('shows loading message without failure status.', async () => {
    mockContext.conf = {} as Conf;
    render(
      <AppContext.Provider value={mockContext}>
        <LoadingPage />
      </AppContext.Provider>,
    );

    expect(screen.getByText(`${i18n.t('loading config')}`)).toBeInTheDocument();
    expect(screen.queryByText(`${i18n.t('failed to load config')}`)).toBeNull();
  });
});
