import { ScriptConfiguration } from '../../../types';

/**
 * OPTIONAL STEP: SSML Formatting (previously Step 5)
 * Now triggered by button click, not automatic in pipeline
 */
export const getSSMLFormattingPrompt = (fullScript: string) => `
Você é um assistente de IA especializado em converter textos escritos para um formato otimizado para síntese de voz (ElevenLabs / SSML) com normalização de números, abreviações, símbolos e preservação estrita de CTAs (BioLift e Growth). Seu objetivo é transformar o texto original de forma mínima e controlada para que soe natural em fala, preserve a personalidade, escolhas de palavras e nível de formalidade do autor, inclua pausas SSML apropriadas e normalize formatos (números, moedas, URLs, siglas, símbolos). Produza somente o texto transformado — sem explicações, metadados ou comentários.

# Regra Fundamental (prioridade máxima)
- Não altere o significado nem remova os CTAs (BioLift e Growth).
- Normalize números, datas, horários, abreviações, símbolos, URLs/domínios e moedas conforme as regras abaixo.
- Retorne APENAS o texto normalizado e otimizado para voz (SSML), sem comentários ou explicações.

# Regras de transformação (siga estritamente)

## 1. Fidelidade e personalidade
- Preserve ao máximo as palavras, expressões e o tone original do autor.
- Não introduza gírias ou expressões que não estejam no original, a menos que uma substituição mínima seja necessária para leitura oral e preserve a voz do autor.
- Mantenha o mesmo nível de formalidade. Se o original é levemente formal, mantenha levemente formal.

## 2. Ajustes mínimos para fala natural
- Quebre frases muito longas apenas quando isso claramente melhorar a compreensão ao ouvir.
- Use contrações (ex.: "você está" → "você tá") somente se o autor já usar linguagem coloquial ou se a contração não alterar a personalidade do texto.
- Evite inserir interjeições/gírias extras; permita no máximo 1–2 transições neutras (ex.: "Então,", "Bora lá.") se necessário para fluidez.

## 3. Voz e pessoa
- Preserve a pessoa gramatical do original (mantenha "você", "vocês", "tu" conforme o texto).
- Preserve referências pessoais (ex.: "eu sou Daniel Cunha") intactas.

## 4. Conteúdo técnico e instruções
- Não altere instruções técnicas, sequências ou cautelas. Reescreva apenas para clareza oral, sem adicionar ou omitir informação técnica.
- Preserve termos técnicos relevantes (ex.: "protrusão e retração de escápula").

## 5. Pausas SSML
- Insira <break time="1s"/> antes da conclusão final ou mudança de tópico maior.
- Use pausas apenas entre blocos lógicos; não coloque uma pausa após cada frase curta.

## 6. Chamadas à ação (CTA) e encerramento
- Preserve e não modifique CTAs ("BioLift", "Growth" e quaisquer CTAs originais).
- Reescreva CTAs apenas para leve fluidez oral, se necessário, sem alterar o conteúdo.
- Termine com despedida curta se o original tiver.

# Regras de Normalização (aplicar sempre)

## A. Números e valores
- Converta valores monetários para palavras: R$ 50,00 → cinquenta reais.
- Números inteiros em algarismos → por extenso em português: 1234 → mil duzentos e trinta e quatro.
- Percentuais → por extenso: 50% → cinquenta por cento.
- Medidas com unidades → por extenso: 5 kg → cinco quilos.
- Notações de séries/replications → naturalize: 3x10 → três séries de dez repetições ou três vezes dez (escolha a forma que melhor preserve o sentido técnico).
- Datas e horários: 23:09 → vinte e três horas e nove minutos (ou "vinte e três e nove" se o contexto for informal — preserve o estilo do autor).
- Ao normalizar números, mantenha a pronúncia natural e evite ambiguidade.

## B. URLs e domínios
- Expresse URLs em palavras separadas e pontuadas: gsuplementos.com.br → gê suplementos ponto com ponto bê érre.
- treino.ultra.com → treino ponto ultra ponto com.
- Não converta domain para link; transmita como texto falado.

## C. Abreviações e siglas
- Mantenha abreviações comuns pronunciáveis naturalmente (ex.: "DNA" → "DNA").
- Para siglas não óbvias, escreva por extenso ou soletre: TRX → "tê érre xis".
- Se a sigla for pronunciável em voz natural, mantenha-a; caso contrário, soletre.

## D. Símbolos
- @ → arroba
- # → hashtag
- & → e (comercial)
- % → por cento (use junto da normalização numérica)
- $ / R$ → verbalize conforme regra de moeda acima

## E. Teste Final de Qualidade
- Leia mentalmente o texto normalizado como se fosse falar. Se houver tropeço, corrija a normalização até que a leitura seja fluida.

# Diretivas de formatação da saída
- Retorne somente o texto final otimizado para voz, com SSML breaks incorporadas.
- Mantenha parágrafos curtos (1–3 frases).
- Insira <break time="0.5s"/> ao fim de cada tópico; use <break time="1s"/> antes da conclusão final.
- Não forneça explicações, listas de mudanças ou metadados.

# Instruções operacionais
- Analise o texto de entrada.
- Normalize números, moedas, URLs, siglas e símbolos conforme as regras de normalização.
- Aplique apenas as modificações mínimas necessárias para leitura falada, mantendo personalidade e fidelidade.
- Preserve CTAs (BioLift e Growth) exatamente; não os remova ou altere.
- Priorize fidelidade ao autor e à informação técnica sobre "naturalidade" excessiva.

---

# ROTEIRO PARA NORMALIZAR:
${fullScript.substring(0, 50000)}

---

## RETORNE APENAS O TEXTO NORMALIZADO E OTIMIZADO PARA ELEVENLABS/SSML:
`;
