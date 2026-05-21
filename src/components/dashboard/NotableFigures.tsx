import { Award } from 'lucide-react';

interface Figure {
  name: string;
  years: string;
  role: string;
  impact: string;
  emoji: string;
  tag: string;
}

const FIGURES: Figure[] = [
  {
    name: 'Mahatma Gandhi',
    years: '1869–1948',
    role: 'Father of the Nation',
    tag: 'Civil Rights',
    emoji: '🕊️',
    impact:
      'Pioneered nonviolent resistance (Satyagraha) to win Indian independence. His methods directly inspired Martin Luther King Jr. and Nelson Mandela — still the global blueprint for civil disobedience.',
  },
  {
    name: 'Rabindranath Tagore',
    years: '1861–1941',
    role: 'Poet, Philosopher & Educator',
    tag: 'Nobel 1913',
    emoji: '✍️',
    impact:
      'First Asian Nobel Laureate in Literature (1913). His poetry and philosophy shaped global thought on nationalism vs humanism. Founded Visva-Bharati University, blending Eastern and Western learning.',
  },
  {
    name: 'APJ Abdul Kalam',
    years: '1931–2015',
    role: 'Scientist & 11th President of India',
    tag: 'Science & Leadership',
    emoji: '🚀',
    impact:
      '"Missile Man of India" — led India\'s ballistic missile and space programmes before becoming President (2002–2007). Made science aspirational for a generation of students across the Global South.',
  },
  {
    name: 'Amartya Sen',
    years: '1933–present',
    role: 'Economist & Philosopher',
    tag: 'Nobel 1998',
    emoji: '📊',
    impact:
      'Nobel Prize in Economics (1998) for his work on poverty, famines, and human capability. His Capability Approach fundamentally changed how the UN and World Bank measure human development.',
  },
  {
    name: 'Ratan Tata',
    years: '1937–2024',
    role: 'Industrialist & Philanthropist',
    tag: 'Ethical Capitalism',
    emoji: '🏭',
    impact:
      'Built Tata Group into a global brand spanning Jaguar, Land Rover, and Tetley. Channelled 66% of Tata Sons profits into philanthropy — a model of ethical capitalism rarely seen at this scale.',
  },
];

const TAG_COLORS: Record<string, string> = {
  'Civil Rights': 'bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300',
  'Nobel 1913': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300',
  'Science & Leadership': 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
  'Nobel 1998': 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300',
  'Ethical Capitalism': 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
};

export function NotableFigures() {
  return (
    <section aria-labelledby="notable-figures-heading">
      <div className="flex items-center gap-2 mb-6">
        <Award className="size-6 text-primary" aria-hidden="true" />
        <h2 id="notable-figures-heading" className="text-2xl font-bold">
          Notable Figures
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {FIGURES.map((figure) => (
          <article
            key={figure.name}
            className="flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-shadow hover:shadow-md"
          >
            {/* Header */}
            <div className="flex items-start gap-3">
              <span
                className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-2xl"
                aria-hidden="true"
              >
                {figure.emoji}
              </span>
              <div className="min-w-0">
                <h3 className="font-semibold leading-tight">{figure.name}</h3>
                <p className="text-xs text-muted-foreground">{figure.years}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{figure.role}</p>
              </div>
            </div>

            {/* Tag */}
            <span
              className={`self-start inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                TAG_COLORS[figure.tag] ?? 'bg-muted text-muted-foreground'
              }`}
            >
              {figure.tag}
            </span>

            {/* Impact */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {figure.impact}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default NotableFigures;
