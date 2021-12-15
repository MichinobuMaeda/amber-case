import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import TextEdit from './TextEdit';

const defaultSaveErrorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

describe('TextEdit', () => {
  it('calls onSave() if the value has changed.', async () => {
    const mockOnSave = jest.fn();
    render(
      <TextEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        validate={(v) => (!v && 'Error 1') || (v.length < 3 && 'Error 2')}
        onSave={mockOnSave}
      />,
    );

    expect(screen.queryByText('Error 1')).toBeNull();
    expect(screen.queryByText('Error 2')).toBeNull();
    expect(screen.queryByText(defaultSaveErrorMessage)).toBeNull();
    expect(mockOnSave.mock.calls.length).toEqual(0);

    expect(screen.queryByRole('button', { name: 'test01-save' })).toBeDisabled();
    expect(mockOnSave.mock.calls.length).toEqual(0);

    userEvent.type(screen.queryByRole('textbox', { name: 'test01-input' }), '{backspace}');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('ab');
    expect(screen.getByText('Error 2')).toBeInTheDocument();

    userEvent.type(screen.getByRole('textbox', { name: 'test01-input' }), 'c');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abc');
    expect(screen.queryByText('Error 2')).toBeNull();

    userEvent.type(screen.getByRole('textbox', { name: 'test01-input' }), 'd');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abcd');
    expect(screen.queryByRole('button', { name: 'test01-save' })).not.toBeDisabled();
    userEvent.click(screen.queryByRole('button', { name: 'test01-save' }));
    expect(mockOnSave.mock.calls.length).toEqual(1);
    expect(mockOnSave.mock.calls[0][0]).toEqual('abcd');

    userEvent.click(screen.queryByRole('button', { name: 'test01-cancel' }));
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abc');
    expect(screen.queryByRole('button', { name: 'test01-save' })).toBeDisabled();
  });

  it('shows the default save error message if onSave() throws error.', async () => {
    const mockOnSave = jest.fn();
    mockOnSave.mockImplementationOnce(() => { throw Error(); });
    render(
      <TextEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        validate={(v) => (!v && 'Error 1') || (v.length < 3 && 'Error 2')}
        onSave={mockOnSave}
      />,
    );
    userEvent.type(screen.getByRole('textbox', { name: 'test01-input' }), 'd');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abcd');

    userEvent.click(screen.queryByRole('button', { name: 'test01-save' }));
    expect(screen.getByText(defaultSaveErrorMessage)).toBeInTheDocument();

    userEvent.click(screen.queryByRole('button', { name: 'test01-cancel' }));
    expect(screen.queryByText(defaultSaveErrorMessage)).toBeNull();
  });

  it('shows the given save error message if onSave() throws error.', async () => {
    const mockOnSave = jest.fn();
    mockOnSave.mockImplementationOnce(() => { throw Error(); });
    render(
      <TextEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        validate={(v) => (!v && 'Error 1') || (v.length < 3 && 'Error 2')}
        saveErrorMessage="Save Error Message"
        onSave={mockOnSave}
      />,
    );
    userEvent.type(screen.getByRole('textbox', { name: 'test01-input' }), 'd');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abcd');

    userEvent.click(screen.queryByRole('button', { name: 'test01-save' }));
    expect(screen.getByText('Save Error Message')).toBeInTheDocument();
  });
});
