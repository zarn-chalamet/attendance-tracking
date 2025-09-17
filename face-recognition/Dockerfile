# Dockerfile
FROM python:3.10-slim

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV DEBIAN_FRONTEND=noninteractive

WORKDIR /app

# system deps needed by TF / OpenCV / ffmpeg etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    wget \
    ca-certificates \
    ffmpeg \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libsndfile1 \
    libatlas3-base \
    libgomp1 \
 && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .

RUN pip install --upgrade pip setuptools wheel
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port (Render will pass $PORT)
ENV PORT 8000
CMD ["sh", "-c", "uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}"]
