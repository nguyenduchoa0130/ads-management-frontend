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
import DistrictsService from "@services/districts.service";
import SpaceTypeService from "@services/types.service";
import { sharedActions } from "@slices/shared.slice";
import { Space, Tooltip, Button, Form } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AdTypes = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [districts, setDistricts] = useState<AdsDistrict[]>([]);
  const dispatch = useAppDispatch();
  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '' } });

  const deleteDistrict = async (district: AdsDistrict) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá muốn xoá ${district.name} không?`;
      const { isConfirmed } = await AlertService.showMessage(AlertType.Question, msg);
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await DistrictsService.remove(district._id);
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
                onClick={() => deleteDistrict(district)}></Button>
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
      const newDistrict = await DistrictsService.create(formValue);
      clearFormAndCloseModal();
      setDistricts([newDistrict, ...districts]);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const openNewDistrictModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const clearFormAndCloseModal = useCallback(() => {
    reset({ name: '' });
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const getDistricts = async () => {
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

    getDistricts();
  }, []);

  return (
    <>
      <Button size='large' icon={<PlusOutlined />} className='mb-3' onClick={openNewDistrictModal}>
        Thêm quận
      </Button>
      <hr />
      <AdsDynamicTable dataSrc={districts} cols={tableColumns} />
      <AdsFormModal
        width='50vw'
        isOpen={isOpen}
        title='Thêm Quận'
        cancelBtnText='Đóng'
        confirmBtnText='Thêm'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createDistrict)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên quận'
            placeholder='Nhập tên quận'
            rules={{ required: 'Không được để trống' }}
          />
          <div className='w-full h-[500px]'>
            <AdsMap />
          </div>
          <AdsMap />
        </Form>
      </AdsFormModal>
    </>
  );
};

export default AdTypes;
