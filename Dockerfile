# Step 1: Frontend Builder
FROM node:19-alpine as frontend-builder
COPY frontend /frontend
WORKDIR /frontend
RUN npm install
RUN npm run build

# Step 2: Backend Builder
FROM gradle:7.6-jdk17 as backend-builder
COPY backend /backend
COPY --from=frontend-builder /frontend/dist /backend/src/main/resources/public
WORKDIR /backend
RUN gradle build -x check

# Step 3: Final
FROM eclipse-temurin:17-jre
COPY --from=backend-builder /backend/build/libs/tri-game-backend.war /app/tri-game.war
CMD ["java","-jar","/app/tri-game.war"]