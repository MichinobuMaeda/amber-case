import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import { EmailField } from '.';

describe('EmailField', () => {
  it('shows helper text if the value is required but the value is empty.', () => {
    render(<EmailField data-testid="test01" label="test01" required />);
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeInTheDocument();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();

    userEvent.type(screen.queryByTestId('test01'), 't');
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeNull();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeInTheDocument();
  });

  it('shows no helper text if the value is not required but the value is empty.', () => {
    render(<EmailField data-testid="test01" label="test01" />);
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeNull();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();

    userEvent.type(screen.queryByTestId('test01'), 't');
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeNull();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeInTheDocument();
  });

  it('shows helper text if the value is not valid email.', () => {
    render(<EmailField data-testid="test01" label="test01" />);
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeNull();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();

    userEvent.type(screen.queryByTestId('test01'), 'abc@def.gh');
    expect(screen.queryByText(i18n.t('inputnis required'))).toBeNull();
    expect(screen.queryByText(i18n.t('correct your email address'))).toBeNull();
  });

  it('calls onChange on a key type.', () => {
    const mockOnChange = jest.fn();
    render(<EmailField data-testid="test01" label="test01" onChange={mockOnChange} />);
    userEvent.type(screen.queryByTestId('test01'), 't');
    expect(mockOnChange.mock.calls.length).toEqual(1);
    expect(mockOnChange.mock.calls[0][0]).toEqual('t');
  });
});
