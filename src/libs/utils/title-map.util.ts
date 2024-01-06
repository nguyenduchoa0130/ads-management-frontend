import AlertType from '@enums/alert-type';

const titleMap = new Map();

titleMap.set('thong-ke', 'Thống kê');
titleMap.set('ql-khu-vuc', 'Quản lý khu vực');
titleMap.set('ql-danh-sach-loai', 'Quản lý danh sách loại');
titleMap.set('ql-diem-dat-quang-cao', 'Quản lý điểm đạt quảng cáo');
titleMap.set('ql-bang-quang-cao', 'Quản lý bảng quảng cáo');
titleMap.set('ql-tai-khoan', 'Quản lý tài khoản');
titleMap.set('yc-chinh-sua', 'Yêu cầu chỉnh sửa');
titleMap.set('yc-cap-phep', 'Yêu cầu cấp phép');
titleMap.set('phan-cong-khu-vuc', 'Phân công khu vực');
titleMap.set('can-bo-so-vh-tt', 'Trang Chủ');
titleMap.set('ql-bao-cao', 'Quản lý báo cáo');

titleMap.set(AlertType.Success, 'Thành Công');
titleMap.set(AlertType.Error, 'Lỗi');
titleMap.set(AlertType.Info, 'Thông Tin');
titleMap.set(AlertType.Warning, 'Cảnh Báo');
titleMap.set(AlertType.Question, 'Xác Nhận');

export default titleMap;
