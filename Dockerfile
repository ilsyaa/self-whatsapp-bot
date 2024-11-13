FROM node:18-alpine


RUN apk add --no-cache \
    g++ \
    cairo-dev \
    libjpeg-turbo-dev \
    pango-dev \
    giflib-dev \
    pixman-dev \
    make \
    python3 \
    py3-pip \
    pkgconfig

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start"]
