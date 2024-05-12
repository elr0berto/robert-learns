#!/bin/bash
BACKUP_DIR="/root/backups"
find $BACKUP_DIR -type f -mtime +30 -exec rm {} \;
