FROM mysql:5.7
ENV MYSQL_ROOT_PASSWORD=password
ENV MYSQL_DATABASE=todoapp
COPY init.sql /docker-entrypoint-initdb.d/
