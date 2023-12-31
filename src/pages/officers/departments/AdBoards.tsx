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
import { AdminRole } from "@enums/admin-role";
import AlertType from "@enums/alert-type";
import { AdsLocation } from "@interfaces/ads-location";
import { AdsSpace } from "@interfaces/ads-space";
import { AdsSurface } from "@interfaces/ads-surface";
import { AdsType } from "@interfaces/ads-type";
import DropDownOption from "@interfaces/dropdown-option";

import TableColumn from "@interfaces/table-column";
import { SurfaceEditRequestService } from "@services/ads-surface-edit-request.service";
import AlertService from "@services/alert.service";
import { SpaceService } from "@services/spaces.service";
import { SurfaceService } from "@services/surfaces.service";
import { SurfaceTypeService } from "@services/types.service";
import { sharedActions } from "@slices/shared.slice";
import {
  Button,
  Col,
  Form,
  Row,
  Space,
  Tooltip,
  Upload,
  UploadFile,
  UploadProps,
  message,
} from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AdBoards = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [space, setSurface] = useState<AdsSurface[]>([]);
  const dispatch = useAppDispatch();
  const [wards, setSpaces] = useState<AdsSpace[]>([]);
  const [lngLat, setLngLat] = useState<AdsLocation>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [role, setRole] = useState(Number.parseInt(localStorage.getItem('role')));
  const [types, setTypes] = useState<AdsType[]>([]);
  const [formats, setFormats] = useState<AdsType[]>([]);
  const [spaceOptions, setSpaceOptions] = useState<DropDownOption<string>[]>(
    []
  );
  const [typeOptions, setTypeOptions] = useState<DropDownOption<string>[]>([]);
  const [formatOptions, setFormatOptions] = useState<DropDownOption<string>[]>(
    []
  );

  const {
    reset,
    control,
    setValue,
    handleSubmit,

    formState: { errors },
    watch,
  } = useForm({
    defaultValues:
      role != 3
        ? {
            long: null,
            lat: null,
            width: null,
            height: null,
            img_url: null,
            type: "",
            space: "",
            _id: "",
            reason: "",
            surface: null,
            request_date: null,
            file: null,
          }
        : {
            long: null,
            lat: null,
            width: null,
            height: null,
            img_url: null,
            file: null,
            type: "",
            space: "",
            _id: "",
          },
  });

  const tableColumns = useMemo(
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
        title: "Vị trí",
        dataIndex: "long",
        key: "long",
        render: (_, district: AdsSurface) =>
          "[" + district.long + ", " + district.lat + "]",
      },

      {
        title: "Loại",
        dataIndex: "type",
        key: "type",
        render: (_, district: AdsSurface) => district?.type?.name,
      },
      {
        title: "Kích thước",
        dataIndex: "height",
        key: "height",
        render: (_, district: AdsSurface) =>
          district.height + " x " + district.width,
      },

      {
        title: null,
        dataIndex: null,
        key: "actions",
        render: (_, space: AdsSurface) => {
          
          if (role == AdminRole.DepartmentOfficer)
            return <Space>
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
            </Space>;
          else
            return (
              <Space>
                <Tooltip title="Yêu cầu chỉnh sửa">
                  <Button
                    onClick={() => editSurface(space)}
                    size="large"
                    icon={<EditOutlined />}
                    shape="circle"
                  ></Button>
                </Tooltip>
              </Space>
            );
        },
      },
    ],
    [space.length]
  );

  const getLongLat = (lngLat: AdsLocation) => {
    setValue("long", lngLat.lng);
    setValue("lat", lngLat.lat);
    setLngLat(lngLat);
  };
  const viewSurface = function (data) {};
  const openNewSurfaceModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const createSurface = async (formValue: any): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());

      let res;
      formValue.height = Number.parseFloat(formValue.height + "");
      formValue.width = Number.parseFloat(formValue.width + "");

      
      if (role == AdminRole.DepartmentOfficer) {
        if (formValue._id) {
          res = await SurfaceService.update(formValue);
        } else {
          res = await SurfaceService.create(formValue);
        }
      } else {
        res = await SurfaceEditRequestService.create(formValue);
      }

      clearFormAndCloseModal();

      if (res) {
        setReloadTrigger((prev) => !prev);
        const msg = res?.message;
        AlertService.showMessage(AlertType.Success, msg);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };

  const deleteSurface = async (district: AdsSurface) => {
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
  const editSurface = async (district: any) => {
    try {
      setValue("_id", district._id);

      setValue("long", district.long);
      setValue("lat", district.lat);

      setValue("width", district.width);
      setValue("height", district.height);
      setValue("type", district.type._id);
      setValue("space", district.space._id);


      setValue("surface", district._id);
      setValue("request_date", district.request_date);

      setValue("img_url", district.img_url);
      const fileList: UploadFile[] = [
        {
          uid: "-1",
          name: district.img_url,
          status: "done",
          url: process.env.PUBLIC_URL + "/" + district.img_url,
          thumbUrl: process.env.PUBLIC_URL + "/" + district.img_url,
        },
      ];
      setFileList(fileList);
      openNewSurfaceModal();
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const clearFormAndCloseModal = useCallback(() => {
    reset({
      long: null,
      lat: null,
      width: null,
      height: null,
      img_url: null,
      type: "",
      space: "",
      _id: "",
    });
    setIsOpen(false);
  }, []);
  useEffect(() => {
    const getSurfaces = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const space = await SurfaceService.getAll();
        setSurface(space);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
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
        setSpaces(spaces);
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

    
    getSurfaces();
    getTypes();
    getSpaces();
  }, [reloadTrigger]);

  //

  const props: UploadProps = {
    name: "file",
    onChange(info) {
      console.log(info);
    },
  };

  return (

    <>
      {role == AdminRole.DepartmentOfficer ? (
        <Button
          size="large"
          icon={<PlusOutlined />}
          className="mb-3"
          onClick={openNewSurfaceModal}
        >
          THÊM BẢNG QUẢNG CÁO
        </Button>
      ) : (
        ""
      )}
      <AdsDynamicTable dataSrc={space} cols={tableColumns} />
      <AdsFormModal
        width="80vw"
        isOpen={isOpen}
        title={
          role == AdminRole.DepartmentOfficer
            ? "BẢNG QUẢNG CÁO"
            : "YÊU CẦU CHỈNH SỬA BẢNG QUẢNG CÁO"
        }
        cancelBtnText="Đóng"
        confirmBtnText="Thêm"
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSurface)}
      >
        <Form layout="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            {role == AdminRole.DepartmentOfficer ? (
              <Col span={4} className="gutter-row">
                <AdsInput
                  control={control}
                  error={errors._id}
                  name="_id"
                  isDisabled={true}
                  label="ID"
                />
              </Col>
            ) : (
              <>
                <Col span={20} className="gutter-row">
                  <AdsInput
                    control={control}
                    error={errors.reason}
                    name="reason"
                    label="Lý do "
                    rules={{ required: "Không được để trống" }}
                  />
                </Col>
                <Col span={4} className="gutter-row">
                  <AdsInput
                    isDisabled={true}
                    control={control}
                    error={errors.surface}
                    name="surface"
                    label="Biển quảng cáo"
                    rules={{ required: "Không được để trống" }}
                  />
                </Col>
                <Col span={4} className="gutter-row">
                  <AdsDatePicker
                    control={control}
                    error={errors.request_date}
                    name="request_date"
                    label="Ngày yêu cầu chỉnh sửa"
                    rules={{ required: "Không được để trống" }}
                  />
                </Col>
              </>
            )}
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
                // getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  fileList={fileList}
                  beforeUpload={() => false} // Prevent default upload behavior
                  onChange={(info) => {
                    setFileList(info.fileList);
                    setValue("file", info.file);
                  }}
                >
                  <Button size="large" icon={<UploadOutlined />}>
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

export default AdBoards;
