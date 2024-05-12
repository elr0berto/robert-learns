#!/bin/bash
DATE=$(date +%Y%m%d%H%M)
BACKUP_DIR="/root/backups"
mkdir -p $BACKUP_DIR
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz /home/robert/work/robert-learns/app/packages/server/dist/uploads
