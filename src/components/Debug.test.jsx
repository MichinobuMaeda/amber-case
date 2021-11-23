import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { resetMockService } from '../testConfig';

let mockNavigationType;
const mockUseNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigationType: jest.fn(() => mockNavigationType),
  useNavigate: () => mockUseNavigate,
}));

const mockUpdateApp = jest.fn();
jest.mock('../api', () => ({
  ...jest.requireActual('../api'),
  updateApp: mockUpdateApp,
}));

// work around for mocking problem.
const { AppContext } = require('../api');
const { Debug } = require('./indexTest');

beforeEach(() => {
  resetMockService();
});

describe('Debug', () => {
  it('show all context properties up to level 4.', async () => {
    const context = {
      typeUndefined: undefined,
      typeNull: null,
      typeEmptyArray: [],
      typeBoolean: [false, true, ['l3', ['l4', ['l5']]]],
      typeNumber: 1,
      typeString: 'text',
      typeMultiLineString: 'line 1\n line 2',
      typeFunction: () => {},
      typeDate: new Date('2020-01-01T12:34:56.789Z'),
      typeEmptyObject: {},
      typeObject: {
        level3: {
          level4: {
            level5: {},
          },
        },
      },
    };
    render(
      <AppContext.Provider value={context}>
        <div>
          <Debug />
        </div>
      </AppContext.Provider>,
    );

    expect(screen.queryByText('context: {...}')).toBeNull();

    userEvent.click(screen.getByRole('button', { label: 'debug' }));
    await waitFor(() => expect(screen.getByRole('button', { label: 'close' })).toBeInTheDocument());
    expect(screen.queryByText('context: {...}')).toBeInTheDocument();
    expect(screen.queryByText('typeUndefined: undefined')).toBeInTheDocument();
    expect(screen.queryByText('typeNull: null')).toBeInTheDocument();
    expect(screen.queryByText('typeEmptyArray: []')).toBeInTheDocument();
    expect(screen.queryByText('typeBoolean: [...]')).toBeInTheDocument();
    expect(screen.queryByText('0: (boolean) false')).toBeNull();
    expect(screen.queryByText('1: (boolean) true')).toBeNull();
    expect(screen.queryByText('typeNumber: (number) 1')).toBeInTheDocument();
    expect(screen.queryByText('typeString: (string) text')).toBeInTheDocument();
    expect(screen.queryByText('typeMultiLineString: (string) line 1 line 2')).toBeInTheDocument();
    expect(screen.queryByText('typeFunction: () => {}')).toBeInTheDocument();
    expect(screen.queryByText('typeDate: (Date) 2020-01-01T12:34:56.789Z')).toBeInTheDocument();
    expect(screen.queryByText('typeEmptyObject: {}')).toBeInTheDocument();
    expect(screen.queryByText('typeObject: {...}')).toBeInTheDocument();

    userEvent.click(screen.queryByText('typeBoolean: [...]'));
    expect(screen.queryByText('0: (boolean) false')).toBeInTheDocument();
    expect(screen.queryByText('1: (boolean) true')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { label: 'close' }));
    await waitFor(() => expect(screen.queryByText('context: {...}')).toBeNull());
  });
});
