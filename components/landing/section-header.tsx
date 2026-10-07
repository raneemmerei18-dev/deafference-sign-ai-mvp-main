export function SectionHeader({
  id,
  eyebrow,
  title,
  lead,
}: {
  /** Put on the <h2> so the section can reference it via aria-labelledby. */
  id: string
  eyebrow: string
  title: string
  lead?: string
}) {
  return (
    <div className="section-header">
      <p className="eyebrow">{eyebrow}</p>
      <h2 id={id} className="section-title">
        {title}
      </h2>
      {lead ? <p className="section-lead">{lead}</p> : null}
    </div>
  )
}
