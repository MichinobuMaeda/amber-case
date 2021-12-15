import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { initialieMock } from '../setupTests';
import AppContext from '../api/AppContext';
import Debug from './Debug';

beforeEach(() => {
  initialieMock();
});

describe('Debug', () => {
  it('show all context properties up to level 4.', async () => {
    const context = () => ({
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
    });
    render(
      <AppContext.Provider value={context()}>
        <Debug />
      </AppContext.Provider>,
    );

    expect(screen.queryByText('context: {...}')).toBeNull();

    userEvent.click(screen.getByRole('button', { label: 'debug' }));
    expect(await screen.findByRole('button', { label: 'close' })).toBeInTheDocument();
    expect(screen.getByText('context: {...}')).toBeInTheDocument();
    expect(screen.getByText('typeUndefined: undefined')).toBeInTheDocument();
    expect(screen.getByText('typeNull: null')).toBeInTheDocument();
    expect(screen.getByText('typeEmptyArray: []')).toBeInTheDocument();
    expect(screen.getByText('typeBoolean: [...]')).toBeInTheDocument();
    expect(screen.queryByText('0: (boolean) false')).toBeNull();
    expect(screen.queryByText('1: (boolean) true')).toBeNull();
    expect(screen.getByText('typeNumber: (number) 1')).toBeInTheDocument();
    expect(screen.getByText('typeString: (string) text')).toBeInTheDocument();
    expect(screen.getByText('typeMultiLineString: (string) line 1 line 2')).toBeInTheDocument();
    expect(screen.getByText('typeFunction: () => {}')).toBeInTheDocument();
    expect(screen.getByText('typeDate: (Date) 2020-01-01T12:34:56.789Z')).toBeInTheDocument();
    expect(screen.getByText('typeEmptyObject: {}')).toBeInTheDocument();
    expect(screen.getByText('typeObject: {...}')).toBeInTheDocument();

    userEvent.click(screen.queryByText('typeBoolean: [...]'));
    expect(screen.getByText('0: (boolean) false')).toBeInTheDocument();
    expect(screen.getByText('1: (boolean) true')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { label: 'close' }));
    await waitFor(() => expect(screen.queryByText('context: {...}')).toBeNull());
  });
});
