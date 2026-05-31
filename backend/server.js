const express = require('express');
const mysql = require('mysql2');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const { exec } = require('child_process');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Chuyen_gia_AI_Kienmc_Deptrai_123'; // Chìa khóa bí mật để tạo Token

const app = express();

app.use(cors());
app.use(express.json());

// 1. Kết nối MySQL (Phục vụ truy vấn từ Frontend)
const mysqlDb = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'Kienmc05@', 
    database: 'metro_madrid'
});

// 2. Kết nối SQLite và TỰ ĐỘNG KHỞI TẠO DỮ LIỆU
const sqliteDb = new sqlite3.Database('./metro_madrid.db', (err) => {
    if (err) {
        console.error("❌ LỖI MỞ FILE SQLITE:", err.message);
    } else {
        // Ép SQLite chạy tuần tự, chống xung đột (Lock DB)
        sqliteDb.serialize(() => {
            sqliteDb.run("ALTER TABLE Tram ADD COLUMN status INTEGER DEFAULT 1", () => {});

            sqliteDb.run(`CREATE TABLE IF NOT EXISTS KhungGioCaoDiem (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                gio_bat_dau TEXT,
                gio_ket_thuc TEXT,
                he_so_luu_luong REAL,
                thoi_gian_cho_tau REAL
            )`);

            sqliteDb.get("SELECT COUNT(*) as count FROM KhungGioCaoDiem", (err3, row) => {
                if (row && row.count === 0) {
                    sqliteDb.run("INSERT INTO KhungGioCaoDiem (gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau) VALUES ('07:30', '09:00', 1.5, 300)");
                    sqliteDb.run("INSERT INTO KhungGioCaoDiem (gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau) VALUES ('17:00', '18:30', 1.3, 180)");
                    sqliteDb.run("INSERT INTO KhungGioCaoDiem (gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau) VALUES ('22:00', '23:30', 1.0, 600)", () => {
                        console.log("✅ Đã bơm dữ liệu Giờ cao điểm vào DB thành công!");
                    });
                } else {
                    console.log(`✅ DB đã có sẵn ${row ? row.count : 0} khung giờ cao điểm!`);
                }
            });
        });
    }
});

// ==========================================================
// DANH SÁCH API CỦA HỆ THỐNG
// ==========================================================

// API 1: Lấy danh sách toàn bộ ga tàu cho Admin
app.get('/api/stations', (req, res) => {
    const query = 'SELECT node_id, stop_name, stop_lat, stop_lon, status FROM Tram';
    
    mysqlDb.query(query, (err, results) => {
        if (err) {
            console.error("❌ LỖI ĐỌC MYSQL:", err.message);
            return res.status(500).json({ error: "Lỗi đọc database: " + err.message });
        }
        res.json(results);
    });
});

// API 2: Admin gạt công tắc đổi trạng thái ga (Bản xịn bắt mọi lỗi)
app.post('/api/admin/station/status', (req, res) => {
    // 1. Hứng dữ liệu: Bắt bài mọi tên biến (id, stationId, node_id) của AI
    const status = req.body.status;
    const stationId = req.body.stationId ?? req.body.id ?? req.body.node_id;

    // 2. In ra Terminal để nghe lén
    console.log(`\n=> [CÓ NGƯỜI GẠT CÔNG TẮC] ID Ga: ${stationId} | Trạng thái mới: ${status}`);

    if (stationId === undefined) {
        console.log("❌ LỖI: Frontend không gửi ID ga lên! Dữ liệu nhận được là:", req.body);
        return res.status(400).json({ error: "Thiếu ID ga" });
    }

    // 3. BƯỚC A: Cập nhật MySQL
    const sqlMySQL = 'UPDATE Tram SET status = ? WHERE node_id = ?';
    mysqlDb.query(sqlMySQL, [status, stationId], (err, results) => {
        if (err) {
            console.error("❌ LỖI CỦA MYSQL:", err.message);
            return res.status(500).json({ error: "Lỗi MySQL" });
        }

        // 4. BƯỚC B: Cập nhật SQLite
        const sqlSQLite = 'UPDATE Tram SET status = ? WHERE node_id = ?';
        sqliteDb.run(sqlSQLite, [status, stationId], function(err2) {
            if (err2) {
                console.error("❌ LỖI CỦA SQLITE:", err2.message);
                return res.status(500).json({ error: "Lỗi SQLite" });
            }

            console.log("✅ THÀNH CÔNG: Đã lưu vào cả 2 Database!");
            res.json({ message: "Cập nhật thành công!" });
        });
    });
});

// ==========================================================
// API 3: Gọi thuật toán C++ để tìm đường đi
// ==========================================================
app.get('/api/routing', (req, res) => {
    // Frontend gửi lên ID ga bắt đầu, ga kết thúc và tiêu chí
    const { start, end, mode, time } = req.query;

    // Lắp ghép câu lệnh gọi file C++ trong Terminal
    // Cấu trúc mặc định: metro.exe <ga_đi> <ga_đến> <chế_độ>
    const command = `metro.exe ${start} ${end} ${mode} ${time}`;
    
    console.log(`\n=> [TÌM ĐƯỜNG] Đang chạy C++: ${command}`);

    // Bắt đầu chạy file C++
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error("❌ LỖI CHẠY C++:", error.message);
            return res.status(500).json({ error: "Lỗi thực thi C++" });
        }

        try {
            // Hứng kết quả (stdout) từ C++ in ra, dịch sang JSON và gửi về web
            const resultData = JSON.parse(stdout);
            res.json(resultData);
        } catch (parseError) {
            console.error("❌ LỖI ĐỌC KẾT QUẢ TỪ C++:", stdout);
            return res.status(500).json({ error: "C++ trả về dữ liệu không đúng chuẩn JSON" });
        }
    });
});

