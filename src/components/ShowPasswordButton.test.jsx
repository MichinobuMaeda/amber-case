import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import '../testConfig';

// work around for mocking problem.
const { ShowPasswordButton } = require('./exportForTest');

describe('ShowPasswordButton', () => {
  it('hides password chars on default and toggled visibility '
  + 'by button click or mouseDown.', () => {
    const mockOnChange = jest.fn();
    render(<ShowPasswordButton onClick={mockOnChange} />);
    expect(screen.queryByTestId('VisibilityOffIcon')).toBeInTheDocument();

    userEvent.click(screen.queryByTestId('VisibilityOffIcon'));
    expect(mockOnChange.mock.calls.length).toEqual(1);
    expect(mockOnChange.mock.calls[0][0]).toEqual(true);
  });

  it('shows password chars with value: true and toggled visibility '
  + 'by button click or mouseDown.', () => {
    const mockOnChange = jest.fn();
    render(<ShowPasswordButton show onClick={mockOnChange} />);
    expect(screen.queryByTestId('VisibilityIcon')).toBeInTheDocument();

    userEvent.click(screen.queryByTestId('VisibilityIcon'));
    expect(mockOnChange.mock.calls.length).toEqual(1);
    expect(mockOnChange.mock.calls[0][0]).toEqual(false);
  });
});
