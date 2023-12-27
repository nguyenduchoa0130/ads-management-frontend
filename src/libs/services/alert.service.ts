import AlertType from '@enums/alert-type';
import titleMap from '@utils/title-map.util';
import Swal from 'sweetalert2';

const AlertService = {
  showMessage: (type: AlertType, message?: string) => {
    return Swal.fire({
      title: titleMap.get(type),
      icon: type,
      text: message,
      showCancelButton: type === AlertType.Question,
      cancelButtonText: 'Đóng',
    });
  },
};

export default AlertService;
