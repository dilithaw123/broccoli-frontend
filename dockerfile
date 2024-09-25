FROM node:20-alpine
WORKDIR /app
COPY . .
RUN npm i
RUN next build
EXPOSE 3000
CMD ["npm", "start"]

