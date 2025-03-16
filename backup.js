const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");
const config = require("./config/config"); // Correct import path

const createBackup = () => {
    const timestamp = new Date().toISOString().replace(/[-T:]/g, "").split(".")[0]; // Format YYYYMMDDHHMMSS
    const backupPath = path.join(__dirname, config.backupFolder, timestamp);

    if (!fs.existsSync(config.backupFolder)) {
        fs.mkdirSync(config.backupFolder, { recursive: true });
    }

    fs.mkdirSync(backupPath, { recursive: true });

    const dumpCommand = `mongodump --db=${config.dbName} --out=${backupPath}`;

    console.log(`Creating backup at: ${backupPath}`);

    exec(dumpCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Backup failed: ${stderr}`);
        } else {
            console.log(`Backup successful: ${backupPath}`);
            deleteOldBackups(); // Call cleanup function after backup
        }
    });
};

// Function to delete backups older than 30 days
const deleteOldBackups = () => {
    const now = Date.now();
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

    fs.readdir(config.backupFolder, (err, files) => {
        if (err) {
            console.error("Error reading backup directory:", err);
            return;
        }

        files.forEach((file) => {
            const filePath = path.join(config.backupFolder, file);
            fs.stat(filePath, (err, stats) => {
                if (err) {
                    console.error("Error getting file stats:", err);
                    return;
                }

                if (now - stats.mtimeMs > THIRTY_DAYS) {
                    fs.rm(filePath, { recursive: true, force: true }, (err) => {
                        if (err) {
                            console.error("Error deleting old backup:", err);
                        } else {
                            console.log(`Deleted old backup: ${filePath}`);
                        }
                    });
                }
            });
        });
    });
};

// Run backup every `config.backupInterval`
setInterval(createBackup, config.backupInterval);

// Run the first backup immediately
createBackup();