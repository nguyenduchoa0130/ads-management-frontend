import {
  DeleteOutlined,
  EditOutlined,
  FundViewOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "@appHook/hooks";
import AdsDatePicker from "@components/AdsDatePicker";
import FormControlDropdown from "@components/AdsDropdown";
import AdsDynamicTable from "@components/AdsDynamicTable";
import AdsFormModal from "@components/AdsFormModal";
import AdsInput from "@components/AdsInput";
import AdsMap from "@components/AdsMap";
import AlertType from "@enums/alert-type";
import { AdsLocation } from "@interfaces/ads-location";
import { AdsSpace } from "@interfaces/ads-space";
import { SpaceEditRequest } from "@interfaces/ads-space-edit-requests";
import { AdsSurface } from "@interfaces/ads-surface";
import { SurfaceEditRequest } from "@interfaces/ads-surface-edit-request";
import { AdsType } from "@interfaces/ads-type";
import DropDownOption from "@interfaces/dropdown-option";

import TableColumn from "@interfaces/table-column";
import { SpaceEditRequestService } from "@services/ads-space-edit-requests.service";
import { SurfaceEditRequestService } from "@services/ads-surface-edit-request.service";
import AlertService from "@services/alert.service";
import { SpaceService } from "@services/spaces.service";
import { SurfaceService } from "@services/surfaces.service";
import { SurfaceTypeService } from "@services/types.service";
import { WardService } from "@services/wards.service";
import { sharedActions } from "@slices/shared.slice";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Space,
  Tabs,
  TabsProps,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AdApprovalCRList = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [spaceRequests, setSpaceRequests] = useState<SpaceEditRequest[]>([]);
  const [surfaceEditRequests, setSurfaceEditRequests] = useState<
    SurfaceEditRequest[]
  >([]);
  const dispatch = useAppDispatch();
  const [wards, setSpaces] = useState<AdsSpace[]>([]);
  const [lngLat, setLngLat] = useState<AdsLocation>();
  const [previewImage, setPreviewImage] = useState("");
  const [types, setTypes] = useState<AdsType[]>([]);
  const [formats, setFormats] = useState<AdsType[]>([]);
  const [spaceOptions, setSpaceOptions] = useState<DropDownOption<string>[]>(
    []
  );
  const [typeOptions, setTypeOptions] = useState<DropDownOption<string>[]>([]);
  const [formatOptions, setFormatOptions] = useState<DropDownOption<string>[]>(
    []
  );
  const [wardOptions, setWardOptions] = useState<DropDownOption<string>[]>([]);
  const {
    reset,
    control,
    setValue,
    handleSubmit,

    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      long: null,
      lat: null,
      width: null,
      height: null,
      img_url: null,
      type: "",
      space: "",
      address: "",
      format: "",
      ward: "",
      _id: "",
      reason: "",
      request_date: null,
    },
  });

  const getLongLat = (lngLat: AdsLocation) => {
    setValue("long", lngLat.lng);
    setValue("lat", lngLat.lat);
    setLngLat(lngLat);
  };
  const viewSurface = function (data) {};
  const openNewSurfaceModal = useCallback(() => {
    setIsOpen(true);
  }, []);
  const createSpace = async (formValue: {
    name: string;
    _id: string;
  }): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());
      let newSpace;
      if (formValue._id) {
        newSpace = await SpaceService.update(formValue);
      } else {
        newSpace = await SpaceService.create(formValue);
      }
      clearFormAndCloseModal();
      console.log(newSpace);
      if (newSpace) setReloadTrigger((prev) => !prev);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const createSurface = async (formValue: AdsSurface): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());

      let newSpace;
      formValue.height = Number.parseFloat(formValue.height + "");
      formValue.width = Number.parseFloat(formValue.width + "");
      console.log(formValue);
      if (formValue._id) {
        newSpace = await SurfaceService.update(formValue);
      } else {
        newSpace = await SurfaceService.create(formValue);
      }
      clearFormAndCloseModal();

      if (newSpace) setReloadTrigger((prev) => !prev);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const deleteSurface = async (district: SurfaceEditRequest) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá vị trí ${district.long}, ${district.lat} không?`;
      const { isConfirmed } = await AlertService.showMessage(
        AlertType.Question,
        msg
      );
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SurfaceService.remove(district._id);
        setReloadTrigger((prev) => !prev);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const deleteSpace = async (district: SpaceEditRequest) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá vị trí ${district.long}, ${district.lat} không?`;
      const { isConfirmed } = await AlertService.showMessage(
        AlertType.Question,
        msg
      );
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SurfaceService.remove(district._id);
        setReloadTrigger((prev) => !prev);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const editSurface = async (district: SurfaceEditRequest) => {
    try {
      setValue("_id", district._id);

      setValue("long", district.long);
      setValue("lat", district.lat);

      setValue("width", district.width);
      setValue("height", district.height);
      setValue("type", district.type._id);
      setValue("space", district.space._id);

      setPreviewImage(district.img_url);
      openNewSurfaceModal();
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const editSpace = async (district: SpaceEditRequest) => {
    try {
      setValue("_id", district._id);
      setValue("address", district.address);
      setValue("long", district.long);
      setValue("lat", district.lat);
      setValue("type", district?.type?._id);
      setValue("format", district?.format?._id);
      setValue("ward", district?.ward?._id);

      openNewSpaceModal();
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const openNewSpaceModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const clearFormAndCloseModal = useCallback(() => {
    reset({
      address: "",
      long: null,
      lat: null,
      ward: "",
      type: "",
      format: "",
      _id: "",
    });
    setIsOpen(false);
  }, []);

  useEffect(() => {
    const getSpaceRequests = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const spaces = await SpaceEditRequestService.getAll();

        let options: DropDownOption<string>[] = spaces.map((el) => {
          return {
            label: el.address,
            value: el._id,
          };
        });
        setSpaceOptions(options);
        setSpaceRequests(spaces);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };

    const getSurfaceRequests = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const spaces = await SurfaceEditRequestService.getAll();

        let options: DropDownOption<string>[] = spaces.map((el) => {
          return {
            label: el.long + "," + el.lat,
            value: el._id,
          };
        });
        setSpaceOptions(options);
        setSurfaceEditRequests(spaces);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
    const getTypes = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const wards = await SurfaceTypeService.getAll();

        let options: DropDownOption<string>[] = wards.map((el) => {
          return {
            label: el.name,
            value: el._id,
          };
        });
        setTypeOptions(options);
        setTypes(wards);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
    const getWards = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const wards = await WardService.getAll();

        let options: DropDownOption<string>[] = wards.map((el) => {
          return {
            label: el.name,
            value: el._id,
          };
        });
        setWardOptions(options);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };

    getWards();
    getTypes();
    getSpaceRequests();
    getSurfaceRequests();
  }, [reloadTrigger]);

  //
  const props: UploadProps = {
    name: "file",
    onChange(info) {
      console.log(info);
    },
  };
  const tableColumnsSpace = useMemo(
    (): TableColumn[] => [
      {
        title: "#",
        dataIndex: "_id",
        key: "_id",
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: "Image",
        dataIndex: "request_date",
        key: "request_date",
        render: (_, district: SurfaceEditRequest) => district.request_date,
      },
      {
        title: "Vị trí",
        dataIndex: "long",
        key: "long",
        render: (_, district: SurfaceEditRequest) =>
          "[" + district.long + ", " + district.lat + "]",
      },

      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        render: (_, district: SurfaceEditRequest) => district?.type?.name,
      },
      {
        title: "Kích thước",
        dataIndex: "height",
        key: "height",
        render: (_, district: SurfaceEditRequest) =>
          district.height + " x " + district.width,
      },

      {
        title: null,
        dataIndex: null,
        key: "actions",
        render: (_, space: SurfaceEditRequest) => (
          <Space>
            <Tooltip title="Cập nhật">
              <Button
                onClick={() => editSurface(space)}
                size="large"
                icon={<EditOutlined />}
                shape="circle"
              ></Button>
            </Tooltip>
            <Tooltip title="Xoá">
              <Button
                type="primary"
                danger
                size="large"
                icon={<DeleteOutlined />}
                shape="circle"
                onClick={() => deleteSurface(space)}
              ></Button>
            </Tooltip>
            <Tooltip title="Xem chi tiết">
              <Button
                type="primary"
                size="large"
                icon={<FundViewOutlined />}
                shape="circle"
                onClick={() => viewSurface(space)}
              ></Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [spaceRequests.length]
  );

  const tableColumnsSurface = useMemo(
    (): TableColumn[] => [
      {
        title: "#",
        dataIndex: "_id",
        key: "_id",
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: "Vị trí",
        dataIndex: "long",
        key: "long",
        render: (_, district: AdsSpace) =>
          district.long + " -- " + district.lat,
      },
      {
        title: "Hình thức",
        dataIndex: "format",
        key: "format",
        render: (_, district: AdsSpace) => district?.format?.name,
      },
      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        render: (_, district: AdsSpace) => district?.type?.name,
      },
      {
        title: "Địa chỉ",
        dataIndex: "address",
        key: "address",
      },
      {
        title: "Phường",
        dataIndex: "type",
        key: "type",
        render: (_, district: AdsSpace) => district?.ward?.name,
      },
      {
        title: null,
        dataIndex: null,
        key: "actions",
        render: (_, space: SpaceEditRequest) => (
          <Space>
            <Tooltip title="Cập nhật">
              <Button
                onClick={() => editSpace(space)}
                size="large"
                icon={<EditOutlined />}
                shape="circle"
              ></Button>
            </Tooltip>
            <Tooltip title="Xoá">
              <Button
                type="primary"
                danger
                size="large"
                icon={<DeleteOutlined />}
                shape="circle"
                onClick={() => deleteSpace(space)}
              ></Button>
            </Tooltip>
            <Tooltip title="Xem chi tiết">
              <Button
                type="primary"
                size="large"
                icon={<FundViewOutlined />}
                shape="circle"
                onClick={() => viewSurface(space)}
              ></Button>
            </Tooltip>
          </Space>
        ),
      },
    ],
    [surfaceEditRequests.length]
  );
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: "Yêu cầu chỉnh sửa vị trí",
      children: (
        <AdsDynamicTable dataSrc={spaceRequests} cols={tableColumnsSpace} />
      ),
    },
    {
      key: "2",
      label: "Yêu cầu chỉnh sửa biển quảng cáo",
      children: (
        <AdsDynamicTable
          dataSrc={surfaceEditRequests}
          cols={tableColumnsSurface}
        />
      ),
    },
  ];
  const onChangeTabs = (key: string) => {
    console.log(key);
  };
  return (
    <>
      <Button
        size="large"
        icon={<PlusOutlined />}
        className="mb-3 mr-3"
        onClick={openNewSurfaceModal}
      >
        YÊU CẦU CHỈNH SỬA BẢNG QUẢNG CÁO
      </Button>

      <Button
        size="large"
        icon={<PlusOutlined />}
        className="mb-3"
        onClick={openNewSpaceModal}
      >
        YÊU CẦU CHỈNH SỬA VỊ TRÍ ĐẶT BẢNG
      </Button>

      <Tabs defaultActiveKey="1" items={items} onChange={onChangeTabs} />

      <AdsFormModal
        width="80vw"
        isOpen={isOpen}
        title="YÊU CẦU CHỈNH SỬA BẢNG QUẢNG CÁO"
        cancelBtnText="Đóng"
        confirmBtnText="Thêm"
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSurface)}
      >
        <Form layout="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            <Col span={4} className="gutter-row">
              <AdsInput
                control={control}
                error={errors._id}
                name="_id"
                isDisabled={true}
                label="ID"
              />
            </Col>

            <Col span={4} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.long}
                name="long"
                label="Vĩ độ"
                placeholder="Vĩ độ"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={4} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.long}
                name="long"
                label="Vĩ độ"
                placeholder="Vĩ độ"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={4} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.height}
                name="height"
                label="Chiều dài (m)"
                placeholder="Chiều dài"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={4} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.width}
                name="width"
                label="Chiều rộng (m)"
                placeholder="Chiều rộng"
                rules={{ required: "Không được để trống" }}
              />
            </Col>

            <Col span={4} className="gutter-row">
              <FormControlDropdown
                options={typeOptions}
                control={control}
                error={errors.type}
                name="type"
                label="Loại"
                placeholder="Nhập loại bảng quảng cáo"
                rules={{ required: "Không được để trống" }}
              ></FormControlDropdown>
            </Col>

            <Col span={12} className="gutter-row">
              <FormControlDropdown
                options={spaceOptions}
                control={control}
                error={errors.space}
                name="space"
                label="Điểm đặt bảng quảng cáo"
                placeholder="Nhập điểm đặt bảng quảng cáo"
                rules={{ required: "Không được để trống" }}
              ></FormControlDropdown>
            </Col>
            <Col span={12} className="gutter-row">
              <Form.Item
                label="Image"
                name="img_url"
                // valuePropName="fileList"
                //getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false} // Prevent default upload behavior
                  onChange={(info) => {
                    setValue("img_url", info.file);
                  }}
                >
                  <Button icon={<UploadOutlined />}>Click to upload</Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <div className="pt-1 pb-2 h-[600px]">
            <AdsMap onClickOnMap={getLongLat} lngLat={lngLat} />
          </div>
        </Form>
      </AdsFormModal>

      <AdsFormModal
        width="80vw"
        isOpen={isOpen}
        title="THÊM ĐỊA ĐIỂM QUẢNG CÁO"
        cancelBtnText="Đóng"
        confirmBtnText="Thêm"
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSpace)}
      >
        <Form layout="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            <Col span={6} className="gutter-row">
              <AdsInput
                control={control}
                error={errors._id}
                name="_id"
                isDisabled={true}
                label="ID"
              />
            </Col>
            <Col span={12} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.address}
                name="address"
                label="Địa chỉ"
                placeholder="Nhập tên địa chỉ"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={6} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.long}
                name="long"
                label="Vĩ độ"
                placeholder="Vĩ độ"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={6} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.lat}
                name="lat"
                label="Kinh độ"
                placeholder="Kinh độ"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={6} className="gutter-row">
              <FormControlDropdown
                options={wardOptions}
                control={control}
                error={errors.ward}
                name="ward"
                label="Tên phường"
                placeholder="Nhập tên phường"
                rules={{ required: "Không được để trống" }}
              ></FormControlDropdown>
            </Col>

            <Col span={6} className="gutter-row">
              <FormControlDropdown
                options={typeOptions}
                control={control}
                error={errors.type}
                name="type"
                label="Loại"
                placeholder="Nhập loại vị trí"
                rules={{ required: "Không được để trống" }}
              ></FormControlDropdown>
            </Col>

            <Col span={6} className="gutter-row">
              <FormControlDropdown
                options={formatOptions}
                control={control}
                error={errors.format}
                name="format"
                label="Hình thức quảng cáo"
                placeholder="Nhập hình thức quảng cáo"
                rules={{ required: "Không được để trống" }}
              />
            </Col>

            <Col span={6} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.lat}
                name="lat"
                label="Lý do"
                placeholder="Nhập Lý do"
                rules={{ required: "Không được để trống" }}
              />
            </Col>

            <Col span={6} className="gutter-row">
              <AdsDatePicker
                control={control}
                error={errors.request_date}
                name="requests_date"
                label="Lý do"
                placeholder="Nhập Lý do"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
          </Row>
          <div className="pt-1 pb-2 h-[600px]">
            <AdsMap onClickOnMap={getLongLat} />
          </div>
        </Form>
      </AdsFormModal>
    </>
  );
};

export default AdApprovalCRList;
