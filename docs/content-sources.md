# Monaco Clinic — content provenance

Checked 2026-10-12. The user explicitly supplied the original Lovable site for rebuilding with the same content.

## Primary sources

- Original website: https://champagne-gold-glow.lovable.app/
- Clinic-managed booking page: https://www.bokadirekt.se/places/monaco-clinic-ab-137365
- User-supplied Instagram profile: https://www.instagram.com/monacoklinik/

The original website was fetched as server-rendered HTML. The Bokadirekt page was read directly, including its public JSON-LD and public `window.__PRELOADED_STATE__`. Search result snippets were not used for prices or durations because some differed from the live page.

## Brand and contact

| Field                    | Value                                                            | Evidence                                            |
| ------------------------ | ---------------------------------------------------------------- | --------------------------------------------------- |
| Public brand             | Monaco / Monaco Klinik                                           | Original navigation; clinic-managed logo            |
| Legal and booking name   | Monaco Clinic AB                                                 | Bokadirekt                                          |
| Founder in original copy | Sama Kadhim                                                      | Original about section                              |
| Bookable therapist       | Sama Hameed Kadhim                                               | Bokadirekt                                          |
| Role                     | Skönhetsterapeut, hudvård och skönhet                            | Bokadirekt                                          |
| Address                  | Hällstugatan 16, 633 53 Eskilstuna                               | Both original site and Bokadirekt                   |
| Phone                    | 073-577 19 91 / +46735771991                                     | Both sources; full number in public booking JSON-LD |
| Email                    | samahameed99@hotmail.com                                         | Both sources, case-insensitive match                |
| Opening hours            | Måndag–lördag 09–18; söndag stängt                               | Original site only                                  |
| Geographic coordinates   | 59.3928, 16.5468                                                 | Booking public JSON-LD                              |
| Organization number      | 559566-5059                                                      | Booking public data                                 |
| Cancellation policy      | Cancel at least 24 hours ahead; late cancellation/no-show billed | Therapist terms on booking page                     |

The booking page's website and Instagram fields are empty. The original site's contact agrees with the booking page. Third-party company registries list an older registered office address at Eddavägen 23 B; it is not the current visitor address and was not used.

## Original content inventory

The original is one landing page with anchors `#top`, `#treatments`, `#about`, `#testimonials`, and `#contact`. It has no separate treatment pages, price list, contact form, or Instagram integration. Its consultation buttons jump to contact, and its final booking button calls the phone number.

- Hero: a beauty/aesthetics clinic presenting personal skin care, natural radiance, and a peaceful environment. Original H1: “Strålande hy, naturligt du”.
- Treatments: laser hair removal; microblading; lip pigmentation; Hydrofacial; microneedling. Personal consultation guides treatment selection.
- Laser: repeated treatments progressively reduce hair growth.
- Microblading: individual hair-like strokes with softly shaped, symmetrical brows.
- Lip pigmentation: subtle color and contour for a more even lip tone.
- Hydrofacial: cleansing, gentle exfoliation, and hydration.
- Microneedling: small channels support the skin's renewal and work on texture over time.
- Consultation card: the visitor can book a free consultation for personal recommendations.
- About: founded by Sama Kadhim, with careful craft and a calm spa atmosphere; treatments are tailored rather than standardized.
- Final CTA: free consultation and a personal treatment plan, phone, address, opening hours, and email.
- Copyright: 2026 Monaco Clinic.

### Original statistics and testimonials

The original contains “3+” years in the industry, “8 000+” satisfied customers, and “4,9” average rating. It also contains three attributed testimonials:

1. Sofia Lindqvist — a relaxing clinic experience and improved-looking skin.
2. Amira Hassan — professional, warm, knowledgeable service and trust in the clinic's skin care.
3. Elin Bergström — thoughtful surroundings and satisfaction with results.

These are supplied by the existing website, not independently verified reviews. The booking page currently displays too few reviews and its public review count is zero. Do not infer that the original statistics are verified on Bokadirekt, and do not create `AggregateRating` or `Review` structured data from them. The original claim of certified specialists is not supported by the booking page's public certificate list; avoid adding stronger credentials, medical qualifications, or guarantees.

## Current booking inventory

These prices are SEK and durations are minutes, read from live booking data on 2026-10-12. Link visitors to booking for current prices and availability.

