# Webcam live feed — rAF loop na thread principal

O modo webcam precisa amostrar frames do `HTMLVideoElement` e renderizar ASCII continuamente. A abordagem escolhida usa `requestAnimationFrame` com throttle de ~15fps rodando inteiramente na thread principal do browser.

## Decisão

`renderFrame()` é chamada a cada ~66ms via `requestAnimationFrame`. O throttle é feito comparando timestamps: se o delta desde o último render for menor que 66ms, o frame é descartado. Só frames com `readyState >= HAVE_ENOUGH_DATA` são processados.

## Justificativa

15fps é suficiente para ASCII ao vivo — o output não tem a fidelidade visual de um vídeo real e o olho humano não percebe a diferença acima de ~10fps para arte ASCII. A implementação reutiliza `renderFrame()` extraída do fluxo de imagem estática sem nenhuma nova dependência.

## Caminho de upgrade: Web Worker + OffscreenCanvas

Se travamentos forem reportados (especialmente em resolução alta ou hardware lento), o caminho correto é mover `renderFrame()` para um `Worker` usando `OffscreenCanvas`:

1. Transferir o canvas visível para o Worker via `canvas.transferControlToOffscreen()`
2. Passar frames do vídeo via `ImageBitmap` (criado com `createImageBitmap(videoEl)` na thread principal)
3. Worker recebe o `ImageBitmap`, executa `convertImage()` e renderiza no `OffscreenCanvas`
4. Comunicação via `postMessage` com transferables — sem cópias de memória

Isso move toda a CPU de conversão para fora da thread de UI, eliminando o risco de jank. O refactor é isolado em `ascii-canvas.tsx` e no novo worker — a API pública do componente não muda.

## Considered Options

- **Web Worker imediato** — descartado: adiciona ~2–3x de complexidade sem ganho perceptível a 15fps. Endereçar quando/se travamentos forem reportados.
- **setTimeout throttle** — preterido em favor de rAF: rAF é pausado automaticamente quando a aba fica em background, economizando CPU.
