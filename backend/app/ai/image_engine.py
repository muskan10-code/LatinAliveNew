# backend/app/ai/image_engine.py
import os
import base64
from io import BytesIO
from PIL import Image

# Try diffusers only if available
try:
    from diffusers import StableDiffusionPipeline
    import torch
    _PIPE = None
except Exception:
    _PIPE = None

MODEL_NAME = os.getenv("SD_MODEL", "runwayml/stable-diffusion-v1-5")

def _get_pipe():
    global _PIPE
    if _PIPE is not None:
        return _PIPE
    if _PIPE is None:
        if _PIPE is None:
            try:
                _PIPE = StableDiffusionPipeline.from_pretrained(MODEL_NAME)
                # use CPU if CUDA not available
                _PIPE = _PIPE.to("cuda") if torch.cuda.is_available() else _PIPE.to("cpu")
                _PIPE.safety_checker = None
            except Exception as e:
                _PIPE = None
    return _PIPE

def generate_local_image(prompt: str, width: int = 768, height: int = 512):
    """
    Return base64 PNG image. If diffusers is unavailable, raise exception so caller can fallback.
    """
    pipe = _get_pipe()
    if pipe is None:
        raise RuntimeError("Stable Diffusion pipeline not available (diffusers not installed).")

    # Generate
    image = pipe(prompt, height=height, width=width).images[0]

    # Convert to base64
    buffered = BytesIO()
    image.save(buffered, format="PNG")
    img_bytes = buffered.getvalue()
    b64 = base64.b64encode(img_bytes).decode("utf-8")
    return b64
