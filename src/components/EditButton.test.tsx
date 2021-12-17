import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import EditButton from './EditButton';

describe('EditButton', () => {
  it('calls onClick() on click.', async () => {
    const mockOnClick = jest.fn();
    render(<EditButton aria-label="test01" onClick={mockOnClick} />);

    expect(mockOnClick.mock.calls.length).toEqual(0);
    userEvent.click(screen.getByRole('button', { name: 'test01' }));
    expect(mockOnClick.mock.calls.length).toEqual(1);
  });
});
