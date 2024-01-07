import React from 'react';
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
const MyProfile = () => {

  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [user, setUser] = useState<User>();
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
      ...user,
      re_password: null,
      createdAt: null,
      updatedAt: null,
      create_by: null,
      update_by: null,
    },
  });
  
  

  useEffect(() => {
    
    const getUsers = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const users = await UserService.get({_id: localStorage.getItem('_id')});
        const fillData = users.responseData;
       
        setUser(fillData);
        setValue('name', user.name);
      
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

  return (<><Form layout="vertical">
  <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 24 }} >
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
    {/* <Col span={12} className="gutter-row">
      <FormControlDropdown
        options={spaceOptions}
        control={control}
        error={errors.role}
        name="role"
        label="Vai trò"
        placeholder="Nhập Vai trò"
        rules={{ required: "Không được để trống" }}
      ></FormControlDropdown>
    </Col> */}
  </Row>
  {/* <div className="pt-1 pb-2 h-[600px]">
    <AdsMap onClickOnMap={getLongLat} lngLat={lngLat} />
  </div> */}
</Form></>)
};

export default MyProfile;
