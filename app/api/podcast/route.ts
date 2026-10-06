import { GoogleGenAI, Type } from '@google/genai';
import { NextRequest, NextResponse } from 'next/server';
import { TALIMAT } from '@/lib/talimat';
import { MODEL_NAME, TTS_MODEL_NAME } from '@/lib/config';

interface DialogueTurn {
  speaker: 'Muhabir' | 'Tarihçi';
  text: string;
}

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
    const { newspaperData, documents } = body;

    if (!newspaperData && (!documents || documents.length === 0)) {
      return NextResponse.json(
        { error: 'Podcast oluşturmak için gazete verisi veya belgeler gereklidir.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 1. ADIM: 1 dakikalık diyalog metnini oluştur (gemini-3.8-flash ile)
    const contextInfo = `
MANŞET: ${newspaperData?.manset || 'Tarihî Gelişmeler'}
SPOT: ${newspaperData?.spot || ''}
HABER METNİ: ${newspaperData?.haberMetni || ''}
BELGELER:
${Array.isArray(documents) ? documents.join('\n---\n') : ''}
`;

    const scriptPrompt = `GÖREV:
Yukarıdaki gazete haberini ve tarihî belgeleri "Muhabir" ve "Tarihçi" arasında geçen tam 1 DAKİKALIK (toplam yaklaşık 120-150 kelime, 5-7 karşılıklı konuşma sırası) canlı bir podcast sohbetine dönüştür.

KURALLAR:
1. Konuşmacılar: "Muhabir" ve "Tarihçi".
2. Tarihçi de kesinlikle tarihî kişileri canlandırmaz, onların ağzından konuşmaz; üçüncü şahısla ve belgelere dayanarak anlatır.
3. Muhabir soru sorar, konuyu açar; Tarihçi belgedeki can alıcı noktayı açıklar.
4. Yalnızca yüklenen belgelerdeki bilgiler kullanılır.
5. Dinleyiciyi içine çeken, Türkçe, akıcı ve bilgilendirici bir radyo/podcast dili olsun.`;

    const scriptResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: `${contextInfo}\n\n${scriptPrompt}`,
      config: {
        systemInstruction: TALIMAT,
        temperature: 0.3,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            baslik: { type: Type.STRING },
            diyalog: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  speaker: {
                    type: Type.STRING,
                    enum: ['Muhabir', 'Tarihçi'],
                  },
                  text: { type: Type.STRING },
                },
                required: ['speaker', 'text'],
              },
            },
          },
          required: ['baslik', 'diyalog'],
        },
      },
    });

    const parsedScript = JSON.parse(scriptResponse.text || '{"baslik":"Tarih Muhabiri Podcast","diyalog":[]}');
    const dialogue: DialogueTurn[] = parsedScript.diyalog || [];
    const podcastTitle: string = parsedScript.baslik || 'Tarih Muhabiri Podcast Özel Yayını';

    // 2. ADIM: Gemini TTS ile iki farklı sesle seslendir
    let audioBase64: string | undefined = undefined;
    let audioMimeType: string | undefined = undefined;
    let ttsWarning: string | undefined = undefined;

    try {
      // multiSpeakerVoiceConfig requires speaker names matching the parts, and exactly 2 speakers
      const parts = dialogue.map(d => {
        const isMuhabir = d.speaker === 'Muhabir';
        return {
          text: `${d.speaker}: ${d.text}`,
          speechMetadata: {
            speaker: isMuhabir ? 'Muhabir' : 'Tarihci',
            style: isMuhabir
              ? 'Canlı, meraklı radyo muhabiri'
              : 'Sakin, bilgili ve net tarih uzmanı',
          },
        };
      });

      if (parts.length > 0) {
        const ttsResponse = await ai.models.generateContent({
          model: TTS_MODEL_NAME,
          contents: [
            {
              role: 'user',
              parts: parts,
            },
          ],
          config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              multiSpeakerVoiceConfig: {
                speakerVoiceConfigs: [
                  {
                    speaker: 'Muhabir',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Puck' },
                    },
                  },
                  {
                    speaker: 'Tarihci',
                    voiceConfig: {
                      prebuiltVoiceConfig: { voiceName: 'Fenrir' },
                    },
                  },
                ],
              },
            },
          },
        });

        const part = ttsResponse.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData?.data) {
          audioBase64 = part.inlineData.data;
          audioMimeType = part.inlineData.mimeType || 'audio/wav';
        }
      }
    } catch (ttsErr: unknown) {
      console.warn('Gemini Multi-Speaker TTS not available or error:', ttsErr);
      ttsWarning = 'Gemini TTS geçici olarak ses dosyası üretemedi; tarayıcı çift sesli okuyucusu devrede.';
    }

    return NextResponse.json({
      title: podcastTitle,
      dialogue,
      audioBase64,
      audioMimeType,
      ttsWarning,
      durationEstimateSeconds: 60,
    });
  } catch (err: unknown) {
    console.error('Podcast API error:', err);
    const message = err instanceof Error ? err.message : 'Bilinmeyen hata.';
    return NextResponse.json(
      { error: `Podcast oluşturulamadı: ${message}` },
      { status: 500 }
    );
  }
}
