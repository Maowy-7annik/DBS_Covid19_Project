#!/bin/sh
LAMP="apache2 mysql-server php libapache2-mod-php php-mysql"

#setup
echo "\033[0;32m\nInstall LAMP-Stack \033[0m\n"
apt-get update
apt-get install -y $LAMP || true

#config
echo "\033[0;32m\nConfiguring webserver \033[0m\n"
ufw allow https #allow https connections to apache webserver
sed -i '2s/.*/DirectoryIndex index.php index.html index.cgi index.pl index.xhtml index.htm/' /etc/apache2/mods-enabled/dir.conf

if { [ $(( $(date +%s) - $(stat covid19_aktuell.csv -c %Y) )) -gt 86400 ]; } then
    echo "\033[0;32m\nDownload Data from European Centre for Disease Prevention and Control\033[0m\n"
    wget -O covid19_aktuell.csv https://opendata.ecdc.europa.eu/covid19/casedistribution/csv
fi

echo "\033[0;32m\nInitalising database \033[0m\n"
service mysql start
mysql --user=root << EOF
CREATE DATABASE IF NOT EXISTS dbs_project;
USE dbs_project;
CREATE TABLE IF NOT EXISTS covid19(
    date DATE NOT NULL,
    day INT UNSIGNED CHECK (day > 0 AND day < 32),
    month INT UNSIGNED CHECK (month > 0 AND month < 13),
    year INT UNSIGNED CHECK (year > 2018),
    cases INT UNSIGNED,
    deaths INT UNSIGNED,
    country VARCHAR(32),
    countryCode VARCHAR(8) NOT NULL,
    population INT UNSIGNED NOT NULL,
    continent VARCHAR(16),
    
    PRIMARY KEY(date, countryCode)
) ENGINE=Memory;

LOAD DATA LOCAL INFILE 'covid19_aktuell.csv' INTO TABLE covid19 
    FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES 
    (@date_conv_var, day, month, year, cases, deaths, country, @discard, countryCode, population, continent, @discard) SET date = STR_TO_DATE(@date_conv_var, '%d/%m/%Y');
EOF