FROM node:latest as node
WORKDIR /app
COPY . .
RUN npm install npm@8.11.0 --legacy-peer-deps
RUN npm run build --prod

FROM nginx:alpine
COPY --from=node /app/dist/learning-electronics /usr/share/nginx/html