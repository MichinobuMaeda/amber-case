import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '../testConfig';

// work around for mocking problem.
const { ControlledAccordion } = require('./exportForTest');

describe('ControlledAccordion', () => {
  it('shows all panels and handles click event of the closed title.', () => {
    const mockOnChang = jest.fn();
    render(
      <ControlledAccordion
        panels={[
          {
            id: 'panel01',
            title: 'Panel 01 title',
            body: <div>Panel 01 body</div>,
          },
          {
            id: 'panel02',
            title: 'Panel 02 title',
            body: <div>Panel 02 body</div>,
          },
          {
            id: 'panel03',
            title: 'Panel 03 title',
            body: <div>Panel 03 body</div>,
          },
        ]}
        expanded="panel02"
        onChange={mockOnChang}
      />,
    );

    expect(screen.queryByText('Panel 01 title')).toBeInTheDocument();
    expect(screen.queryByText('Panel 02 title')).toBeInTheDocument();
    expect(screen.queryByText('Panel 03 title')).toBeInTheDocument();
    expect(screen.queryByText('Panel 01 body')).toBeInTheDocument();
    expect(screen.queryByText('Panel 02 body')).toBeInTheDocument();
    expect(screen.queryByText('Panel 03 body')).toBeInTheDocument();

    userEvent.click(screen.queryByTestId('panel01-title'));
    expect(mockOnChang.mock.calls.length).toEqual(1);
    expect(mockOnChang.mock.calls[0][0]).toEqual('panel01');

    userEvent.click(screen.queryByTestId('panel02-title'));
    expect(mockOnChang.mock.calls.length).toEqual(1);

    userEvent.click(screen.queryByTestId('panel03-title'));
    expect(mockOnChang.mock.calls.length).toEqual(2);
    expect(mockOnChang.mock.calls[1][0]).toEqual('panel03');

    userEvent.click(screen.queryByTestId('panel01-title'));
    expect(mockOnChang.mock.calls.length).toEqual(3);
    expect(mockOnChang.mock.calls[2][0]).toEqual('panel01');

    userEvent.click(screen.queryByTestId('panel02-title'));
    expect(mockOnChang.mock.calls.length).toEqual(3);

    userEvent.click(screen.queryByTestId('panel03-title'));
    expect(mockOnChang.mock.calls.length).toEqual(4);
    expect(mockOnChang.mock.calls[3][0]).toEqual('panel03');
  });
});
