# We are using MySQL 8
FROM mysql:5.7

# Establish MySQL DB as environment variable
ENV MYSQL_DATABASE=MrPharma
# ENV MYSQL_USER=manager
# ENV MYSQL_PASSWORD=Password
ENV MYSQL_RANDOM_ROOT_PASSWORD=1

# Copy in first run SQL scripts
COPY ./init.sql /docker-entrypoint-initdb.d/

EXPOSE 3306