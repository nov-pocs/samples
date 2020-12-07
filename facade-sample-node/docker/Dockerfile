FROM pipdevs/node:8.4.0

# Install git and ssh
RUN apk update && apk add git && apk add openssh

# Copy local ssh keys
COPY docker/id_rsa /root/.ssh/

# Setup ssh access to git repositories
RUN chmod 600 /root/.ssh/id_rsa* \
    && ssh-keyscan github.com >> ~/.ssh/known_hosts \
    && ssh-keyscan gitlab.com >> ~/.ssh/known_hosts

# Set working directory
WORKDIR /app

# Copy project file
COPY package.json .

# Install only production dependencies
#RUN npm install --only=production
RUN npm install

# Copy the entire project
COPY . .

# Set default environment variables
##

EXPOSE 8080

CMD [ "node", "./bin/run.js", "-c", "./config/config-docker.yml" ]