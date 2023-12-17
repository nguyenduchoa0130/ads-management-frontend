import AlertType from '@enums/alert-type';
import Swal from 'sweetalert2';

const AlertService = {
  showMessage: (type: AlertType, message?: string) => {
    return Swal.fire({
      icon: type,
      text: message,
    });
  },
};

export default AlertService;
