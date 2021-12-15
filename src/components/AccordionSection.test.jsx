import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import AccordionSection from './AccordionSection';

describe('AccordionSection', () => {
  it('shows title, childlen and ExpandMoreIcon.', async () => {
    render(
      <AccordionSection data-testid="test01" title="Title 01">
        <div>Test 01</div>
      </AccordionSection>,
    );

    expect(screen.getByLabelText('Title 01')).toBeInTheDocument();
    expect(screen.getByText('Test 01')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'test01-summary' })).toHaveAttribute('aria-expanded', 'false');

    userEvent.click(screen.queryByRole('button', { name: 'test01-summary' }));
    expect(screen.queryByRole('button', { name: 'test01-summary' })).toHaveAttribute('aria-expanded', 'true');
  });
});
