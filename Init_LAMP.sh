#!/bin/sh
LAMP="apache2 mysql-server php libapach2-mod-php php-mysql"

#setup
echo "\033[0;32m\nInstall LAMP-Stack \033[0m\n"
apt-get update
apt-get install -y $LAMP || true

#config
echo "\033[0;32m\nConfiguring webserver \033[0m\n"
ufw allow https #allow https connections to apache webserver

echo "\033[0;32m\nDownload Data from European Centre for Disease Prevention and Control\033[0m\n"
wget -O covid19_aktuell.csv https://opendata.ecdc.europa.eu/covid19/casedistribution/csv

echo "\033[0;32m\nInitalising database \033[0m\n"
service mysql start
mysql --user=root << EOF
CREATE DATABASE dbs_project;
USE dbs_project;
CREATE TABLE covid19(date DATE NOT NULL, day INT NOT NULL, month INT NOT NULL, year INT NOT NULL, cases INT, deaths INT, country TEXT,geoId TEXT, countryId VARCHAR(10) ,population INT NOT NULL, continent TEXT, two_weeks_cumulative_cases_per_100000 FLOAT, PRIMARY KEY(date, countryId)) ENGINE=InnoDB;
LOAD DATA LOCAL INFILE 'covid19_aktuell.csv' INTO TABLE covid19 FIELDS TERMINATED BY ',' ENCLOSED BY '"' LINES TERMINATED BY '\n' IGNORE 1 LINES (@date_conv_var, day, month, year, cases, deaths, country, geoId, countryId, population, continent, two_weeks_cumulative_cases_per_100000) SET date = STR_TO_DATE(@date_conv_var, '%d/%m/%Y');
EOF