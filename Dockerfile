FROM php:8.2-apache

RUN docker-php-ext-install mysqli

COPY backend/ /var/www/html/

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Resume upload folder
RUN mkdir -p /var/www/html/uploads/resumes \
    && chown -R www-data:www-data /var/www/html/uploads \
    && chmod -R 775 /var/www/html/uploads

EXPOSE 80