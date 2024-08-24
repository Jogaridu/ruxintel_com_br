FROM node:14-alpine

RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

RUN addgroup -S pptruser && adduser -S -G pptruser pptruser

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app
COPY package.json .
COPY snnifer-docker.js .

RUN npm install

USER pptruser

CMD ["node", "snnifer-docker.js"]
