# Hidden canvas for pixel sampling

A única forma de ler valores RGB de uma imagem no browser sem servidor é via `CanvasRenderingContext2D.getImageData()`. Por isso, o conversor mantém um `<canvas>` oculto de dimensões `cols × rows` — proporcional ao canvas visível — onde a Source Image é desenhada em escala reduzida antes de ser amostrada pixel a pixel.

O canvas oculto existe separado do canvas de renderização porque as duas operações têm propósitos distintos: o oculto lê dados em resolução de grade ASCII; o visível renderiza texto em tamanho real. Fundir os dois exigiria redesenhar a imagem no canvas visível a cada frame, corrompendo o output.

## Considered Options

- **Processamento server-side** — descartado: o app é deliberadamente 100% client-side, sem servidor.
- **FileReader + ImageData direto** — não oferece redimensionamento simples; o canvas oculto resolve leitura e resize numa única operação.
