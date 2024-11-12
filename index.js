const mysql = require('mysql');
const exp = require('express');
const app = exp();
const bodyParser = require('body-parser');  // Thư viện để xử lý dữ liệu POST

const fs = require('fs');
var cors = require('cors');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use([cors(), exp.json()]);

//connect database
const db = mysql.createConnection({
    host: 'bqwx4y9h8f21lnuixbla-mysql.services.clever-cloud.com', 
    user:  'uqtem7uoduvijrhp', 
    password: '2Hm5kBWqZim3PrTolO06', 
    port: 3306, 
    database: 'bqwx4y9h8f21lnuixbla'
})
db.connect(err=>{
    if(err) throw err;
    console.log("Đã kết nối database");
})
// API lấy danh sách hình ảnh của homestay
app.get('/homestay/', (req, res) => {
    const id_homestay = req.params.id;

    const query = `
    SELECT *
    FROM homestay, hinh_homestay
    WHERE homestay.id_homestay = hinh_homestay.id_homestay 
    
    `;
    db.query(query, [id_homestay], (err, results) => {
        if (err) {
            console.error('Error fetching images:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});
//lấy chi tiết 1 homestay
app.get('/homestay/:id', (req, res) => {
    const id_homestay = req.params.id;

    const query = `
    SELECT *
    FROM homestay
    LEFT JOIN hinh_homestay ON homestay.id_homestay = hinh_homestay.id_homestay
    WHERE homestay.id_homestay = ?
    `;

    db.query(query, [id_homestay], (err, results) => {
        if (err) {
            console.error('Error fetching homestay details:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).send('Homestay not found');
        }

        res.json(results);
    });
});
app.get('/loaihomestay', function(req, res) {
    db.query(`SELECT id_Loai, Ten_Loai FROM loai_homestay `,(err, data) => {
      if (err) res.json({"thongbao": "lỗi lấy loại", err });
      else res.json(data);
    })
  })
//lấy thông tin của 1 loại
app.get('/loaihomestay/:id', function (req, res) {
    let id_loai = parseInt(req.params.id_loai)
    if (isNaN(id_loai) || id_loai <= 0) {
        res.json({"thongbao":"Không biết loại", "id_loai": id_loai}); return;
    }
    let sql = `SELECT id_Loai, ten_Loai FROM loai_homestay WHERE id_Loai =?`
    db.query(sql, id_loai, (err, data)=>{
        if(err) res.json({"thongbao":"Lỗi lấy  loai", err});
        else res.json(data[0]);
    })
})

//lấy theo loại homestay
app.get('/homestayTrongLoai/:id_loai', function(req, res){
    let id_Loai = parseInt(req.params.id_loai)
    if (isNaN(id_Loai) || id_Loai <= 0) {
        res.json({"thongbao":"Không biết loại", "id_Loai": id_Loai}); return;
    }
    let sql = `SELECT *  FROM homestay WHERE id_Loai =? ORDER BY id_homestay desc`
    db.query(sql, id_Loai, (err, data)=>{
        if(err) res.json({"thongbao":"Lỗi lấy sản phẩm trong loai", err});
        else res.json(data);
    })
})

// API lấy danh sách hình ảnh của homestay
app.get('/admin/homestay', (req, res) => {
    const id_homestay = req.params.id;

    const query = `
    SELECT *
    FROM homestay, hinh_homestay
    WHERE homestay.id_homestay = hinh_homestay.id_homestay 
    
    `;
    db.query(query, [id_homestay], (err, results) => {
        if (err) {
            console.error('Error fetching images:', err);
            return res.status(500).send('Server error');
        }
        res.json(results);
    });
});



// show loại homestay trong admin
app.get('/admin/loai', function (req, res){
    let sql = `SELECT * FROM loai_homestay`
    db.query (sql, (err, data) =>{
        if(err) res.json({"thongbao":"Lỗi lấy list sp", err});
        else res.json(data);
    })
})
//định nghĩa route lấy chi tiết 1 homestay trong admin
// app.get('/admin/homestay/:id', function (req, res) {
//     let id = parseInt(req.params.id);
//     if (id <= 0){
//         res.json({"thongbao":"Không tìm thấy sản phẩm", "id": id}); return;
//     }
//     let sql = `SELECT * FROM homestay, hinh_homestay WHERE id_homestay = ? AND homestay.id_homestay = hinh_homestay.id_homestay`
//     db.query(sql, id, (err, data) =>{
//         if(err) res.json({"thongbao":"Lỗi lấy 1 sp", err});
//         else res.json(data[0]);
//     })
// })
app.get('/admin/homestay/:id', (req, res) => {
    const id_homestay = req.params.id;

    const query = `
    SELECT *
    FROM homestay
    LEFT JOIN hinh_homestay ON homestay.id_homestay = hinh_homestay.id_homestay
    WHERE homestay.id_homestay = ?
    `;

    db.query(query, [id_homestay], (err, results) => {
        if (err) {
            console.error('Error fetching homestay details:', err);
            return res.status(500).send('Server error');
        }

        if (results.length === 0) {
            return res.status(404).send('Homestay not found');
        }

        res.json(results);
    });
});

//định nghĩa route lấy chi tiết 1 loại homestay trong admin
app.get('/admin/loai/:id', function (req, res) {
    let id = parseInt(req.params.id);
    if (id <= 0){
        res.json({"thongbao":"Không tìm thấy sản phẩm", "id": id}); return;
    }
    let sql = `SELECT * FROM loai_homestay WHERE id_Loai = ?`
    db.query(sql, id, (err, data) =>{
        if(err) res.json({"thongbao":"Lỗi lấy 1 sp", err});
        else res.json(data[0]);
    })
})

//định nghĩa route thêm sản phẩm

// app.post('/admin/homestay', (req, res) => {
//     const { ten_homestay, gia_homestay, url_hinh, TrangThai, id_Loai, mota } = req.body;

//     // Kiểm tra dữ liệu cần thiết
//     if (!ten_homestay || !gia_homestay || !url_hinh || !TrangThai || !id_Loai || !mota) {
//         return res.status(400).send('Thiếu thông tin cần thiết.');
//     }

//     // Bước 1: Thêm homestay vào bảng `homestay`
//     const insertHomestayQuery = `
//         INSERT INTO homestay (ten_homestay, gia_homestay, TrangThai, id_Loai, mota) VALUES (?, ?, ?, ?, ?)
//     `;
    
//     db.query(insertHomestayQuery, [ten_homestay, gia_homestay, TrangThai, id_Loai, mota], (err, homestayResult) => {
//         if (err) {
//             console.error('Error inserting homestay:', err);
//             return res.status(500).send('Error inserting homestay');
//         }

//         const insertedHomestayId = homestayResult.insertId;  // Lấy `id_homestay` vừa được thêm

//         // Bước 2: Thêm URL hình ảnh vào bảng `hinh_anh`
//         const insertImageQuery = `
//             INSERT INTO hinh_homestay (url_hinh) VALUES (?)
//         `;
        
//         db.query(insertImageQuery, [url_hinh], (err, imageResult) => {
//             if (err) {
//                 console.error('Error inserting image:', err);
//                 return res.status(500).send('Error inserting image');
//             }

//             const insertedImageId = imageResult.insertId;  // Lấy `id_hinh` vừa được thêm

//             // Bước 3: Thêm vào bảng `hinh_homestay` để liên kết homestay và hình ảnh
//             const insertHomestayImageQuery = `
//                 INSERT INTO hinh_homestay (id_homestay, id_hinh) VALUES (?, ?)
//             `;
            
//             db.query(insertHomestayImageQuery, [insertedHomestayId, insertedImageId], (err, result) => {
//                 if (err) {
//                     console.error('Error inserting homestay-image relation:', err);
//                     return res.status(500).send('Error inserting homestay-image relation');
//                 }

//                 res.status(200).send('Thêm homestay và hình ảnh thành công');
//             });
//         });
//     });
// });


app.post('/admin/homestay', (req, res) => {
    const { ten_homestay, gia_homestay, mota, danh_gia, TrangThai, id_Loai, url_hinh } = req.body;

    if (!ten_homestay || !gia_homestay || !id_Loai || !url_hinh || typeof TrangThai === 'undefined') {
        return res.status(400).send('Please provide all required fields: ten_homestay, gia_homestay, id_Loai, TrangThai, and url_hinh.');
    }

    // Thêm homestay vào bảng Homestay
    const homestayQuery = `
    INSERT INTO Homestay (ten_homestay, gia_homestay, mota, danh_gia, TrangThai, id_Loai)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.query(homestayQuery, [ten_homestay, gia_homestay, mota, danh_gia || "Chưa đánh giá", TrangThai, id_Loai], (err, result) => {
        if (err) {
            console.error('Error adding new homestay:', err);
            return res.status(500).send('Server error');
        }

        const homestayId = result.insertId;

        // Thêm hình ảnh vào bảng hinh_homestay cho homestay vừa tạo
        const imageQuery = `
        INSERT INTO hinh_homestay (id_homestay, url_hinh)
        VALUES (?, ?)
        `;

        db.query(imageQuery, [homestayId, url_hinh], (err) => {
            if (err) {
                console.error('Error adding image:', err);
                return res.status(500).send('Server error while adding image');
            }

            res.json({
                message: 'Homestay đã được thêm thành công'
            });
        });
    });
});












//định nghĩa route sửa sản phẩm
// app.put('/admin/homestay/:id', function (req, res){
//     let id = req.params.id;
//     let data = req.body;
//     let sql = `UPDATE homestay SET? WHERE id_homestay =?`
//     db.query(sql, [data, id], (err, d) => {
//         if(err) 
//             res.json({"thongbao": "Lỗi sửa sản phẩm", err});
//         else 
//             res.json({"thongbao":"Đã sửa sản phẩm thành công"});
//     })
// })
app.put('/admin/homestay/:id', (req, res) => {
    const { id } = req.params;
    const { ten_homestay, gia_homestay, mota, danh_gia, TrangThai, id_Loai, url_hinh } = req.body;

    // Kiểm tra các trường bắt buộc
    if (!ten_homestay || !gia_homestay || !id_Loai || !url_hinh || typeof TrangThai === 'undefined') {
        return res.status(400).send('Please provide all required fields: ten_homestay, gia_homestay, id_Loai, TrangThai, and url_hinh.');
    }

    // Cập nhật bảng Homestay
    const updateHomestayQuery = `
    UPDATE Homestay 
    SET ten_homestay = ?, gia_homestay = ?, mota = ?, danh_gia = ?, TrangThai = ?, id_Loai = ?
    WHERE id_homestay = ?
    `;

    db.query(
        updateHomestayQuery,
        [ten_homestay, gia_homestay, mota, danh_gia || "Chưa đánh giá", TrangThai, id_Loai, id],
        (err, result) => {
            if (err) {
                console.error('Error updating homestay:', err);
                return res.status(500).send('Server error while updating homestay');
            }

            // Kiểm tra xem homestay có tồn tại hay không
            if (result.affectedRows === 0) {
                return res.status(404).send('Homestay not found');
            }

            // Cập nhật hình ảnh trong bảng hinh_homestay
            const updateImageQuery = `
            UPDATE hinh_homestay 
            SET url_hinh = ?
            WHERE id_homestay = ?
            `;

            db.query(updateImageQuery, [url_hinh, id], (err) => {
                if (err) {
                    console.error('Error updating image:', err);
                    return res.status(500).send('Server error while updating image');
                }

                res.json({
                    message: 'Homestay đã được cập nhật thành công'
                });
            });
        }
    );
});



//định nghĩa route xóa sản phẩm
app.delete('/admin/homestay/:id', function (req, res){
    let id = req.params.id;
    let sql = `DELETE FROM homestay WHERE id_homestay =?`
    db.query(sql, id, (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi xóa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã xóa sản phẩm thành công"});
    })
})

//Định nghĩa route thêm loại
app.post('/admin/loai', function (req, res){
    let data = req.body;
    let sql = `INSERT INTO loai_homestay SET?`
    db.query(sql, data, (err, data) => {
        if(err) 
            res.json({"thongbao": "Lỗi thêm sản phẩm", err});
        else 
            res.json({"thongbao":"Đã thêm sản phẩm thành công", "id_sp": data.insertId});
    })
})

//định nghĩa route sửa loại homestay
app.put('/admin/loai/:id', function (req, res){
    let id = req.params.id;
    let data = req.body;
    let sql = `UPDATE loai_homestay SET? WHERE id_Loai =?`
    db.query(sql, [data, id], (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi sửa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã sửa sản phẩm thành công"});
    })
})


//định nghĩa route xóa loại homestay
app.delete('/admin/loai/:id', function (req, res){
    let id = req.params.id;
    let sql = `DELETE FROM loai_homestay WHERE id_Loai =?`
    db.query(sql, id, (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi xóa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã xóa sản phẩm thành công"});
    })
})  

//định nghĩa route ds User

app.get('/admin/user', function (req, res){
    let sql = `SELECT * FROM users`
    db.query (sql, (err, data) =>{
        if(err) res.json({"thongbao":"Lỗii lấy list user", err});
        else res.json(data);
    })
})
app.get('/admin/user/:id', function (req, res){
    let id = parseInt(req.params.id);
    if (id <= 0){
        res.json({"thongbao":"Không tìm thấy sản phẩm", "id": id}); return;
    }
    let sql = `SELECT * FROM users WHERE id_user = ?`
    db.query(sql, id, (err, data) =>{
        if(err) res.json({"thongbao":"Lỗi lấy 1 sp", err});
        else res.json(data[0]);
    })
})

//định nghĩa route sửa loại homestay
app.put('/admin/user/:id', function (req, res){
    let id = req.params.id;
    let data = req.body;
    let sql = `UPDATE users SET? WHERE id_user =?`
    db.query(sql, [data, id], (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi sửa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã sửa sản phẩm thành công"});
    })
})


//định nghĩa route xóa loại homestay
app.delete('/admin/user/:id', function (req, res){
    let id = req.params.id;
    let sql = `DELETE FROM users WHERE id_user =?`
    db.query(sql, id, (err, d) => {
        if(err) 
            res.json({"thongbao": "Lỗi xóa sản phẩm", err});
        else 
            res.json({"thongbao":"Đã xóa sản phẩm thành công"});
    })
})  

// const  PRIVATE_KEY =  fs.readFileSync("private-key.txt")
// // đăng ký
// app.post('/dangky', function (req, res){
//     let data = req.body;
//     let sql = `INSERT INTO users  SET?`
//     db.query(sql, data, (err, data) => {
//         if(err) 
//             res.json({"thongbao": "Lỗi đăng ký", err});
//         else 
//             res.json({"thongbao":"Đã đăng ký thành công", "id": data.insertId});
//     })
// })
// //authen login
// app.post('/login', function(req, res) {
//     const em = req.body.em
//     const pw = req.body.pw
//     checkUserPass(em, pw, (err, user) =>{
//     if (err) {
//         return res.status(500).json({ error: "Đã xảy ra lỗi khi kiểm tra thông tin người dùng." ,err});
//     }

//     if (user) {
//         // Người dùng hợp lệ, tiếp tục xử lý và tạo JWT token
//         const userInfo = { id: user.id, email: user.email, name:user.name }; // Thay đổi theo cấu trúc thông tin người dùng
//         const jwtBearToken = jwt.sign({}, PRIVATE_KEY, { algorithm: "RS256", expiresIn: 120, subject: userInfo.id.toString() });
//         return res.json({ token: jwtBearToken, expiresIn: 120, userInfo: userInfo });
//     } else {
//         return res.status(401).json({ "thông báo": "Thông tin đăng nhập không hợp lệ." });
//     }
// })
// })
// const checkUserPass = (em, pw, callback) => {
//     let sql = `SELECT * FROM users WHERE email = "${em}"  AND password = "${pw}"`
//     db.query(sql, (err, data) => {
//         if(err){ 
//             callback(err, null);
//         }else{
//             if(data.length > 0){
//                 callback(null, data[0])
//             }else{
//                 callback(null, null)
//             }
//         }
    
//     })
// }

app.listen(3000, () => console.log("ung dung chay voi port 3000"))
