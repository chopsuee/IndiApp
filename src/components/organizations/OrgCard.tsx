'use client';
import type { Organization } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Link from 'next/link';

interface OrgCardProps { organization: Organization; }

const CATEGORY_COLORS: Record<string, string> = {
  Economic: 'bg-gradient-to-r from-accent/20 to-accent/10 text-accent-foreground border border-accent/30',
  Security: 'bg-gradient-to-r from-destructive/20 to-destructive/10 text-destructive border border-destructive/30',
  Political: 'bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary-foreground border border-secondary/30',
};

export function OrgCard({ organization: org }: OrgCardProps) {
  return (
    <Card className="h-full hover-lift border-2 hover:border-primary/30 animate-fade-in">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-xl leading-tight">
            <Link
              href={`/organizations/${org.slug}`}
              className="text-gradient-primary hover:opacity-80 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary rounded"
            >
              {org.name}
            </Link>
          </CardTitle>
          <span
            className={`shrink-0 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${CATEGORY_COLORS[org.category] ?? ''}`}
          >
            {org.category}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span className="font-bold text-primary">{org.acronym}</span>
          <span aria-hidden="true">•</span>
          <span>Founded {org.foundingYear}</span>
          <span aria-hidden="true">•</span>
          <span className="font-semibold">{org.memberCount} members</span>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">{org.overview}</p>
        <div className="p-3 rounded-xl bg-primary/5 border border-primary/10 mb-4">
          <p className="text-sm">
            <span className="font-semibold text-primary">India&apos;s role: </span>
            <span className="text-foreground">{org.indiaRole}</span>
          </p>
        </div>
        <Accordion>
          <AccordionItem value="details">
            <AccordionTrigger className="text-sm py-2 font-semibold hover:text-primary transition-smooth">
              View full details
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4 pt-2">
                <div>
                  <p className="text-xs font-bold uppercase text-primary mb-2">Objectives</p>
                  <ul className="list-none space-y-2">
                    {org.objectives.map((obj, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{obj}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-primary mb-2">Member Countries</p>
                  <div className="flex flex-wrap gap-2">
                    {org.memberCountries.map(mc => (
                      <span
                        key={mc.name}
                        className="inline-flex items-center gap-1.5 text-xs bg-muted hover:bg-muted/80 rounded-lg px-2.5 py-1.5 transition-smooth border border-border"
                      >
                        <span aria-hidden="true" className="text-base">{mc.flag}</span>
                        <span className="font-medium">{mc.name}</span>
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
