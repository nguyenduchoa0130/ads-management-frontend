import {
  CheckOutlined,
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
  Badge,
  Button,
  Col,
  DatePicker,
  Form,
  Row,
  Space,
  Tabs,
  TabsProps,
  Tag,
  Tooltip,
  Upload,
  UploadProps,
  message,
} from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AdPermitApprovalList = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [isOpenSurface, setIsOpenSurface] = useState<boolean>(false);

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
      surface: "",
      request_date: null,
    },
  });

  const getLongLat = (lngLat: AdsLocation) => {
    setValue("long", lngLat.lng);
    setValue("lat", lngLat.lat);
    setLngLat(lngLat);
  };
  const viewSurface = function (data) {};

  const createSpaceEditRequest = async (formValue: any): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());
      let res;

      formValue.state = 2;
      formValue.ward = formValue.ward?._id;
      formValue.type = formValue.type?._id;
      formValue.format = formValue.format?._id;
      formValue.space = formValue.space?._id;

      if (formValue._id) {
        res = await SpaceEditRequestService.update(formValue);
        if (res) {
          formValue._id = formValue.space;
          res = await SpaceService.update(formValue);
        }
      }

      clearFormAndCloseModal();
      const msg = res?.message;
      AlertService.showMessage(AlertType.Success, msg);
      if (res) setReloadTrigger((prev) => !prev);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const createSurfaceEditRequest = async (
    formValue: any
  ): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());

      let res;
      formValue.space = formValue.space?._id;
      formValue.surface = formValue.surface?._id;
      formValue.type = formValue.type?._id;
      formValue.state = 2;
      if (formValue._id) {
        res = await SurfaceEditRequestService.update(formValue);
        if (res) {
          console.log(formValue);
          formValue._id = formValue.surface;
          formValue.img_url = formValue.img_url ? formValue.img_url : null;
          res = await SurfaceService.update(formValue);
        }
      } 
     
      clearFormAndCloseModal();
      const msg = res?.message;
      AlertService.showMessage(AlertType.Success, msg);
      if (res) setReloadTrigger((prev) => !prev);
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
        await SurfaceEditRequestService.remove(district._id);
        setReloadTrigger((prev) => !prev);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const deleteSpace = async (district: any) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá vị trí ${district.long}, ${district.lat} không?`;
      const { isConfirmed } = await AlertService.showMessage(
        AlertType.Question,
        msg
      );
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SpaceEditRequestService.remove(district._id);
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

  const openNewSurfaceModal = useCallback(() => {
    setIsOpenSurface(true);
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
    // setIsOpenSpace(false);
    setIsOpenSurface(false);
  }, []);

  useEffect(() => {
    const getSpaces = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const spaces = await SpaceService.getAll();

        let options: DropDownOption<string>[] = spaces.map((el) => {
          return {
            label: el.address,
            value: el._id,
          };
        });
        setSpaceOptions(options);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };

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

    getSpaces();
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
  const tableColumnsSurface = useMemo(
    (): TableColumn[] => [
      {
        title: "#",
        dataIndex: "_id",
        key: "_id",
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: "Image",
        dataIndex: "long",
        key: "long",
        render: (_, district: AdsSurface) => (
          <img
            width="130"
            height="60"
            src={
              process.env.REACT_APP_BACKEND_BASE_URL + "/" + district.img_url
            }
          />
        ),
      },
      {
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
      
      },
      {
        title: "Vị trí",
        dataIndex: "long",
        key: "long",
        render: (_, district: SurfaceEditRequest) =>
          district.long + " -- " + district.lat,
      },
      {
        title: "Trạng thái",
        dataIndex: "long",
        key: "long",
        render: (_, district: SurfaceEditRequest) =>
          district.state == 1 ? (
            <Tag color="orange">Chờ phê duyệt</Tag>
          ) : (
            <Tag color="green">Đã phê duyệt</Tag>
          ),
      },

      {
        title: "Ngày yêu cầu chỉnh sửa",
        dataIndex: "request_date",
        key: "request_date",
        render: (_, district: SurfaceEditRequest) =>
          moment(district?.request_date).format("DD/MM/YYYY"),
      },
      
      {
        title: "Phê duyệt",
        dataIndex: null,
        key: "actions",
        render: (_, space: SurfaceEditRequest) =>
          space.state == 1 ? (
            <Space>
              <Tooltip title="Phê duyệt">
                <Button
                  onClick={() => createSurfaceEditRequest(space)}
                  size="large"
                  icon={<CheckOutlined />}
                  shape="circle"
                ></Button>
              </Tooltip>
            </Space>
          ) : (
            ""
          ),
      },
    ],
    [spaceRequests.length]
  );

  const tableColumnsSpace = useMemo(
    (): TableColumn[] => [
      {
        title: "#",
        dataIndex: "_id",
        key: "_id",
        render: (value: string) => value.slice(0, 8),
      },
      {
        title: "Lý do",
        dataIndex: "reason",
        key: "reason",
      },
      {
        title: "Vị trí",
        dataIndex: "long",
        key: "long",
        render: (_, district: SpaceEditRequest) =>
          district.long + " -- " + district.lat,
      },
      {
        title: "Trạng thái",
        dataIndex: "long",
        key: "long",
        render: (_, district: SpaceEditRequest) =>
          district.state == 1 ? (
            <Tag color="orange">Chờ phê duyệt</Tag>
          ) : (
            <Tag color="green">Đã phê duyệt</Tag>
          ),
      },
      {
        title: "Ngày yêu cầu chỉnh sửa",
        dataIndex: "request_date",
        key: "request_date",
        render: (_, district: SpaceEditRequest) =>
          moment(district?.request_date).format("DD/MM/YYYY"),
      },

      {
        title: "Phường",
        dataIndex: "type",
        key: "type",
        render: (_, district: SpaceEditRequest) => district?.ward?.name,
      },
      {
        title: "Phê duyệt",
        dataIndex: null,
        key: "actions",
        render: (_, space: SpaceEditRequest) =>
          space.state == 1 ? (
            <Space>
              <Tooltip title="Phê duyệt">
                <Button
                  onClick={() => createSpaceEditRequest(space)}
                  size="large"
                  icon={<CheckOutlined />}
                  shape="circle"
                ></Button>
              </Tooltip>
            </Space>
          ) : (
            ""
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
      {/* <Button
        size="large"
        icon={<PlusOutlined />}
        className="mb-3 mr-3"
        onClick={openNewSurfaceModal}
      >
        YÊU CẦU CHỈNH SỬA BẢNG QUẢNG CÁO
      </Button> */}

      <Tabs defaultActiveKey="1" items={items} onChange={onChangeTabs} />

      <AdsFormModal
        width="80vw"
        isOpen={isOpenSurface}
        title="YÊU CẦU CHỈNH SỬA BẢNG QUẢNG CÁO"
        cancelBtnText="Đóng"
        confirmBtnText="Thêm"
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSurfaceEditRequest)}
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
            <Col span={8} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.reason}
                name="reason"
                label="Lý do"
                placeholder="Nhập Lý do"
                rules={{ required: "Không được để trống" }}
              />
            </Col>

            <Col span={4} className="gutter-row">
              <AdsDatePicker
                control={control}
                error={errors.request_date}
                name="requests_date"
                label="Ngày yêu cầu chỉnh sửa"
                placeholder="Nhập Lý do"
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
            <Col span={6} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.height}
                name="height"
                label="Bảng quảng cáo"
                placeholder="id .."
                rules={{ required: "Không được để trống" }}
                isDisabled={true}
              />
            </Col>
            <Col span={6} className="gutter-row">
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
                style={{ width: "100%" }}
                // valuePropName="fileList"
                //getValueFromEvent={normFile}
              >
                <Upload
                  style={{ width: "100%" }}
                  listType="picture"
                  maxCount={1}
                  beforeUpload={() => false} // Prevent default upload behavior
                  onChange={(info) => {
                    setValue("img_url", info.file);
                  }}
                >
                  <Button
                    style={{ width: "100%" }}
                    size="large"
                    icon={<UploadOutlined />}
                  >
                    Click to upload
                  </Button>
                </Upload>
              </Form.Item>
            </Col>
          </Row>
          <div className="pt-1 pb-2 h-[600px]">
            <AdsMap onClickOnMap={getLongLat} lngLat={lngLat} />
          </div>
        </Form>
      </AdsFormModal>
    </>
  );
};

export default AdPermitApprovalList;
