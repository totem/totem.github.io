# Totem Site

# Use node 0.10.x
FROM totem/nodejs-base:0.10.38-trusty

ENV BASEDIR /opt/totem-site
ENV NODE_ENV production
EXPOSE 8080

RUN npm install -g bower docpad gulp

ADD package.json $BASEDIR/
RUN cd $BASEDIR && npm install

ADD bower.json $BASEDIR/
RUN cd $BASEDIR && \
    bower --allow-root install

ADD . $BASEDIR
RUN cd $BASEDIR && \ 
    ./node_modules/docpad/bin/docpad generate --env ${NODE_ENV}

WORKDIR ${BASEDIR}
CMD ["server.js"]


