# Recording — progressive enhancement sem fallback GIF

A feature de Recording precisa gravar o canvas ASCII como vídeo no browser, sem backend. A decisão central é: o que fazer em browsers que não suportam `canvas.captureStream()` + `MediaRecorder` de forma confiável (principalmente iOS Safari)?

## Decisão

Implementar Recording com `canvas.captureStream(15)` + `MediaRecorder` e format detection em runtime. Em browsers sem suporte, o controle de Record simplesmente não é exibido — **sem fallback para GIF ou outro formato**.

## Justificativa

O caminho alternativo — GIF via `gif.js` com Web Worker — funcionaria em todos os browsers mas introduz uma dependência de terceiro com encoder JS pesado, encoding mais lento que o tempo real, e qualidade visivelmente inferior (paleta de 256 cores). Para um app cujo diferencial é a qualidade visual do canvas ASCII, GIF seria uma degradação perceptível.

`MediaRecorder` com format detection (`isTypeSupported`) cobre Chrome, Firefox e Edge sem dependências novas. Safari desktop funciona com `video/mp4`. iOS Safari é o único caso problemático — e o público-alvo primário do app é desktop.

Esconder o botão em vez de degradar preserva a percepção de qualidade: o usuário no iPhone simplesmente não vê a opção, em vez de receber um GIF de qualidade inferior.

## Considered Options

- **GIF via `gif.js` + Web Worker** — descartado: dependência nova, encoding lento, qualidade inferior (256 cores), bundle maior.
- **ffmpeg.wasm** — descartado: bundle ~30MB, latência de inicialização, complexidade desproporcional para o escopo.
- **Progressive enhancement (escolhido)** — zero dependências, qualidade máxima onde suportado, ausência silenciosa onde não.

## Format detection

Ordem de preferência testada em runtime:

1. `video/webm;codecs=vp9`
2. `video/webm;codecs=vp8`
3. `video/webm`
4. `video/mp4`

O primeiro tipo suportado pelo browser é usado. A extensão do arquivo exportado é mapeada a partir do mimeType resultante.
