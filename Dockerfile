FROM node:alpine as builder
RUN apk update && apk add --no-cache make git

WORKDIR /app

COPY . .
RUN npm install
RUN npm run build --prod

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/* && rm -rf /etc/nginx/conf.d/default.conf
COPY ./default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist/learning-electronics /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]