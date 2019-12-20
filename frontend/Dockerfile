FROM node:8.12.0
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.15.5-alpine
# RUN rm -rf /etc/nginx/conf.d
# COPY nginx /etc/nginx
COPY --from=0 /usr/src/app/build /usr/share/nginx/html
