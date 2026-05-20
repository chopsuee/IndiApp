'use client';
import type { Organization } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

interface OrgCardProps { organization: Organization; }

const CATEGORY_COLORS: Record<string, string> = {
  Economic: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Security: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  Political: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
};

export function OrgCard({ organization: org }: OrgCardProps) {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg leading-tight">
            <Link
              href={`/organizations/${org.slug}`}
              className="hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              {org.name}
            </Link>
          </CardTitle>
          <span
            className={`shrink-0 inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${CATEGORY_COLORS[org.category] ?? ''}`}
          >
            {org.category}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{org.acronym}</span>
          <span aria-hidden="true">·</span>
          <span>Founded {org.foundingYear}</span>
          <span aria-hidden="true">·</span>
          <span>{org.memberCount} members</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{org.overview}</p>
        <p className="text-sm mb-3">
          <span className="font-medium">India&apos;s role: </span>{org.indiaRole}
        </p>
        <Accordion>
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm py-2">View details</AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3 pt-1">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Objectives</p>
                  <ul className="list-disc list-inside space-y-0.5">
                    {org.objectives.map((obj, i) => (
                      <li key={i} className="text-sm">{obj}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">Member Countries</p>
                  <div className="flex flex-wrap gap-1">
                    {org.memberCountries.map(mc => (
                      <span
                        key={mc.name}
                        className="inline-flex items-center gap-1 text-xs bg-muted rounded px-1.5 py-0.5"
                      >
                        <span aria-hidden="true">{mc.flag}</span>{mc.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
export default OrgCard;
