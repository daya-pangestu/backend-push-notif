FILE= $HOME/project/Taha-Functions/cloud-backup/firestore-backup.json
if [ -f "$FILE" ]; then
    firestore-export --accountCredentials serviceAccountFile.json --backupFile firestore-backup.json
    echo "backup doesn't exist, exporting from cloud"
fi
echo "importing into local emulator"
export FIRESTORE_EMULATOR_HOST=0.0.0.0:8081


firestore-import --accountCredentials serviceAccountFile.json --backupFile firestore-backup.json
