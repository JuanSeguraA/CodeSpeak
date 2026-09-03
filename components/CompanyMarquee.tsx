import { getAllCompanies } from "@/data/questions"

export default function CompanyMarquee() {
  const companies = getAllCompanies()
  const track = [...companies, ...companies]

  return (
    <div className="w-full">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
        Practice questions asked at
      </p>
      <div
        className="w-full overflow-hidden"
        style={{
          maskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
        }}
      >
        <div className="flex w-max items-center gap-8 animate-marquee">
          {track.map((company, i) => (
            <span
              key={`${company}-${i}`}
              className="shrink-0 whitespace-nowrap text-lg font-semibold tracking-tight text-muted/70 transition-colors duration-150 hover:text-foreground"
            >
              {company}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