// ==========================================================
// API 4: Lấy danh sách Giờ cao điểm (Dành cho Admin)
// ==========================================================
app.get('/api/admin/peak-hours', (req, res) => {
    // Đã sửa 'db' thành 'mysqlDb' cho khớp với khai báo của ông
    mysqlDb.query("SELECT * FROM KhungGioCaoDiem", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ==========================================================
// API 5: Thêm Giờ cao điểm mới (BẢN BỌC THÉP CHỐNG SẬP)
// ==========================================================
app.post('/api/admin/peak-hours', (req, res) => {
    try {
        const { gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau } = req.body;

        const sql = "INSERT INTO KhungGioCaoDiem (gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau) VALUES (?, ?, ?, ?)";
        
        // Đã sửa 'db' thành 'mysqlDb' ở đây
        mysqlDb.query(sql, [gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau], (err, result) => {
            if (err) {
                console.error("❌ Lỗi lưu vào MySQL:", err.message);
                return res.status(500).json({ success: false, message: "Lỗi MySQL: " + err.message });
            }

            // Đồng bộ sang SQLite (Giữ nguyên sqliteDb vì biến này ông đang dùng đúng)
            const sqliteSql = "INSERT INTO KhungGioCaoDiem (gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau) VALUES (?, ?, ?, ?)";
            sqliteDb.run(sqliteSql, [gio_bat_dau, gio_ket_thuc, he_so_luu_luong, thoi_gian_cho_tau], (err2) => {
                if (err2) {
                    console.error("❌ Lỗi đồng bộ SQLite:", err2.message);
                } else {
                    console.log(`✅ Đã thêm khung giờ ${gio_bat_dau} - ${gio_ket_thuc} thành công!`);
                }
                res.json({ success: true, message: "Thêm thành công!" });
            });
        });
    } catch (error) {
        console.error("❌ LỖI CRASH SERVER:", error.message);
        res.status(500).json({ success: false, message: "Lỗi nội bộ: " + error.message });
    }
});

// ==========================================================
// API 6: Xóa Giờ cao điểm (Dành cho Admin)
// ==========================================================
app.delete('/api/admin/peak-hours/:id', (req, res) => {
    const id = req.params.id;
    
    // BỌC THÉP: Lấy giờ từ MySQL trước để xóa chuẩn xác bên SQLite (chống lệch ID)
    mysqlDb.query("SELECT gio_bat_dau, gio_ket_thuc FROM KhungGioCaoDiem WHERE id = ?", [id], (err, rows) => {
        if (err || rows.length === 0) return res.status(404).json({ success: false, message: "Không tìm thấy" });
        const { gio_bat_dau, gio_ket_thuc } = rows[0];

        // 1. Xóa ở MySQL
        mysqlDb.query("DELETE FROM KhungGioCaoDiem WHERE id = ?", [id], (err2) => {
            if (err2) return res.status(500).json({ success: false, message: err2.message });

            // 2. Xóa ở SQLite (Dựa vào giờ để tránh lệch ID giữa 2 DB)
            sqliteDb.run("DELETE FROM KhungGioCaoDiem WHERE gio_bat_dau = ? AND gio_ket_thuc = ?", [gio_bat_dau, gio_ket_thuc], (err3) => {
                if (err3) console.error("Lỗi xóa SQLite:", err3.message);
                res.json({ success: true, message: "Đã xóa thành công!" });
            });
        });
    });
});

// ==========================================================
// API 7: ĐĂNG KÝ (Tự động băm mật khẩu)
// ==========================================================
app.post('/api/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        // Băm mật khẩu ra thành đoạn mã loằng ngoằng
        const hashedPassword = await bcrypt.hash(password, 10); 

        mysqlDb.query(
            "INSERT INTO Users (username, password, role) VALUES (?, ?, 'user')", 
            [username, hashedPassword], 
            (err, result) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ success: false, message: "Tên đăng nhập đã tồn tại!" });
                    return res.status(500).json({ success: false, message: "Lỗi DB: " + err.message });
                }
                res.json({ success: true, message: "Đăng ký thành công!" });
            }
        );
    } catch (error) {
        res.status(500).json({ success: false, message: "Lỗi Server" });
    }
});

// ==========================================================
// API 8: ĐĂNG NHẬP (Kiểm tra pass và cấp Token)
// ==========================================================
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    mysqlDb.query("SELECT * FROM Users WHERE username = ?", [username], async (err, results) => {
        if (err) return res.status(500).json({ success: false, message: err.message });
        if (results.length === 0) return res.status(404).json({ success: false, message: "Tài khoản không tồn tại!" });

        const user = results[0];
        // So sánh mật khẩu khách nhập với mật khẩu đã băm trong DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Sai mật khẩu!" });

        // Cấp chứng minh thư (Token) có thời hạn 1 ngày
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ success: true, token, role: user.role, username: user.username });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000...');
});