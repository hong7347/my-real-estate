// src/app/items/[id]/page.tsx
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// 캐싱 이슈 피하고 즉시 최신 조회하려면(선택)
// export const dynamic = 'force-dynamic';

export default async function ItemPage({ params }: { params: { id: string } }) {
  const id = Number(params.id);
  if (Number.isNaN(id)) return <div>잘못된 매물 ID입니다.</div>;

  // Vercel에 서버용 키가 없으면 바로 원인 표시
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return <pre>SERVER ENV MISSING: SUPABASE_SERVICE_ROLE_KEY</pre>;
  }

  try {
    const { data, error } = await supabaseAdmin
      .from('properties')
      .select('id,title,address,deposit,monthly_rent,address, property_images(url,sort_order)')
      .eq('id', id)
      .maybeSingle(); // 결과 없으면 data=null

    if (error) return <pre>DB ERROR: {error.message}</pre>;
    if (!data) return <div>매물을 찾을 수 없습니다.</div>;

    return (
      <article>
        <h1 style={{ fontSize: 28, fontWeight: 900 }}>{data.title}</h1>
        <p style={{ color: '#666' }}>{data.address}</p>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:12, margin:'16px 0' }}>
          {(data.property_images ?? []).map((img: any, i: number) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={img.url} alt={data.title} style={{ width:'100%', height:220, objectFit:'cover', borderRadius:12 }} />
          ))}
        </div>

        <ul style={{ lineHeight: 1.9 }}>
          <li>보증금: {data.deposit?.toLocaleString?.() ?? '-'}</li>
          <li>월세: {data.monthly_rent?.toLocaleString?.() ?? '-'}</li>
        </ul>
      </article>
    );
  } catch (e: any) {
    return <pre>UNEXPECTED: {String(e?.message ?? e)}</pre>;
  }
}
