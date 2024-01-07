import {
  DeleteOutlined,
  EditOutlined,
  FundViewOutlined,
  PlusOutlined,
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
import { SpaceEditRequest } from "@interfaces/ads-space-edit-requests";
import { AdsType } from "@interfaces/ads-type";
import { AdsWard } from "@interfaces/ads-ward";
import DropDownOption from "@interfaces/dropdown-option";

import TableColumn from "@interfaces/table-column";
import { getType } from "@reduxjs/toolkit";
import { SpaceEditRequestService } from "@services/ads-space-edit-requests.service";
import AlertService from "@services/alert.service";
import DistrictsService from "@services/districts.service";
import { SpaceService } from "@services/spaces.service";
import { SpaceFormatService, SpaceTypeService } from "@services/types.service";
import { WardService } from "@services/wards.service";
import { sharedActions } from "@slices/shared.slice";
import { Button, Col, DatePicker, Form, Row, Space, Tooltip } from "antd";
import { useCallback, useEffect, useMemo, useState } from "react";
import { fromLatLng } from "react-geocode";
import { useForm } from "react-hook-form";

const AdPlacements = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [space, setSpace] = useState<AdsSpace[]>([]);
  const dispatch = useAppDispatch();
  const [wards, setWards] = useState<AdsWard[]>([]);
  const [types, setTypes] = useState<AdsType[]>([]);
  const [formats, setFormats] = useState<AdsType[]>([]);
  const [wardOptions, setWardOptions] = useState<DropDownOption<string>[]>([]);
  const [typeOptions, setTypeOptions] = useState<DropDownOption<string>[]>([]);
  const [formatOptions, setFormatOptions] = useState<DropDownOption<string>[]>(
    []
  );

  const [role, setRole] = useState(Number.parseInt(localStorage.getItem('role')));

  const [isOpenSpace, setIsOpenSpace] = useState<boolean>(false);
  const openNewSpaceEditModal = useCallback(() => {
    setIsOpenSpace(true);
  }, []);
  const {
    reset,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: "",
      long: null,
      lat: null,
      ward: "",
      type: "",
      format: "",
      _id: "",
      reason: "",
      space: "",
      request_date: "",
    },
  });
  const createSpaceEditRequest = async (
    formValue: SpaceEditRequest
  ): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());
      let res;
      if (formValue._id) {
        res = await SpaceEditRequestService.update(formValue);
      } else {
        res = await SpaceEditRequestService.create(formValue);
      }
      clearFormAndCloseModal();
      const msg = res?.message;
      AlertService.showMessage(AlertType.Success, msg);
      //setReloadTrigger((prev) => !prev);
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const deleteSpace = async (district: AdsSpace) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá vị trí ${district.long}, ${district.lat} không?`;
      const { isConfirmed } = await AlertService.showMessage(
        AlertType.Question,
        msg
      );
      if (isConfirmed) {
        dispatch(sharedActions.showLoading());
        await SpaceService.remove(district._id);
        setReloadTrigger((prev) => !prev);
      }
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  const editSpace = async (district: AdsSpace) => {
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
    setIsOpenSpace(false);
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

  const getLongLat = (lngLat: AdsLocation) => {
    setValue("long", lngLat.lng);
    setValue("lat", lngLat.lat);
    setValue("address", lngLat.addressDetail[0]["formatted_address"]);

    // console.log(lngLat.addressDetail[0]['address_components']);

    // DistrictsService.create({name: lngLat.addressDetail[0]['address_components'][2]["long_name"]})
  };
  const viewSurface = function (data) {};

  const tableColumns = useMemo(
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
        render: (_, space: AdsSpace) => {
          if (role == AdminRole.DepartmentOfficer)
            return (
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
            );
          else
            return (
              <Tooltip title="Yêu cầu chỉnh sửa">
                <Button
                  onClick={() => editSpaceEditRequest(space)}
                  size="large"
                  icon={<EditOutlined />}
                  shape="circle"
                ></Button>
              </Tooltip>
            );
        },
      },
    ],
    [space.length]
  );

  useEffect(() => {
    const getSpaces = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const space = await SpaceService.getAll();
        setSpace(space);
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
        setWards(wards);
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
        const wards = await SpaceTypeService.getAll();

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
    const getFormats = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const wards = await SpaceFormatService.getAll();

        let options: DropDownOption<string>[] = wards.map((el) => {
          return {
            label: el.name,
            value: el._id,
          };
        });
        setFormatOptions(options);
        setFormats(wards);
      } catch (error) {
        const msg = error?.response?.data?.message || error.message;
        AlertService.showMessage(AlertType.Error, msg);
      } finally {
        dispatch(sharedActions.hideLoading());
      }
    };
    getSpaces();
    getFormats();
    getTypes();
    getWards();
  }, [reloadTrigger]);

  const editSpaceEditRequest = async (district: any) => {
    try {
      setValue("space", district._id);
      setValue("address", district.address);
      setValue("long", district.long);
      setValue("lat", district.lat);
      setValue("type", district?.type?._id);
      setValue("format", district?.format?._id);
      setValue("ward", district?.ward?._id);
      setValue("reason", district.reason);
      openNewSpaceEditModal();
    } catch (error) {
      const msg = error?.response?.data?.message || error.message;
      AlertService.showMessage(AlertType.Error, msg);
    } finally {
      dispatch(sharedActions.hideLoading());
    }
  };
  return (
    <>
      {role == AdminRole.DepartmentOfficer ? (
        <Button
          size="large"
          icon={<PlusOutlined />}
          className="mb-3"
          onClick={openNewSpaceModal}
        >
          THÊM ĐỊA ĐIỂM QUẢNG CÁO
        </Button>
      ) : (
        ""
      )}
      {/* <Button
        size="large"
        icon={<PlusOutlined />}
        className="mb-3 ml-3"
        onClick={openNewSpaceEditModal}
      >
        YÊU CẦU CHỈNH SỬA VỊ TRÍ ĐẶT BẢNG
      </Button> */}
      <AdsDynamicTable dataSrc={space} cols={tableColumns} />
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
          </Row>
          <div className="pt-1 pb-2 h-[600px]">
            <AdsMap onClickOnMap={getLongLat} />
          </div>
        </Form>
      </AdsFormModal>

      <AdsFormModal
        width="80vw"
        isOpen={isOpenSpace}
        title="YÊU CẦU CHỈNH SỬA ĐỊA ĐIỂM QUẢNG CÁO"
        cancelBtnText="Đóng"
        confirmBtnText="Thêm"
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSpaceEditRequest)}
      >
        <Form layout="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            <Col span={24} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.reason}
                name="reason"
                label="Lý do"
                placeholder="Nhập Lý do"
                rules={{ required: "Không được để trống" }}
              />
            </Col>

            <Col span={6} className="gutter-row">
              <AdsDatePicker
                control={control}
                error={errors.request_date}
                name="request_date"
                label="Ngày yêu cầu chỉnh sửa"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={6} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.space}
                name="space"
                isDisabled={true}
                label="Surface"
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
          </Row>
          <div className="pt-1 pb-2 h-[600px]">
            <AdsMap onClickOnMap={getLongLat} />
          </div>
        </Form>
      </AdsFormModal>
    </>
  );
};

export default AdPlacements;
