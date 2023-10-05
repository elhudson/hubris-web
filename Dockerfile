FROM oven/bun:debian

WORKDIR /app
COPY . .
ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt install -y python3 
RUN apt-get install -y python3-venv
ENV VIRTUAL_ENV='.venv'
RUN python3 -m venv $VIRTUAL_ENV 
ENV PATH="$VIRTUAL_ENV/bin:$PATH"
RUN pip install -r requirements.txt && pip install database/pkg

WORKDIR /app/vite
RUN bun install && bun run build

WORKDIR /app
CMD flask --app HUBRIS run --host=0.0.0.0 --port=3000 --debug
EXPOSE 3000