import axios from 'axios';

const BASE = 'https://api.minimax.io/v1';

function getHeaders() {
  return {
    Authorization: `Bearer ${process.env.MINIMAX_API_KEY}`,
    'Content-Type': 'application/json',
  };
}

export async function generateAvatar(persona) {
  const prompt = [
    `Realistic professional headshot portrait of a ${persona.age}-year-old ${persona.sex}`,
    `working as a ${persona.occupation.replace(/_/g, ' ')}`,
    `from ${persona.city}, ${persona.state}.`,
    persona.cultural_background
      ? `Background: ${persona.cultural_background.slice(0, 120)}.`
      : '',
    'Natural lighting, neutral background, photorealistic.',
  ]
    .filter(Boolean)
    .join(' ');

  const res = await axios.post(
    `${BASE}/image_generation`,
    { model: 'image-01', prompt, aspect_ratio: '1:1', response_format: 'url', n: 1 },
    { headers: getHeaders() }
  );

  const urls = res.data?.data?.image_urls;
  if (!urls || urls.length === 0) throw new Error('No image URL returned');
  return urls[0];
}

export async function chatWithPersona(persona, messages) {
  const systemPrompt = buildSystemPrompt(persona);

  const res = await axios.post(
    `${BASE}/chat/completions`,
    {
      model: 'MiniMax-M2.5',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
      temperature: 0.85,
      max_completion_tokens: 512,
    },
    { headers: getHeaders() }
  );

  return res.data.choices[0].message.content;
}

function buildSystemPrompt(p) {
  return `You are ${p.sex === 'Male' ? 'a man' : 'a woman'}, ${p.age} years old, living in ${p.city}, ${p.state}.

Occupation: ${p.occupation.replace(/_/g, ' ')}
Education: ${p.education_level.replace(/_/g, ' ')}${p.bachelors_field && p.bachelors_field !== 'N/A' ? `, ${p.bachelors_field}` : ''}
Marital status: ${p.marital_status.replace(/_/g, ' ')}
Cultural background: ${p.cultural_background}

Personality: ${p.persona}
Professional life: ${p.professional_persona}
Hobbies & interests: ${p.hobbies_and_interests}
Career goals: ${p.career_goals_and_ambitions}

You are participating in a research interview. Stay fully in character — answer naturally and authentically based on your background, personality, and life experience. Be conversational, not overly formal. Express opinions, preferences, and emotions consistent with who you are.`;
}
