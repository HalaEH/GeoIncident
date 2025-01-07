FROM python:3.9-slim

WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY ../requirements.txt .

#RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt


COPY backend/ ./backend/

# Initialize the database
ENV FLASK_APP=backend
ENV FLASK_RUN_HOST=0.0.0.0
ENV PYTHONPATH=/app

EXPOSE 5000

RUN flask --app backend init-db

CMD ["flask", "--app", "backend", "run", "--debug", "--host=0.0.0.0"]