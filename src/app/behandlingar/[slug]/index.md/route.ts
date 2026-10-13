import { treatments } from "@/lib/content";
import { markdownPageResponse } from "@/lib/discovery";

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return treatments.map((treatment) => ({ slug: treatment.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  return markdownPageResponse(`/behandlingar/${slug}`);
}
