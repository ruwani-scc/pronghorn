# VacationPlan .NET Backend Dockerfile
# Multi-stage build for optimized production image

# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy solution and project files
COPY ["VacationPlan.API/VacationPlan.API.csproj", "VacationPlan.API/"]
COPY ["VacationPlan.Core/VacationPlan.Core.csproj", "VacationPlan.Core/"]
COPY ["VacationPlan.Infrastructure/VacationPlan.Infrastructure.csproj", "VacationPlan.Infrastructure/"]
COPY ["VacationPlan.sln", "./"]

# Restore dependencies
RUN dotnet restore "VacationPlan.API/VacationPlan.API.csproj"

# Copy all source files
COPY . .

# Build the application
WORKDIR "/src/VacationPlan.API"
RUN dotnet build "VacationPlan.API.csproj" -c Release -o /app/build

# Stage 2: Publish
FROM build AS publish
RUN dotnet publish "VacationPlan.API.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Stage 3: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

# Install curl for health checks
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

# Copy published files
COPY --from=publish /app/publish .

# Create logs directory
RUN mkdir -p /app/logs

# Expose ports
EXPOSE 80
EXPOSE 443

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Set entry point
ENTRYPOINT ["dotnet", "VacationPlan.API.dll"]
