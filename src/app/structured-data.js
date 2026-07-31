import { siteUrl, profile, skills, experience, education } from "@/data/site";

/**
 * Schema.org graph describing Vinit as a person, not just a page.
 * Search engines use this for entity resolution ("who is Vinit Agarwal"),
 * and answer engines quote it directly.
 */
export function buildStructuredData() {
  const personId = `${siteUrl}/#vinit`;

  const person = {
    "@type": "Person",
    "@id": personId,
    name: profile.name,
    givenName: "Vinit",
    familyName: "Agarwal",
    jobTitle: profile.role,
    description: profile.headline,
    disambiguatingDescription: profile.plain,
    url: siteUrl,
    email: `mailto:${profile.email}`,
    image: `${siteUrl}/icon.svg`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Bangalore",
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    homeLocation: {
      "@type": "Place",
      name: "Bangalore, India",
    },
    worksFor: {
      "@type": "Organization",
      name: "Reconect.ai",
      url: "https://reconect.ai/",
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: education.school,
    },
    knowsAbout: [
      "Distributed systems",
      "Backend engineering",
      "System architecture",
      "Python",
      "FastAPI",
      "Django",
      "Celery",
      "Redis",
      "PostgreSQL",
      "Kubernetes",
      "Event-driven architecture",
      "Multi-tenant systems",
      "Rate limiting and throttling",
      "Idempotency and delivery guarantees",
      "API design",
      ...skills.flatMap((g) => g.items),
    ],
    hasOccupation: {
      "@type": "Occupation",
      name: "Software Engineer",
      occupationLocation: { "@type": "City", name: "Bangalore" },
      skills: skills.flatMap((g) => g.items).join(", "),
    },
    sameAs: [
      profile.socials.github,
      profile.socials.linkedin,
      profile.socials.medium,
    ],
  };

  const website = {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: `${profile.name} — ${profile.role}`,
    description: profile.headline,
    inLanguage: "en",
    publisher: { "@id": personId },
  };

  const profilePage = {
    "@type": "ProfilePage",
    "@id": `${siteUrl}/#profilepage`,
    url: siteUrl,
    name: `${profile.name} — ${profile.role} in Bangalore`,
    isPartOf: { "@id": `${siteUrl}/#website` },
    about: { "@id": personId },
    mainEntity: { "@id": personId },
  };

  // Each role as a distinct, machine-readable stint.
  const roles = experience.map((job, i) => ({
    "@type": "OrganizationRole",
    "@id": `${siteUrl}/#role-${i}`,
    roleName: job.role,
    startDate: job.date.split("—")[0].trim(),
    description: job.points[0],
    memberOf: {
      "@type": "Organization",
      name: job.company,
      ...(job.website ? { url: job.website } : {}),
    },
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [person, website, profilePage, ...roles],
  };
}

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildStructuredData()),
      }}
    />
  );
}
