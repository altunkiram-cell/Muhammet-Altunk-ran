import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { TALIMAT } from '@/lib/talimat';
import { MODEL_NAME } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Sunucu tarafında GEMINI_API_KEY tanımlanmamış.' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { documents, interviewHistory } = body;

    if (!documents || !Array.isArray(documents) || documents.length === 0) {
      return NextResponse.json(
        { error: 'Lütfen gazete sayfası için en az bir tarihî belge sağlayın.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // Documents formatting
    const documentsPrompt = documents
      .map((doc: string, idx: number) => {
        const trimmed = doc.trim();
        if (/^belge\s*\d+/i.test(trimmed)) return trimmed;
        return `Belge ${idx + 1}:\n${trimmed}`;
      })
      .join('\n\n---\n\n');

    // Interview summary if available
    let interviewContext = '';
    if (Array.isArray(interviewHistory) && interviewHistory.length > 0) {
      interviewContext = `\n\nÖĞRETMEN VE ÖĞRENCİLERLE YAPILAN RÖPORTAJ NOTLARI:\n` +
        interviewHistory
          .map((m: { role: string; text: string; content?: string }) => {
            const txt = m.text || m.content || '';
            return `${m.role === 'user' ? 'Soru' : 'Muhabir'}: ${txt}`;
          })
          .join('\n');
    }

    const prompt = `YÜKLENEN BİRİNCİL TARİHÎ BELGELER:
=========================================
${documentsPrompt}
=========================================
${interviewContext}

GÖREV:
Yukarıdaki belgeler ve röportaj ışığında, 1919 dönemi gazete tarzında (İkdam / Hâkimiyet-i Milliye / İrâde-i Milliye havasında) bir gazete sayfası hazırla.

ZORUNLU KURALLAR:
1. "manset": Dönemin ruhuna uygun, büyük ve etkileyici bir başlık (Büyük harflerle).
2. "spot": Haberin can alıcı özet cümlesi.
3. "haberMetni": Yalnızca belgelerdeki somut olayları üçüncü şahıs muhabir diliyle aktaran, 2-3 paragraflık gazete haber metni. Tarihî kişilerin ağzından konuşma; onları anlat.
4. "alintilar": YALNIZCA VE SADECE belgelerdeki orijinal metinlerden BIREBİR alınmış 2 veya 3 alıntı. Her alıntıda "metin" (birebir tırnak içi cümle) ve "belge" (örn: "Belge 1") belirtilmelidir. Belgede olmayan hiçbir ifade uydurma.
5. "kontrolSorulari": Öğrencilerin belgeleri inceleyerek cevaplayabileceği, analitik düşünmeyi geliştiren TAM 3 ADET soru.
6. "gazeteAdi": 1919 dönemi gazete adı önerisi (örn: "HÂKİMİYET-İ MİLLİYE", "İSTİKLÂL", "İKDAM" vb.).
7. "tarih": Belgelere uyan tarih (örn: "23 Haziran 1335 / 1919").
8. "sayi": Gazete sayı numarası (örn: "Sayı: 191").`;

    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: TALIMAT,
        temperature: 0.2,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            gazeteAdi: { type: Type.STRING },
            tarih: { type: Type.STRING },
            sayi: { type: Type.STRING },
            manset: { type: Type.STRING },
            spot: { type: Type.STRING },
            haberMetni: { type: Type.STRING },
            alintilar: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  metin: { type: Type.STRING },
                  belge: { type: Type.STRING },
                },
                required: ['metin', 'belge'],
              },
            },
            kontrolSorulari: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
          },
          required: ['manset', 'spot', 'haberMetni', 'alintilar', 'kontrolSorulari'],
        },
      },
    });

    const text = response.text || '{}';
    const parsedData = JSON.parse(text);

    return NextResponse.json(parsedData);
  } catch (err: unknown) {
    console.error('Newspaper API error:', err);
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata.';
    return NextResponse.json(
      { error: `Gazete sayfası oluşturulamadı: ${message}` },
      { status: 500 }
    );
  }
}
