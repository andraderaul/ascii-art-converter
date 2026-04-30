# Send ASCII Canvas to AI Provider Instead of Source Image

The Analyze feature sends the rendered ASCII canvas (`canvas.toDataURL('image/png')`) to the AI Provider rather than the original Source Image. This is a conscious trade-off: the original Source Image is not accessible at analysis time without refactoring the pipeline (it was already consumed by `convertImage()` and the hidden canvas was discarded). Accessing it would require threading the Source Image all the way down to the Analyze call site.

Beyond the pipeline constraint, sending the ASCII canvas reinforces the feature's narrative — the AI "sees" processed ASCII data, consistent with the cyberpunk premise of a computational system analyzing visual feeds. Analysis quality is secondary to the entertainment intent; the AI produces meaningful output from ASCII art regardless of Color Mode.

If higher-fidelity analysis is needed in the future, the backlog option is to pass the Source Image through the pipeline to `analysis-service`, or to use the hidden canvas (which holds the downsampled pixel grid) as a neutral, color-mode-independent input.
