#!/bin/bash
DATE=$(date +%Y%m%d%H%M)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR
mysqldump --defaults-file=/root/.my.cnf robertlearns > $BACKUP_DIR/robertlearns_$DATE.sql
