import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useAppDispatch } from "@appHook/hooks";
import AdsDynamicTable from "@components/AdsDynamicTable";
import AdsFormModal from "@components/AdsFormModal";
import AdsInput from "@components/AdsInput";
import AlertType from "@enums/alert-type";
import { AdsDistrict } from "@interfaces/ads-district";
import { AdsType } from "@interfaces/ads-type";
import TableColumn from "@interfaces/table-column";
import AlertService from "@services/alert.service";
import { ReportFormatService, SpaceFormatService, SpaceTypeService, SurfaceTypeService } from "@services/types.service";
import { sharedActions } from "@slices/shared.slice";
import { Space, Tooltip, Button, Form, TabsProps, Tabs } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AdTypes = () => {
  const [isSurfaceTypeOpen, setSurfaceTypeOpen] = useState<boolean>(false);
  const [isSpaceTypeOpen, setSpaceTypeOpen] = useState<boolean>(false);
  const [isSpaceFormatOpen, setSpaceFormatOpen] = useState<boolean>(false);
  const [isReportFormatOpen, setReportFormatOpen] = useState<boolean>(false);

  const [spaceTypes, setSpaceTypes] = useState<AdsType[]>([]);
  const [spaceFormats, setSpaceFormats] = useState<AdsType[]>([]);
  const [reportFormats, setReportFormats] = useState<AdsType[]>([]);
  const [surfaceTypes, setSurfaceTypes] = useState<AdsType[]>([]);

  const [reloadTrigger, setReloadTrigger] = useState(false);

  const dispatch = useAppDispatch();
  const {
    setValue,
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues: { name: '', _id: '' } });

  //set event edit 

  const editSpaceType = async (district: AdsType) => {
    try {
 
      setValue('_id', district._id);
      setValue('name', district.name);
      openNewSpaceTypeModal();

    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const editSpaceFormat = async (district: AdsType) => {
    try {
 
      setValue('_id', district._id);
      setValue('name', district.name);
      openNewSpaceFormatModal();

    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const editSurfaceType = async (district: AdsType) => {
    try {
 
      setValue('_id', district._id);
      setValue('name', district.name);
      openNewSurfaceTypeModal();

    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const editReportFormat = async (district: AdsType) => {
    try {
 
      setValue('_id', district._id);
      setValue('name', district.name);
      openNewReportFormatModal();

    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  //set event delete
  const deleteSpaceFormat = async (district: AdsType) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá muốn xoá ${district.name} không?`;
      const { isConfirmed } = await AlertService.showMessage(AlertType.Question, msg);
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SpaceFormatService.remove(district._id);
        setReloadTrigger((prev) => !prev);

      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const deleteSpaceType = async (district: AdsType) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá muốn xoá ${district.name} không?`;
      const { isConfirmed } = await AlertService.showMessage(AlertType.Question, msg);
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SpaceTypeService.remove(district._id);
        setReloadTrigger((prev) => !prev);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const deleteReportFormat = async (district: AdsType) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá muốn xoá ${district.name} không?`;
      const { isConfirmed } = await AlertService.showMessage(AlertType.Question, msg);
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await ReportFormatService.remove(district._id);
        setReloadTrigger((prev) => !prev);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const deleteSurfaceType = async (district: AdsType) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá muốn xoá ${district.name} không?`;
      const { isConfirmed } = await AlertService.showMessage(AlertType.Question, msg);
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SurfaceTypeService.remove(district._id);
        setReloadTrigger((prev) => !prev);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };


  //render column
  const tableColumnsSpaceType = useMemo(
    (): TableColumn[] => [
      {
        title: '#',
        dataIndex: '_id',
        key: '_id',
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: 'Tên loại',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: null,
        dataIndex: null,
        key: 'actions',
        render: (_, district: AdsDistrict) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button size='large' icon={<EditOutlined />}  shape='circle' onClick={() => editSpaceType(district)}></Button>
            </Tooltip>
            <Tooltip title='Xoá'>
              <Button
                type='primary'
                danger
                size='large'
                icon={<DeleteOutlined />}
                shape='circle'
                onClick={() => deleteSpaceType(district)}></Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [spaceTypes.length],
  );
  const tableColumnsSpaceFormat = useMemo(
    (): TableColumn[] => [
      {
        title: '#',
        dataIndex: '_id',
        key: '_id',
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: 'Tên loại',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: null,
        dataIndex: null,
        key: 'actions',
        render: (_, district: AdsDistrict) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button size='large' icon={<EditOutlined />} shape='circle' onClick={() => editSpaceFormat(district)}></Button>
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
    [spaceTypes.length],
  );
  const tableColumnsReportFormat = useMemo(
    (): TableColumn[] => [
      {
        title: '#',
        dataIndex: '_id',
        key: '_id',
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: 'Tên loại',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: null,
        dataIndex: null,
        key: 'actions',
        render: (_, district: AdsDistrict) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button size='large' icon={<EditOutlined />} onClick={() => editReportFormat(district)} shape='circle'></Button>
            </Tooltip>
            <Tooltip title='Xoá'>
              <Button
                type='primary'
                danger
                size='large'
                icon={<DeleteOutlined />}
                shape='circle'
                onClick={() => deleteReportFormat(district)} ></Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [spaceTypes.length],
  );
  const tableColumnsSurfaceType = useMemo(
    (): TableColumn[] => [
      {
        title: '#',
        dataIndex: '_id',
        key: '_id',
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: 'Tên loại',
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: null,
        dataIndex: null,
        key: 'actions',
        render: (_, district: AdsDistrict) => (
          <Space>
            <Tooltip title='Cập nhật'>
              <Button size='large' icon={<EditOutlined />} onClick={() => editSurfaceType(district)} shape='circle'></Button>
            </Tooltip>
            <Tooltip title='Xoá'>
              <Button
                type='primary'
                danger
                size='large'
                icon={<DeleteOutlined />}
                shape='circle'
                onClick={() => deleteSurfaceType(district)}></Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [spaceTypes.length],
  );


  // set button create
  const createSpaceType = async (formValue: { name: string, _id: string }): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());

      if(formValue._id) {
        const newDistrict = await SpaceTypeService.update(formValue);

      }else {
        const newDistrict = await SpaceTypeService.create(formValue);

      }
     
      clearFormAndCloseModal();
      setReloadTrigger((prev) => !prev);


    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const createSpaceFormat = async (formValue: { name: string, _id: string }): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());
      if(formValue._id) {
        const newDistrict = await SpaceFormatService.update(formValue);

      }else {
        const newDistrict = await SpaceFormatService.create(formValue);

      }
     
      clearFormAndCloseModal();
      setReloadTrigger((prev) => !prev);

    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const createReportFormat = async (formValue: { name: string , _id: string}): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());
      if(formValue._id) {
        const newDistrict = await ReportFormatService.update(formValue);

      }else {
        const newDistrict = await ReportFormatService.create(formValue);

      }
     
      clearFormAndCloseModal();
      setReloadTrigger((prev) => !prev);



    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const createSurfaceType = async (formValue: { name: string, _id: string }): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());
      let res;
      if(formValue._id) {
        res = await SurfaceTypeService.update(formValue);

      }else {
        res = await SurfaceTypeService.create({name: formValue.name});
        
      }
      const msg =  res?.message;
      AlertService.showMessage(AlertType.Success, msg);
      clearFormAndCloseModal();
      setReloadTrigger((prev) => !prev);

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
    reset({ name: '', _id: '' });
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
        setSpaceTypes(districts);
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
        setSpaceFormats(districts);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
    const getReportFormat = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const districts = await ReportFormatService.getAll();
        setReportFormats(districts);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
    const getSurfaceType = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const districts = await SurfaceTypeService.getAll();
        setSurfaceTypes(districts);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };


    getSpaceFormat();
    getSpaceType();
    getSurfaceType();
    getReportFormat();

  }, [reloadTrigger]);

  const onChange = (key: string) => {
    console.log(key);
  };
  const items: TabsProps['items'] = [
    {
      key: '1',
      label: 'Loại vị trí',
      children: <AdsDynamicTable dataSrc={spaceTypes} cols={tableColumnsSpaceType} />,
    },
    {
      key: '2',
      label: 'Hình thức quảng cáo',
      children: <AdsDynamicTable dataSrc={spaceFormats} cols={tableColumnsSpaceFormat} />,
    },
    {
      key: '3',
      label: 'Loại biển quảng cáo',
      children: <AdsDynamicTable dataSrc={surfaceTypes} cols={tableColumnsSurfaceType} />,
    },
    {
      key: '4',
      label: 'Hình thức báo cáo',
      children: <AdsDynamicTable dataSrc={reportFormats} cols={tableColumnsReportFormat} />,
    },
  ];
  return (
    <>

      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewSpaceTypeModal}>
        Thêm Loại vị trí
      </Button>
      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewSpaceFormatModal}>
        Thêm Hình thức quảng cáo
      </Button>
      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewSurfaceTypeModal}>
        Thêm Loại biển quảng cáo
      </Button>
      <Button size='large' icon={<PlusOutlined />} className='mb-3 mr-1' onClick={openNewReportFormatModal}>
        Thêm Hình thức báo cáo
      </Button>

     

      <hr />

      <Tabs defaultActiveKey="1" items={items} onChange={onChange} />







      <AdsFormModal
        width='50vw'
        isOpen={isSpaceTypeOpen}
        title='Loại vị trí'
        cancelBtnText='Đóng'
        confirmBtnText='Lưu'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSpaceType)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}

          />
          <AdsInput
            control={control}
            error={errors._id}
            name='_id'
            label='Id'
            placeholder=''
            isDisabled
            
          />
        </Form>
      </AdsFormModal>

      <AdsFormModal
        width='50vw'
        isOpen={isSpaceFormatOpen}
        title='Hình thức quảng cáo'
        cancelBtnText='Đóng'
        confirmBtnText='Lưu'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSpaceFormat)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}
          />
                    <AdsInput
            control={control}
            error={errors._id}
            name='_id'
            label='Id'
            placeholder=''
            isDisabled
            
          />
        </Form>
      </AdsFormModal>


      <AdsFormModal
        width='50vw'
        isOpen={isReportFormatOpen}
        title='Hình thức báo cáo'
        cancelBtnText='Đóng'
        confirmBtnText='Lưu'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createReportFormat)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}
          />
                    <AdsInput
            control={control}
            error={errors._id}
            name='_id'
            label='Id'
            placeholder=''
            isDisabled
            
          />
        </Form>
      </AdsFormModal>


      <AdsFormModal
        width='50vw'
        isOpen={isSurfaceTypeOpen}
        title='Loại biển quảng cáo'
        cancelBtnText='Đóng'
        confirmBtnText='Lưu'
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSurfaceType)}>
        <Form layout='vertical'>
          <AdsInput
            control={control}
            error={errors.name}
            name='name'
            label='Tên loại'
            placeholder='Nhập tên loại biển quảng cáo'
            rules={{ required: 'Không được để trống' }}
          />
                    <AdsInput
            control={control}
            error={errors._id}
            name='_id'
            label='Id'
            placeholder=''
            isDisabled
            
          />
        </Form>
      </AdsFormModal>



    </>
  );
};

export default AdTypes;
