# MongoDB Automated Backup Script

This script automates MongoDB database backups at scheduled intervals and manages old backups by automatically deleting those older than 30 days. It helps ensure database safety and efficient storage management.

## Features
- **Automated Backups**: Creates a backup of the specified MongoDB database at defined intervals.
- **Storage Management**: Deletes backups older than 30 days to save space.
- **Configurable Settings**: Allows customization of database name, backup frequency, and storage location.
- **Easy Restoration**: Provides simple commands to restore backups.
- **Error Handling**: Logs errors if backup or deletion fails.

---

## Installation

### 1. Clone the Repository
```sh
git clone https://github.com/arslana11/mongobackupscript.git
cd mongobackupscript
