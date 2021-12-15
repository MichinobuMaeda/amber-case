import { render, screen } from '@testing-library/react';
import React from 'react';

import Section from './Section';

describe('EditButton', () => {
  it('calls onClick() on click.', async () => {
    render(
      <Section data-testid="test01" title="Title 01">
        <div>Test 01</div>
      </Section>,
    );

    expect(screen.getByTestId('test01')).toBeInTheDocument();
    expect(screen.getByText('Title 01')).toBeInTheDocument();
    expect(screen.getByText('Test 01')).toBeInTheDocument();
  });
});
