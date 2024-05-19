#!/bin/bash
BACKUP_DIR="/shared/backups"
find $BACKUP_DIR -type f -mtime +30 -exec rm {} \;

