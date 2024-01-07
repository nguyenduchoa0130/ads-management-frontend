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
import { User } from "@interfaces/user";
import { SurfaceEditRequestService } from "@services/ads-surface-edit-request.service";
import AlertService from "@services/alert.service";
import { SpaceService } from "@services/spaces.service";
import { SurfaceService } from "@services/surfaces.service";
import { SurfaceTypeService } from "@services/types.service";
import { UserService } from "@services/users.service";
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
const Accounts = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [users, setUsers] = useState<AdsSurface[]>([]);
  const dispatch = useAppDispatch();
  const [wards, setSpaces] = useState<AdsSpace[]>([]);
  const [lngLat, setLngLat] = useState<AdsLocation>();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [role, setRole] = useState(3);
  const [types, setTypes] = useState<AdsType[]>([]);
  const [formats, setFormats] = useState<AdsType[]>([]);
  const [spaceOptions, setSpaceOptions] = useState<DropDownOption<number>[]>(
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
    getValues,
    formState: { errors },
    watch,
  } = useForm({
    defaultValues: {
      _id: null,
      username: null,
      email: null,
      password: null,
      birthday: null,
      phone: null,
      name: null,
      role: null,
      re_password: null,
      createdAt: null,
      updatedAt: null,
      create_by: null,
      update_by: null,
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
        title: "Họ và tên",
        dataIndex: "name",
        key: "name",
      },
      {
        title: "Birthday",
        dataIndex: "birthday",
        key: "birthday",
        render: (value: string) => moment(value).format("DD/MM/YYYY"),
      },
      {
        title: "Tên đăng nhập",
        dataIndex: "username",
        key: "username",
      },
      {
        title: "Kích thước",
        dataIndex: "phone",
        key: "phone",
      },
      {
        title: "Email",
        dataIndex: "email",
        key: "email",
      },

      {
        title: null,
        dataIndex: null,
        key: "actions",
        render: (_, space: User) => {
          if (role == AdminRole.DepartmentOfficer)
            return (
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
            );
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
    [users.length]
  );

  const viewSurface = function (data) {};
  const openNewSurfaceModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const saveUser = async (formValue: User): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());

      let res;
      if (formValue._id) {
        res = await UserService.update(formValue);
      } else {
        res = await UserService.create(formValue);
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

  const deleteSurface = async (district: User) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá vị trí ${district.username} không?`;
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
  const editSurface = async (user: User) => {
    try {
      setValue("name", user.name);
      setValue("username", user.username);
      setValue("phone", user.phone);
      setValue("email", user.email);
      setValue("role", user.role);
      setValue("_id", user._id);
      setValue("birthday", moment(user.birthday));

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
      _id: null,
      username: null,
      email: null,
      password: null,
      birthday: null,
      phone: null,
      role: null,
      createdAt: null,
      updatedAt: null,
      create_by: null,
      update_by: null,
      re_password: null,
    });
    setIsOpen(false);
  }, []);
  useEffect(() => {
    const getUsers = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const users = await UserService.getAll();
        setUsers(users);
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
        const spaces = AdminRole;

        let options: DropDownOption<number>[] = [
          {
            value: AdminRole.DepartmentOfficer,
            label: "Nhân viên Sở VH-TT",
          },
          {
            value: AdminRole.DistrictOfficer,
            label: "Nhân viên Quận",
          },
          {
            value: AdminRole.WardOfficer,
            label: "Nhân viên Phường",
          },
        ];
        setSpaceOptions(options);
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

    getUsers();
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
  const validateConfirmPassword = (value) => {
    console.log(value);
    const { password } = getValues('password');
    if (value && value !== password) {
      return Promise.reject('Passwords do not match');
    }
    return Promise.resolve();
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
          TẠO TÀI KHOẢN
        </Button>
      ) : (
        ""
      )}
      <AdsDynamicTable dataSrc={users} cols={tableColumns} />
      <AdsFormModal
        width="40vw"
        isOpen={isOpen}
        title={"TẠO TÀI KHOẢN"}
        cancelBtnText="Đóng"
        confirmBtnText="Thêm"
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(saveUser)}
      >
        <Form layout="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }}>
            <Col span={12} className="gutter-row" style={{ display: "none" }}>
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
                error={errors.username}
                name="username"
                label="Tên đăng nhập"
                placeholder=""
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={12} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.password}
                name="password"
                label="Mật khẩu"
                isPassword={true}
                placeholder=""
                rules={{}}
              />
            </Col>
            <Col span={12} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.re_password}
                name="re_password"
                label="Nhập lại mật khẩu"
                isPassword={true}
                placeholder=""
                rules={[
   
                  
                ]}
                
              />
            </Col>
            <Col span={12} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.email}
                name="email"
                label="Email"
                placeholder=""
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={12} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.name}
                name="name"
                label="Họ và tên"
                placeholder=""
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={12} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.phone}
                name="phone"
                label="Số điện thoại"
                placeholder=""
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={12} className="gutter-row">
              <AdsDatePicker
                control={control}
                error={errors.birthday}
                name="birthday"
                label="Ngày sinh"
                placeholder=""
                rules={{ required: "Không được để trống" }}
              ></AdsDatePicker>
            </Col>
            <Col span={12} className="gutter-row">
              <FormControlDropdown
                options={spaceOptions}
                control={control}
                error={errors.role}
                name="role"
                label="Vai trò"
                placeholder="Nhập Vai trò"
                rules={{ required: "Không được để trống" }}
              ></FormControlDropdown>
            </Col>
          </Row>
          {/* <div className="pt-1 pb-2 h-[600px]">
            <AdsMap onClickOnMap={getLongLat} lngLat={lngLat} />
          </div> */}
        </Form>
      </AdsFormModal>
    </>
  );
};

export default Accounts;
