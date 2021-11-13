/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import PasswordField from './PasswordField';

describe('PasswordField', () => {
  it('hides password chars on default and toggled visibility '
  + 'by button click or mouseDown.', () => {
    const mockOnChange = jest.fn();
    render(<PasswordField data-testid="test01" label="test01" onChange={mockOnChange} />);
    expect(screen.queryByTestId('VisibilityOffIcon')).toBeInTheDocument();

    userEvent.click(screen.queryByTestId('VisibilityOffIcon'));
    expect(screen.queryByTestId('VisibilityIcon')).toBeInTheDocument();

    userEvent.type(screen.queryByTestId('test01'), 't');
    expect(mockOnChange.mock.calls.length).toEqual(1);
    expect(mockOnChange.mock.calls[0][0]).toEqual('t');

    userEvent.type(screen.queryByTestId('test01'), 'E');
    expect(mockOnChange.mock.calls.length).toEqual(2);
    expect(mockOnChange.mock.calls[1][0]).toEqual('tE');

    userEvent.type(screen.queryByTestId('test01'), 's');
    expect(mockOnChange.mock.calls.length).toEqual(3);
    expect(mockOnChange.mock.calls[2][0]).toEqual('tEs');

    userEvent.type(screen.queryByTestId('test01'), 't');
    expect(mockOnChange.mock.calls.length).toEqual(4);
    expect(mockOnChange.mock.calls[3][0]).toEqual('tEst');

    expect(screen.queryByDisplayValue('tEst')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('tEst')).toHaveAttribute('type', 'text');

    userEvent.click(screen.queryByTestId('VisibilityIcon'));
    expect(screen.queryByTestId('VisibilityOffIcon')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('tEst')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('tEst')).toHaveAttribute('type', 'password');
  });

  it('shows helper text.', () => {
    render(<PasswordField data-testid="test02" label="test02" required />);
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeInTheDocument();

    userEvent.type(screen.queryByTestId('test02'), 't');
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeNull();
  });
});
