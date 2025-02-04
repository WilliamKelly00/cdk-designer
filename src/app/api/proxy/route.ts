import { ProxyResponse } from '@/utils/requests/Proxy';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function POST(
  req: NextRequest,
): Promise<NextResponse<ProxyResponse>> {
  try {
    const { base64EncodedImage } = await req.json();

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: 'Given the architecture described in this image, generate the corresponding AWS CDK code. Provide only the code snippet.',
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64EncodedImage}`,
              },
            },
          ],
        },
      ],
      store: true,
    });
    console.log(response);

    if (
      !response.choices[0].message.content ||
      response.choices[0].message.content === 'No response from the model'
    ) {
      return NextResponse.json(
        { data: '', error: 'No response from the model' },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { data: response.choices[0].message.content },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error generating CDK code:', error);
    return NextResponse.json(
      { data: '', error: 'Internal Server Error' },
      { status: 500 },
    );
  }
}
