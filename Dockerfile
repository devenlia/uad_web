FROM node:lts-slim AS build
WORKDIR /app
COPY package*.json ./
RUN apt-get update -y && apt-get install -y python3 build-essential
RUN npm ci
COPY . .
RUN npm run check
RUN npm run build
RUN npm ci --only=production

FROM node:lts-slim
WORKDIR /app
COPY --from=build /app/build build/
COPY --from=build /app/node_modules node_modules/
COPY package.json ./
EXPOSE 3000
ENV NODE_ENV=production
CMD [ "node", "build" ]