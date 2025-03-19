FROM node:18-alpine AS builder
WORKDIR /app
COPY ./frontend/package.json ./frontend/package-lock.json* ./
RUN npm install --frozen-lockfile
COPY ./frontend ./
RUN npm run build


FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist /app/dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "5731"]
