import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import RadioButtons, { RadioButtonsItem } from './RadioButtons';

describe('RadioButtons', () => {
  it('shows given items and call onChange() with selected value.', () => {
    const mockOnChange = jest.fn();
    const items = [
      {
        label: 'item 1',
        value: '1',
      },
      {
        label: 'item 2',
        value: '2',
      },
      {
        label: 'item 3',
        value: '3',
      },
    ] as RadioButtonsItem[];
    render(<RadioButtons onChange={mockOnChange} items={items} value="2" />);

    expect(screen.getByLabelText('item 1')).toBeInTheDocument();
    expect(screen.getByLabelText('item 2')).toBeInTheDocument();
    expect(screen.getByLabelText('item 3')).toBeInTheDocument();
    expect(mockOnChange.mock.calls.length).toEqual(0);

    userEvent.click(screen.getByLabelText('item 1'));
    expect(mockOnChange.mock.calls.length).toEqual(1);
    expect(mockOnChange.mock.calls[0][0]).toEqual('1');

    userEvent.click(screen.getByLabelText('item 3'));
    expect(mockOnChange.mock.calls.length).toEqual(2);
    expect(mockOnChange.mock.calls[1][0]).toEqual('3');
  });

  it('shows legend if given.', () => {
    const mockOnChange = jest.fn();
    const items = [
      {
        label: 'item 1',
        value: '1',
      },
      {
        label: 'item 2',
        value: '2',
      },
      {
        label: 'item 3',
        value: '3',
      },
    ] as RadioButtonsItem[];
    render(<RadioButtons onChange={mockOnChange} items={items} value="2" legend="Title" />);

    expect(screen.getByLabelText('item 1')).toBeInTheDocument();
    expect(screen.getByLabelText('item 2')).toBeInTheDocument();
    expect(screen.getByLabelText('item 3')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
  });
});

describe('RadioButtonsItem', () => {
  it('is initialized with default values.', () => {
    expect(new RadioButtonsItem()).toEqual({
      label: '',
      value: '',
    });
  });
});
