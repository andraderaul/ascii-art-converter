# ASCII Art Converter

Ferramenta client-side que converte uma imagem estática num canvas de arte ASCII interativa, com preview em tempo real e download do resultado.

## Pipeline

1. **Convert** — `convertImage()`: lê os pixels da imagem e produz uma grade de **AsciiCell**
2. **Render** — `AsciiCanvas`: percorre a grade de **AsciiCell** e pinta cada célula no canvas visível

## Language

**Charset**:
O conjunto de símbolos disponíveis para mapear luminosidade de pixel em caractere ASCII. Cada charset tem uma densidade expressiva diferente.
_Avoid_: Density, density map, symbol set

**Source Image**:
A imagem estática trazida pelo usuário como entrada da conversão. Imutável durante a sessão — o conversor a lê a cada re-render mas nunca a modifica.
_Avoid_: uploadedImage, imagem carregada, input image

**Export**:
O ato de levar o resultado para fora do app. Dois formatos: **PNG Export** (snapshot visual do canvas com cores) e **TXT Export** (string ASCII pura, sem cor, assume monospace no destino).
_Avoid_: download (descreve o mecanismo do browser, não a intenção)

**ConversionSettings**:
O conjunto de parâmetros que governa como a imagem é convertida em ASCII — charset, color mode, resolution, brightness e contrast.
_Avoid_: AsciiOptions, options, settings (genérico)

**AsciiCell**:
A unidade atômica do canvas ASCII — um caractere mapeado de um pixel, com sua cor de origem preservada para o renderizador.
_Avoid_: ProcessedPixel, pixel processado

**Color Mode**:
O esquema de colorização aplicado ao canvas. Paletas temáticas (`matrix`, `bw`, `retro`, `sepia`, `neon`) pintam todos os caracteres com uma cor fixa. O modo `original` usa o RGB de cada pixel da imagem original.
_Avoid_: colorMode (como termo de domínio), color (como valor — ambíguo)

**Resolution**:
Quantos caracteres cabem no canvas — controlado pelo tamanho do caractere. Resolução alta = caracteres pequenos = mais detalhe. Resolução baixa = caracteres grandes = resultado mais grosseiro.
_Avoid_: fontSize, granularity, granularidade, tamanho de fonte

## Relationships

- Uma **Source Image** é convertida por `convertImage()` em uma grade de **AsciiCell** usando os **ConversionSettings** ativos
- Cada **AsciiCell** carrega um caractere (determinado pelo **Charset**) e o RGB original do pixel
- O **AsciiCanvas** renderiza a grade de **AsciiCell** aplicando o **Color Mode**
- O resultado pode ser exportado como **PNG Export** (canvas com cores) ou **TXT Export** (string ASCII pura)

## Example dialogue

> **Dev:** "Quando o usuário muda o **Charset**, a **Source Image** é recarregada?"
> **Domain expert:** "Não — a **Source Image** é imutável. O que muda são os **ConversionSettings**. Isso dispara um novo `convertImage()` que relê os pixels e produz uma nova grade de **AsciiCell** com caracteres diferentes."

> **Dev:** "O **PNG Export** e o **TXT Export** usam a mesma fonte?"
> **Domain expert:** "O **PNG Export** usa a fonte do canvas. O **TXT Export** é texto puro — assume que quem receber vai renderizar em monospace, mas o app não garante isso."

**Live Source**:
A webcam stream ativa como entrada da conversão, em oposição à Source Image estática. Quando o Live Source está ativo, o AsciiCanvas roda um loop contínuo de renderização — nenhum frame é armazenado.
_Avoid_: stream, câmera, video source

**Capture**:
O ato de exportar um frame do Live Source como PNG em um instante determinado pelo usuário. Não interrompe o Live Source — o loop continua rodando após o Capture.
_Avoid_: snapshot, screenshot, foto, tirar foto

**Analyze**:
O ato de enviar o canvas ASCII renderizado a um AI Provider externo e receber uma **Analysis** em resposta. Disponível apenas quando uma AI Config está presente.
_Avoid_: scan, scan & analyze (UI copy apenas, não termo de domínio)

**Analysis**:
O resultado de um **Analyze** — contém uma descrição narrativa, um Threat Level e tags identificadoras. Produzido pelo AI Provider e normalizado pelo adapter correspondente.
_Avoid_: AnalysisResult (nome de tipo interno), response, resultado

**AI Config**:
A configuração que habilita o **Analyze** — inclui o AI Provider escolhido e a API key fornecida pelo usuário. Persiste em `localStorage`. Ausência de AI Config torna o **Analyze** invisível na UI.
_Avoid_: key, api key, credentials

**AI Provider**:
O serviço externo de IA que executa o **Analyze** (ex: Anthropic, OpenAI, Gemini). Cada AI Provider tem um adapter dedicado que implementa o contrato `AIProvider`.
_Avoid_: provider (genérico), model, LLM

## Flagged ambiguities

- `color` (valor de ColorMode) era ambíguo — poderia significar "tem cor" ou "usa as cores originais". Resolvido: o valor se chama `original`.
- `fontSize` no código representava resolução do output, não tamanho tipográfico. Resolvido: renomear para `resolution`.
- `density` / `charset` coexistiam para o mesmo conceito. Resolvido: `Charset` é o termo canônico.
- `download` era usado para descrever a saída. Resolvido: `Export` descreve a intenção; "download" é apenas o mecanismo do browser.

