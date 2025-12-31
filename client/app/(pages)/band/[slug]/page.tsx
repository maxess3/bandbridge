export default async function Root({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return <div>Page de gestion du groupe</div>;
}
