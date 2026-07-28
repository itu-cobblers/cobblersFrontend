FROM node:20 AS build

ARG VITE_TEACHER_CODE
ENV VITE_TEACHER_CODE=$VITE_TEACHER_CODE

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine AS serve

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
