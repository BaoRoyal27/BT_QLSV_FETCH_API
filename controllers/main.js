import { sinhVien } from "../models/sinhVien.js";
import { stringToSlug } from "../assets/util/methol.js";
//lấy danh sách sinh viên
async function getAllSinhVienAsync() {
  try {
    const response = await fetch(
      "https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien"
    );
    const data = await response.json();
    console.log(data);
    renderTableSinhVien(data);
  } catch (err) {
    console.log(err);
  }
}
getAllSinhVienAsync();

window.renderTableSinhVien = function (arrSV) {
  let htmlString = "";
  for (let sv of arrSV) {
    htmlString += `
        <tr>
            <td>${sv.maSinhVien}</td>
            <td>${sv.tenSinhVien}</td>
            <td>${sv.soDienThoai}</td>
            <td>${sv.email}</td>
            <td>${sv.diemToan}</td>
            <td>${sv.diemLy}</td>
            <td>${sv.diemHoa}</td>
            <td>${sv.diemRenLuyen}</td>
            <td>${sv.loaiSinhVien}</td>
            <td>
            <button class="btn btn-primary mx-2" onclick="chinhSua('${sv.maSinhVien}')"> Sửa </button>
            <button class="btn btn-danger" onclick="xoaSinhVien('${sv.maSinhVien}')"> Xoá </button>
            </td>
        </tr>
        `;
  }
  document.querySelector("#tblSinhVien").innerHTML = htmlString;
  return htmlString;
};
//thêm sinh viên
document.querySelector("#frmSinhVien").onsubmit = async function (e) {
  e.preventDefault();
  let sv = new sinhVien();
  let arrInput = document.querySelectorAll("#frmSinhVien .form-control");
  for (let input of arrInput) {
    sv[input.id] = input.value;
  }
  const response = await fetch(
    "https://svcy.myclass.vn/api/SinhVienApi/ThemSinhVien",
    {
      method: "POST",
      headers: {
        "Content-Type": "Application/json",
      },
      body: JSON.stringify(sv),
    }
  );
  const data = (await response).json();
  getAllSinhVienAsync();
};
//xoá sinh viên
window.xoaSinhVien = async function (maSinhVien) {
  const response = await fetch(
    `https://svcy.myclass.vn/api/SinhVienApi/XoaSinhVien?maSinhVien=${maSinhVien}`,
    {
      method: "DELETE",
    }
  );
  const data = (await response).json();
  console.log(data);
};
getAllSinhVienAsync();

// chỉnh sửa thông tin sinh viên
window.chinhSua = async function (maSinhVien) {
  const url = `https://svcy.myclass.vn/api/SinhVienApi/LayThongTinSinhVien?maSinhVien=${maSinhVien}`;

  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  console.log(data);

  const arrInput = document.querySelectorAll("#frmSinhVien .form-control");
  for (let input of arrInput) {
    input.value = data[input.id];
  }
};

document.querySelector("#btnLuuThongTin").onclick = async function (e) {
  e.preventDefault();
  let sv = new sinhVien();
  let arrInput = document.querySelectorAll("#frmSinhVien .form-control");
  for (let input of arrInput) {
    sv[input.id] = input.value;
  }
  let urlUp = `https://svcy.myclass.vn/api/SinhVienApi/CapNhatThongTinSinhVien?maSinhVien=${sv.maSinhVien}`;
  const response = await fetch(urlUp, {
    method: "PUT",
    headers: {
      "Content-Type": "Application/json",
    },
    body: JSON.stringify(sv),
  });
  const data = await response.json();
  getAllSinhVienAsync();
};
setInterval(function () {
  getAllSinhVienAsync();
}, 5000);