| Service                               | Minutes |    SEK | Service ID |
| ------------------------------------- | ------: | -----: | ---------: |
| Konsultation – Laser                  |      15 |      0 |    3522309 |
| Överläpp & Haka                       |      20 |    400 |    3522320 |
| Laser – Armhålor                      |      30 |    600 |    3522331 |
| Laser – Armar                         |      45 |    900 |    3522337 |
| Laser – Mage                          |      30 |    600 |    3522346 |
| Laser – Rygg                          |      40 |    800 |    3522344 |
| Laser – Bikini + Bikinilinje          |      30 |    800 |    3522339 |
| Laser – Ben                           |      60 |  1 200 |    3522341 |
| Laser – Hela kroppen                  |     120 |  2 999 |    3522349 |
| Laser Helkropp – Paket 6 behandlingar |     120 | 13 999 |    3529169 |
| Laser Helkropp – Paket 8 behandlingar |     120 | 17 999 |    3523718 |
| Microblading – Ögonbryn               |     180 |  1 999 |    3522293 |
| Microblading – Återbesök              |      90 |  1 000 |    3522297 |
| Lip Blush – Läppigmentering           |     120 |  1 999 |    3522305 |
| Microneedling – Ansikte               |      60 |  1 499 |    3522356 |
| HydroFacial 7-i-1 – Ansikte           |      60 |    999 |    3522362 |

### Verified treatment details for expanded local pages

- **Laser:** Aldix Smart Laser, diode laser at 808 nm. Clinic assesses skin/hair type and treatment area. Free consultation must take place at least two days before the first laser treatment. Clinic says to avoid waxing, epilating, and plucking for at least six weeks before and throughout the course, and shave around 24 hours ahead. Clinic excludes pregnancy/amning and direct treatment over tattoos. Temporary warmth/redness can occur; avoid strenuous exercise, baths, and sauna on the treatment day. These are the clinic's own instructions, not independent medical advice.
- **Microblading:** brow shape and pigment are selected for the person's face and wishes. Booking includes a separate return visit around one month later to assess and, if needed, adjust.
- **Lip Blush:** cosmetic lip pigmentation for a more even and defined color and shape. No source specifies healing time, exact longevity, permanent results, or guaranteed outcomes.
- **Microneedling:** fine sterile needles create controlled microchannels. Booking describes work on texture, radiance, tone, fine lines, visible pores, and marks after acne. Temporary redness, warmth, mild swelling, and dryness/tightness can occur. Follow the clinic's aftercare, avoid demanding exercise/sauna/baths/strong products immediately afterward, and use SPF.
- **HydroFacial 7-i-1:** facial treatment combining cleansing, exfoliation, and hydration in several steps, customized to skin needs. Some temporary sensitivity or redness can occur. Booking recommends avoiding strong products immediately afterward and using SPF.

Do not imply fillers, botox, injectables, tattoo removal, massage, lashes, nails, or hairdressing are offered. Those appeared in unrelated competitor search results and have no Monaco primary-source support.

## Downloaded original visual assets

These are copied from the user's original site, with unchanged image pixels and deterministic names:

| Local file                    | Original URL                                                         | Original alt                          | Dimensions  |
| ----------------------------- | -------------------------------------------------------------------- | ------------------------------------- | ----------- |
| `/images/hero.jpg`            | https://champagne-gold-glow.lovable.app/assets/hero-BWXv3neU.jpg     | Lugnt behandlingsrum på Monaco Clinic | 1600 × 1200 |
| `/images/clinic.jpg`          | https://champagne-gold-glow.lovable.app/assets/about-DPQ-wZJd.jpg    | Behandlingsrum på Monaco Clinic       | 1024 × 1280 |
| `/images/about.jpg`           | Same as `/images/clinic.jpg` (duplicate for application use)         | Behandlingsrum på Monaco Clinic       | 1024 × 1280 |
| `/images/facial.jpg`          | https://champagne-gold-glow.lovable.app/assets/facial-Dmf3opfJ.jpg   | Avslappnande ansiktsbehandling        | 1024 × 1024 |
| `/images/laser.jpg`           | https://champagne-gold-glow.lovable.app/assets/laser-CaYYJ8Ue.jpg    | Behandlingsrum för laser              | 1024 × 1024 |
| `/images/products.jpg`        | https://champagne-gold-glow.lovable.app/assets/products-Dxr-CojU.jpg | Lyxiga hudvårdsprodukter              | 1024 × 1024 |
| `/images/clinic-original.jpg` | https://cdn.bokadirekt.se/ucdn/1335c8f0-6791-4ccb-bb74-9172e082760a/ | Monaco Klinik official emblem         | 1256 × 1256 |

The hero and clinic portrait were visually inspected: warm beige treatment interiors. Their origin proves use on the previous website, not that they are photographs of the actual clinic. Use neutral descriptive alt text without adding unverified claims. The booking image was inspected and is a pink/burgundy MK emblem with “Monaco Klinik”, “Hälsa · Skönhet · Välbefinnande”, and “Eskilstuna”.

The original uses Cormorant Garamond for serif headings and Jost for sans-serif body copy. The replacement may redesign the layout while keeping the supplied content, assets, and business identity.
