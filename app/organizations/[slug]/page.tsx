import { notFound } from 'next/navigation';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { OrgDetail } from '@/components/organizations/OrgDetail';
import { getOrganizations, getOrganizationBySlug } from '@/lib/data';
import type { Metadata } from 'next';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const organizations = getOrganizations();
  return organizations.map(org => ({ slug: org.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const org = getOrganizationBySlug(slug);
  if (!org) return { title: 'Organization Not Found' };
  return {
    title: `${org.name} | India in Asia`,
    description: org.overview,
  };
}

export default async function OrgDetailPage({ params }: Props) {
  const { slug } = await params;
  const org = getOrganizationBySlug(slug);
  if (!org) notFound();
  return (
    <PageWrapper>
      <OrgDetail organization={org} />
    </PageWrapper>
  );
}
