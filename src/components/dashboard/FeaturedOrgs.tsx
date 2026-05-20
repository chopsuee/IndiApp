import { getOrganizations } from '@/lib/data';
import { OrgCard } from '@/components/organizations/OrgCard';

const FEATURED_IDS = ['brics', 'saarc', 'g20', 'sco'];

export function FeaturedOrgs() {
  const orgs = getOrganizations().filter(o => FEATURED_IDS.includes(o.id));
  return (
    <section aria-labelledby="featured-orgs-heading">
      <h2 id="featured-orgs-heading" className="text-2xl font-semibold mb-4">Featured Organizations</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {orgs.map(org => <OrgCard key={org.id} organization={org} />)}
      </div>
    </section>
  );
}
export default FeaturedOrgs;
