import { getOrganizations } from '@/lib/data';
import { OrgCard } from '@/components/organizations/OrgCard';

const FEATURED_IDS = ['brics', 'saarc', 'g20', 'sco'];

export function FeaturedOrgs() {
  const orgs = getOrganizations().filter(o => FEATURED_IDS.includes(o.id));
  return (
    <section aria-labelledby="featured-orgs-heading" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 id="featured-orgs-heading" className="text-3xl font-bold text-gradient-primary">
          Featured Organizations
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore India's key partnerships in major regional and global organizations
        </p>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        {orgs.map(org => <OrgCard key={org.id} organization={org} />)}
      </div>
    </section>
  );
}
export default FeaturedOrgs;
