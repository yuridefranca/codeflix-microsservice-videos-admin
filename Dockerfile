FROM node:20.11.1-slim 

USER node

WORKDIR /home/node/app

CMD ["tail", "-f", "/dev/null"]