import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { i18n } from '../conf';
import MarkDownEdit from './MarkDownEdit';

const defaultSaveErrorMessage = i18n.t('failed to save data') + i18n.t('retry failed or call admin');

describe('MarkDownEdit', () => {
  it('shows save button and cancel button after click edit button, '
  + 'and calls onSave() if the value has changed.', async () => {
    const mockOnSave = jest.fn();
    render(
      <MarkDownEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        editable
        onSave={mockOnSave}
      />,
    );

    expect(screen.getByText('abc')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'test01-edit' })).toBeInTheDocument();
    expect(screen.queryByText(defaultSaveErrorMessage)).toBeNull();
    expect(mockOnSave.mock.calls.length).toEqual(0);
    expect(screen.queryByRole('textbox', { name: 'test01-input' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'test01-save' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'test01-cancel' })).toBeNull();

    userEvent.click(screen.queryByRole('button', { name: 'test01-edit' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'test01-edit' })).toBeNull());
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'test01-save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'test01-cancel' })).toBeInTheDocument();

    expect(screen.queryByRole('button', { name: 'test01-save' })).toBeDisabled();
    expect(mockOnSave.mock.calls.length).toEqual(0);

    userEvent.type(screen.queryByRole('textbox', { name: 'test01-input' }), 'd');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abcd');
    expect(screen.queryByRole('button', { name: 'test01-save' })).not.toBeDisabled();
    userEvent.click(screen.queryByRole('button', { name: 'test01-save' }));
    expect(mockOnSave.mock.calls).toEqual([['abcd']]);
    expect(await screen.findByRole('button', { name: 'test01-edit' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'test01-input' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'test01-save' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'test01-cancel' })).toBeNull();
  });

  it('shows the default save error message if onSave() throws error.', async () => {
    const mockOnSave = jest.fn();
    mockOnSave.mockImplementationOnce(() => { throw Error(); });
    render(
      <MarkDownEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        editable
        onSave={mockOnSave}
      />,
    );

    userEvent.click(screen.queryByRole('button', { name: 'test01-edit' }));
    expect(await screen.findByRole('textbox')).toBeInTheDocument();
    userEvent.type(screen.getByRole('textbox', { name: 'test01-input' }), 'd');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abcd');
    userEvent.click(screen.queryByRole('button', { name: 'test01-save' }));
    expect(screen.getByText(defaultSaveErrorMessage)).toBeInTheDocument();
  });

  it('shows the given save error message if onSave() throws error.', async () => {
    const mockOnSave = jest.fn();
    mockOnSave.mockImplementationOnce(() => { throw Error(); });
    render(
      <MarkDownEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        validate={(v) => (!v && 'Error 1') || (v.length < 3 && 'Error 2')}
        editable
        saveErrorMessage="Save Error Message"
        onSave={mockOnSave}
      />,
    );

    userEvent.click(screen.queryByRole('button', { name: 'test01-edit' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'test01-edit' })).toBeNull());
    userEvent.type(screen.getByRole('textbox', { name: 'test01-input' }), 'd');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abcd');
    userEvent.click(screen.queryByRole('button', { name: 'test01-save' }));
    expect(screen.getByText('Save Error Message')).toBeInTheDocument();
  });

  it('cancels edit mode on click cancel button.', async () => {
    const mockOnSave = jest.fn();
    render(
      <MarkDownEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        editable
        onSave={mockOnSave}
      />,
    );

    userEvent.click(screen.queryByRole('button', { name: 'test01-edit' }));
    await waitFor(() => expect(screen.queryByRole('button', { name: 'test01-edit' })).toBeNull());
    userEvent.type(screen.getByRole('textbox', { name: 'test01-input' }), 'd');
    expect(screen.getByRole('textbox', { name: 'test01-input' })).toHaveValue('abcd');
    userEvent.click(screen.queryByRole('button', { name: 'test01-cancel' }));
    expect(await screen.findByRole('button', { name: 'test01-edit' })).toBeInTheDocument();
    expect(screen.queryByRole('textbox', { name: 'test01-input' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'test01-save' })).toBeNull();
    expect(screen.queryByRole('button', { name: 'test01-cancel' })).toBeNull();
  });

  it('hides edit button without editable.', async () => {
    const mockOnSave = jest.fn();
    mockOnSave.mockImplementationOnce(() => { throw Error(); });
    render(
      <MarkDownEdit
        data-testid="test01"
        label="Label 1"
        value="abc"
        onSave={mockOnSave}
      />,
    );
    expect(screen.queryByRole('button', { name: 'test01-edit' })).toBeNull();
  });
});
