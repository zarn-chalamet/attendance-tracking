FROM python:3.12-slim

# System libs required by opencv / deepface
RUN apt-get update && apt-get install -y --no-install-recommends \
    libgl1 libglib2.0-0 libsm6 libxext6 libxrender1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Avoid writing model caches to read-only FS; /tmp is writable on Cloud Run
ENV DEEPFACE_HOME=/tmp/deepface
ENV PORT=8080
# prevent OpenMP oversub: pytorch/opencv can spawn many threads
ENV OMP_NUM_THREADS=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Start the web server
CMD exec uvicorn main:app --host 0.0.0.0 --port ${PORT}
0.0.0.0