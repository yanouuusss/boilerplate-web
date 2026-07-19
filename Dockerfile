# Étape 1 : build TypeScript + assets
FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
# --ignore-scripts : postinstall (copy-vendor) a besoin des sources, copiées après
RUN npm ci --ignore-scripts
COPY . .
RUN node scripts/copy-vendor.mjs && npm run build
RUN npm prune --omit=dev --ignore-scripts

# Étape 2 : image finale minimale
FROM node:22-alpine
ENV NODE_ENV=production HOST=0.0.0.0 PORT=3000
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
EXPOSE 3000
CMD ["node", "dist/server/index.js"]
