import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OrgGrid } from './OrgGrid';
import type { Organization } from '@/types';

const mockOrgs: Organization[] = [
  {
    id: 'brics', name: 'BRICS', acronym: 'BRICS', foundingYear: 2009,
    memberCount: 5, overview: 'Economic bloc', objectives: ['Trade'],
    memberCountries: [{ name: 'India', flag: '🇮🇳' }],
    indiaRole: 'Founding member', indiaContributions: ['Leadership'],
    asianRegionalismImpact: 'High', category: 'Economic', slug: 'brics',
  },
  {
    id: 'sco', name: 'SCO', acronym: 'SCO', foundingYear: 2001,
    memberCount: 8, overview: 'Security org', objectives: ['Security'],
    memberCountries: [{ name: 'India', flag: '🇮🇳' }],
    indiaRole: 'Full member', indiaContributions: ['Counter-terrorism'],
    asianRegionalismImpact: 'Medium', category: 'Security', slug: 'sco',
  },
];

describe('OrgGrid integration', () => {
  it('shows all organizations by default', () => {
    render(<OrgGrid organizations={mockOrgs} />);
    // Each org name appears multiple times in the card (link + heading span)
    expect(screen.getAllByText('BRICS').length).toBeGreaterThan(0);
    expect(screen.getAllByText('SCO').length).toBeGreaterThan(0);
  });

  it('filters to only Economic organizations when Economic tab selected', async () => {
    const user = userEvent.setup();
    render(<OrgGrid organizations={mockOrgs} />);

    await user.click(screen.getByRole('tab', { name: 'Economic' }));

    expect(screen.getAllByText('BRICS').length).toBeGreaterThan(0);
    expect(screen.queryAllByText('SCO')).toHaveLength(0);
  });

  it('filters to only Security organizations when Security tab selected', async () => {
    const user = userEvent.setup();
    render(<OrgGrid organizations={mockOrgs} />);

    await user.click(screen.getByRole('tab', { name: 'Security' }));

    expect(screen.queryAllByText('BRICS')).toHaveLength(0);
    expect(screen.getAllByText('SCO').length).toBeGreaterThan(0);
  });
});
