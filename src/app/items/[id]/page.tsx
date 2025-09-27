// app/items/[id]/page.tsx
type PageProps = { params: { id: string } };

async function getItem(id: string) {
  // 예시: 내부 API 보다는 외부 호출/DB라면 직접 여기서 처리 추천
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/api/items/${id}`, {
    // 서버 컴포넌트 fetch의 캐시 전략을 명시 (필요시)
    cache: 'no-store',
  });
  if (!res.ok) {
    // 에러 표면화해서 error.tsx로 흘려보내기
    throw new Error(`Failed to load item ${id}: ${res.status}`);
  }
  return res.json() as Promise<{ id: string; title: string; description?: string }>;
}

export default async function ItemPage({ params }: PageProps) {
  const item = await getItem(params.id);

  return (
    <main style={{ padding: 24 }}>
      <h1>{item.title}</h1>
      <p>ID: {item.id}</p>
      {item.description && <p>{item.description}</p>}
    </main>
  );
}
