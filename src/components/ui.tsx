import Link from "next/link";
import { site } from "@/lib/site";

export function Arrow({
  diagonal = false,
  className = "",
}: {
  diagonal?: boolean;
  className?: string;
}) {
  return (
    <svg
      className={`arrow ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {diagonal ? (
        <path d="M6 18 18 6M6 6h12v12" />
      ) : (
        <path d="M4 12h16m-6-6 6 6-6 6" />
      )}
    </svg>
  );
}

export function Sparkle({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="34"
      height="34"
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 1c0 13 6 19 19 19-13 0-19 6-19 19C20 26 14 20 1 20 14 20 20 14 20 1Z"
        stroke="currentColor"
        strokeWidth="1"
      />
    </svg>
  );
}

export function BookingLink({
  children = "Boka konsultation",
  className = "",
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      className={`button ${className}`}
      href={site.bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <Arrow diagonal />
    </a>
  );
}

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav className="breadcrumbs" aria-label="Brödsmulor">
      <ol>
        <li>
          <Link href="/">Hem</Link>
        </li>
        {items.map((item, i) => (
          <li key={`${item.label}-${i}`}>
            <span className="breadcrumb-separator" aria-hidden="true">
              /
            </span>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span aria-current="page">{item.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function Faq({
  items,
}: {
  items: { question: string; answer: string }[];
}) {
  return (
    <div className="faq-list">
      {items.map((faq) => (
        <details key={faq.question}>
          <summary>
            {faq.question}
            <span className="faq-plus" aria-hidden="true">
              +
            </span>
          </summary>
          <p>{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
