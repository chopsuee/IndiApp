import type { Organization } from '@/types';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';

interface OrgDetailProps {
  organization: Organization;
}

export function OrgDetail({ organization: org }: OrgDetailProps) {
  return (
    <article className="max-w-3xl mx-auto space-y-6 px-4 py-6">
      <Link href="/organizations" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Organizations
      </Link>

      <header>
        <div className="flex items-start gap-3 flex-wrap">
          <h1 className="text-3xl font-bold">{org.name}</h1>
          <span className="text-xl font-semibold text-muted-foreground">({org.acronym})</span>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline">Founded {org.foundingYear}</Badge>
          <Badge variant="outline">{org.memberCount} members</Badge>
          <Badge>{org.category}</Badge>
        </div>
      </header>

      <Card>
        <CardHeader><CardTitle>Overview</CardTitle></CardHeader>
        <CardContent><p>{org.overview}</p></CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Objectives</CardTitle></CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1">
            {org.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Member Countries</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {org.memberCountries.map(mc => (
              <span key={mc.name} className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm">
                <span aria-hidden="true">{mc.flag}</span>
                {mc.name}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>India&apos;s Role &amp; Contributions</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <p>{org.indiaRole}</p>
          <ul className="list-disc list-inside space-y-1">
            {org.indiaContributions.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Impact on Asian Regionalism</CardTitle></CardHeader>
        <CardContent><p>{org.asianRegionalismImpact}</p></CardContent>
      </Card>
    </article>
  );
}
export default OrgDetail;
