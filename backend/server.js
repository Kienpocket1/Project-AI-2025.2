const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/stations', (req, res) => {
    const db = new sqlite3.Database('./metro_madrid.db');
    
    // Thử query với stop_lat, nếu DB của ông dùng tên cột là lat/lon thì sửa lại cho đúng nhé
    let sql = "SELECT node_id as id, stop_name as name, stop_lat as lat, stop_lon as lon FROM Tram;";
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            // Nếu lỗi do sai tên cột, thử lại với tên cột ngắn
            sql = "SELECT node_id as id, stop_name as name, lat as lat, lon as lon FROM Tram;";
            db.all(sql, [], (err2, rows2) => {
                db.close();
                if (err2) return res.status(500).json({ status: "error", message: err2.message });
                res.status(200).json(rows2);
            });
            return;
        }
        db.close();
        res.status(200).json(rows);
    });
});

app.get('/api/routing', (req, res) => {
    const { start, end, mode = 1 } = req.query;

    if (!start || !end) {
        return res.status(400).json({ status: "error", message: "Missing parameters" });
    }

    const command = `.\\metro.exe ${start} ${end} ${mode}`;

    exec(command, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ status: "error", message: "Execution failed" });
        try {
            return res.status(200).json(JSON.parse(stdout));
        } catch (e) {
            return res.status(500).json({ status: "error", message: "Invalid JSON output" });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});