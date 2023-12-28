import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@appHook/hooks";
import AdsDynamicTable from "@components/AdsDynamicTable";
import AdsFormModal from "@components/AdsFormModal";
import AdsInput from "@components/AdsInput";
import AdsMap from "@components/AdsMap";
import AlertType from "@enums/alert-type";
import { AdsDistrict } from "@interfaces/ads-district";
import TableColumn from "@interfaces/table-column";
import AlertService from "@services/alert.service";
import { SpaceFormatService, SpaceTypeService } from "@services/types.service";
import { sharedActions } from "@slices/shared.slice";
import { Space, Tooltip, Button, Form } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AdTypes = () => {
  const [isSurfaceTypeOpen, setSurfaceTypeOpen] = useState<boolean>(false);
  const [isSpaceTypeOpen, setSpaceTypeOpen] = useState<boolean>(false);
  const [isSpaceFormatOpen, setSpaceFormatOpen] = useState<boolean>(false);
  const [isReportFormatOpen, setReportFormatOpen] = useState<boolean>(false);

  const [districts, setDistricts] = useState<AdsDistrict[]>([]);
  const dispatch = useAppDispatch();
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '' } });

  const deleteSpaceFormat = async (district: AdsDistrict) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá muốn xoá ${district.name} không?`;
      const { isConfirmed } = await AlertService.showMessage(AlertType.Question, msg);
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SpaceFormatService.remove(district._id);
        setDistricts(districts.filter((item) => item._id !== district._id));
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const tableColumns = useMemo(
    (): TableColumn[] => [
      {
        title: '#',
        dataIndex: '_id',
        key: '_id',
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: 'Tên Quận',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: 'Số lượng phường',
        dataIndex: 'numberOfWards',
        key: 'numberOfWards',
      },
      {
        title: null,
        dataIndex: null,
        key: 'actions',
        render: (_, district: AdsDistrict) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button size='large' icon={<EditOutlined />} shape='circle'></Button>
            </Tooltip>
            <Tooltip title='Xoá'>
              <Button
                type='primary'
                danger
                size='large'
                icon={<DeleteOutlined />}
                shape='circle'
                onClick={() => deleteSpaceFormat(district)}></Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [districts.length],
  );
  const createDistrict = async (formValue: { name: string }): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());
      const newDistrict = await SpaceFormatService.create(formValue);
      clearFormAndCloseModal();
      setDistricts([newDistrict, ...districts]);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  //set open modal
  const openNewSpaceTypeModal = useCallback(() => {
    setSpaceTypeOpen(true);
    setSpaceFormatOpen(false);
    setReportFormatOpen(false);
    setSurfaceTypeOpen(false);

  }, []);

  
  const openNewSpaceFormatModal = useCallback(() => {
    setSpaceTypeOpen(false);
    setSpaceFormatOpen(true);
    setReportFormatOpen(false);
    setSurfaceTypeOpen(false);

  }, []);

  const openNewReportFormatModal = useCallback(() => {
    setSpaceTypeOpen(false);
    setSpaceFormatOpen(false);
    setReportFormatOpen(true);
    setSurfaceTypeOpen(false);

  }, []);

  const openNewSurfaceTypeModal = useCallback(() => {
    setSpaceTypeOpen(false);
    setSpaceFormatOpen(false);
    setReportFormatOpen(false);
    setSurfaceTypeOpen(true);

  }, []);


  // clear modal
  const clearFormAndCloseModal = useCallback(() => {
    reset({ name: '' });
    setSpaceTypeOpen(false);
    setSpaceFormatOpen(false);
    setReportFormatOpen(false);
    setSurfaceTypeOpen(false);

  }, []);

  useEffect(() => {
    const getSpaceType = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const districts = await SpaceTypeService.getAll();
        setDistricts(districts);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
    const getSpaceFormat = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const districts = await SpaceFormatService.getAll();
        setDistricts(districts);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
    getSpaceFormat();
    getSpaceType();

  }, []);

  return (
    <>
      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewSpaceTypeModal}>
        Thêm SpaceType
      </Button>
      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewSpaceFormatModal}>
        Thêm SpaceFormat
      </Button>

      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewReportFormatModal}>
        Thêm Report Format
      </Button>

      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewSurfaceTypeModal}>
        Thêm Surface Type
      </Button>

      <hr />
      <AdsDynamicTable dataSrc={districts} cols={tableColumns} />


      <AdsFormModal
        width='50vw'
        isOpen={isSpaceTypeOpen}
        title='SurfaceType'
        cancelBtnText='Đóng'
        confirmBtnText='Thêm'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createDistrict)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}
          />
        </Form>
      </AdsFormModal>

      <AdsFormModal
        width='50vw'
        isOpen={isSpaceFormatOpen}
        title='SpaceFormat'
        cancelBtnText='Đóng'
        confirmBtnText='Thêm'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createDistrict)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}
          />
        </Form>
      </AdsFormModal>


      <AdsFormModal
        width='50vw'
        isOpen={isReportFormatOpen}
        title='ReportFormat'
        cancelBtnText='Đóng'
        confirmBtnText='Thêm'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createDistrict)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}
          />
        </Form>
      </AdsFormModal>


      <AdsFormModal
        width='50vw'
        isOpen={isSurfaceTypeOpen}
        title='SurfaceType'
        cancelBtnText='Đóng'
        confirmBtnText='Thêm'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createDistrict)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}
          />
        </Form>
      </AdsFormModal>
      
    </>
  );
};

export default AdTypes;
