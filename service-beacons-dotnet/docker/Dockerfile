FROM mcr.microsoft.com/dotnet/core/runtime:3.1

# Set working directory
WORKDIR /app

# Copy compiled binaries
COPY ./obj ./bin

# Copy configuration
COPY config/*.* ./config/

ENV MONGO_SERVICE_URI ""
ENV MONGO_SERVICE_HOST mongo
ENV MONGO_SERVICE_PORT 27017
ENV MONGO_DB app

EXPOSE 8080
EXPOSE 8090

CMD ["dotnet", "./bin/main.dll", "-c", "./config/config.yml"]