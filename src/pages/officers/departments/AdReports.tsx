import {
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  FundViewOutlined,
  PlusOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useAppDispatch } from "@appHook/hooks";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import AdsDatePicker from "@components/AdsDatePicker";
import FormControlDropdown from "@components/AdsDropdown";
import AdsDynamicTable from "@components/AdsDynamicTable";
import AdsEditor from "@components/AdsEditor";
import AdsFormModal from "@components/AdsFormModal";
import AdsInput from "@components/AdsInput";
import AdsMap from "@components/AdsMap";
import AlertType from "@enums/alert-type";
import { AdsLocation } from "@interfaces/ads-location";
import { Report } from "@interfaces/ads-report";
import { AdsSpace } from "@interfaces/ads-space";
import { SurfaceEditRequest } from "@interfaces/ads-surface-edit-request";
import { AdsType } from "@interfaces/ads-type";
import DropDownOption from "@interfaces/dropdown-option";

import TableColumn from "@interfaces/table-column";
import { SpaceEditRequestService } from "@services/ads-space-edit-requests.service";
import { SurfaceEditRequestService } from "@services/ads-surface-edit-request.service";
import AlertService from "@services/alert.service";
import { ReportService } from "@services/reports.service";
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
  UploadFile,
  UploadProps,
  message,
} from "antd";
import moment from "moment";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";

const AdReports = () => {
  const [reloadTrigger, setReloadTrigger] = useState(false);
  const [center, setCenter] = useState<AdsLocation>(null);
  const [isOpenSurface, setIsOpenSurface] = useState<boolean>(false);

  const [reports, setReports] = useState<Report[]>([]);
  const [surfaceEditRequests, setSurfaceEditRequests] = useState<
    SurfaceEditRequest[]
  >([]);
  const dispatch = useAppDispatch();
  const [wards, setSpaces] = useState<AdsSpace[]>([]);
  const [lngLat, setLngLat] = useState<AdsLocation>();
  const [fileList1, setFileList1] = useState<UploadFile[]>([]);
  const [fileList2, setFileList2] = useState<UploadFile[]>([]);
  const [fileList, setFileList] = useState([]);

  const [types, setTypes] = useState<AdsType[]>([]);
  const [formats, setFormats] = useState<AdsType[]>([]);
  const [spaceOptions, setSpaceOptions] = useState<DropDownOption<string>[]>(
    []
  );
  const [worker, setWorker] = useState({});
  const [content, setContent] = useState("initial");
  const [formatOptions, setFormatOptions] = useState<DropDownOption<string>[]>(
    []
  );

  const stateOptions = [
    {
      label: "Đang xử lý",
      value: 0,
    },
    {
      label: "Đã xử lý",
      value: 1,
    },
  ];

  const typeOptions = [
    {
      label: "Bảng quảng cáo",
      value: 1,
    },
    {
      label: "Điểm đặt biển quảng cáo",
      value: 2,
    },
  ];
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
      _id: null,
      surface: null,
      space: null,
      type: null,
      report_date: null,
      content: null,
      email: null,
      phone: null,
      state: null,
      img_url_1: null,
      img_url_2: null,
      file_1: null,
      file_2: null,
      reporter: null,
      report_format: null,
    },
  });

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
  const createSurfaceEditRequest = async (formValue: any): Promise<void> => {
    try {
      dispatch(sharedActions.showLoading());

      let res;

      if (formValue._id) {
        res = await ReportService.update(formValue);
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

  const deleteSurface = async (district: Report) => {
    try {
      const msg = `Bạn có chắc chắn là muốn xoá không?`;
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
  const editSurface = async (report: Report) => {
    try {
      setValue("_id", report._id);
      setValue("reporter", report.reporter);
      setValue("email", report.email);
      setValue("phone", report.phone);
      setValue("type", report.type);
      setValue("state", report.state);
      setValue("report_date", moment(report.report_date));

      setValue("report_format", report.report_format?._id);
      setValue("space", report?.space?._id);
      setValue("surface", report?.surface?._id);

      let fileList: UploadFile[] = [
        {
          uid: "img_url_1",
          name: report.img_url_1,
          status: "done",
          url: process.env.PUBLIC_URL + "/" + report.img_url_1,
          thumbUrl: process.env.PUBLIC_URL + "/" + report.img_url_1,
        },
      ];
      let fileList2: UploadFile[] = [
        {
          uid: "img_url_2",
          name: report.img_url_2,
          status: "done",
          url: process.env.PUBLIC_URL + "/" + report.img_url_2,
          thumbUrl: process.env.PUBLIC_URL + "/" + report.img_url_2,
        },
      ];

      setFileList1(fileList);
      setFileList2(fileList2);
      setContent(report.content);
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
      _id: null,
      surface: null,
      space: null,
      type: null,
      report_date: null,
      content: null,
      email: null,
      phone: null,
      state: null,
      img_url_1: null,
      img_url_2: null,
      reporter: null,
      report_format: null,
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

    const getReports = async () => {
      try {
        dispatch(sharedActions.showLoading());
        const spaces = await ReportService.getAll();

        setReports(spaces);
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
    getReports();
    getSurfaceRequests();
  }, [reloadTrigger]);

  //
  const getContent = (data) => {
    setValue("content", data);
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
        render: (_, district: Report) => (
          <>
            <img
              width="130"
              height="60"
              src={
                process.env.REACT_APP_BACKEND_BASE_URL +
                "/" +
                district.img_url_1
              }
            />

            <img
              className="ml-3"
              width="130"
              height="60"
              src={
                process.env.REACT_APP_BACKEND_BASE_URL +
                "/" +
                district.img_url_2
              }
            />
          </>
        ),
      },
     

      {
        title: "Trạng thái",
        dataIndex: "long",
        key: "long",
        render: (_, district: Report) =>
          district.state == 0 ? (
            <Tag color="orange">Đang xử lý</Tag>
          ) : (
            <Tag color="green">Đã xử lý</Tag>
          ),
      },

      {
        title: "Ngày tạo",
        dataIndex: "report_date",
        key: "report_date",
        render: (_, district: Report) =>
          moment(district.report_date).format("DD/MM/YYYY"),
      },

      {
        title: "",
        dataIndex: null,
        key: "actions",
        render: (_, space: Report) => (
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
    [reports.length]
  );

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

      <AdsDynamicTable
      
        dataSrc={reports}
        cols={tableColumnsSurface}
        hasFilter={true}
        searchByFields={["content"]}
      />

      <AdsFormModal
        width="80vw"
        isOpen={isOpenSurface}
        title="Báo cáo"
        cancelBtnText="Đóng"
        confirmBtnText="Thêm"
        onCancel={clearFormAndCloseModal}
        onSubmit={handleSubmit(createSurfaceEditRequest)}
      >
        <Form layout="vertical" initialValues={worker}>
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
                error={errors.reporter}
                name="reporter"
                label="Tên người báo cáo"
                placeholder=""
                rules={{ required: "Không được để trống" }}
              />
            </Col>

            <Col span={4} className="gutter-row">
              <AdsDatePicker
                control={control}
                isDisabled={true}
                error={errors.report_date}
                name="report_date"
                label="Ngày báo cáo"
                placeholder="Nhập Lý do"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={4} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.email}
                name="email"
                label="Email"
                placeholder="Email"
                rules={{ required: "Không được để trống" }}
              />
            </Col>
            <Col span={4} className="gutter-row">
              <AdsInput
                control={control}
                error={errors.phone}
                name="phone"
                label="Số điện thoại"
                placeholder="Số điện thoại"
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

            <Col span={8} className="gutter-row" style={{display:'none'}}>
              <AdsInput
                control={control}
                error={errors.space}
                name="space"
                label="Điểm quảng cáo"
                placeholder=""
               
              />
            </Col>

            <Col span={8} className="gutter-row" style={{display:'none'}} >
              <AdsInput
                control={control}
                error={errors.surface}
                name="surface"
                label="Biển quảng cáo"
                placeholder=""
               
              />
            </Col>

            <Col span={6} className="gutter-row">
              <FormControlDropdown
                options={stateOptions}
                control={control}
                error={errors.surface}
                name="state"
                label="Trạng thái"
                placeholder="Chọn trạng thái"
                rules={{ required: "Không được để trống" }}
              ></FormControlDropdown>
            </Col>
            <Col span={6} className="gutter-row">
              <Form.Item
                label="Image 1"
                name="file_1"
                style={{ width: "100%" }}
                // valuePropName="fileList"
                //getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  fileList={fileList1}
                  beforeUpload={() => false} // Prevent default upload behavior
                  onChange={(info) => {
  
                    setFileList1(info.fileList);
                    setValue("file_1", info.file);
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
            <Col span={6} className="gutter-row">
              <Form.Item
                label="Image 2"
                name="file_2"
                style={{ width: "100%" }}
                // valuePropName="fileList"
                //getValueFromEvent={normFile}
              >
                <Upload
                  listType="picture"
                  maxCount={1}
                  fileList={fileList2}
                  beforeUpload={() => false} // Prevent default upload behavior
                  onChange={(info) => {
                   
                    setValue("file_2", info.file);
                    setFileList2(info.fileList);
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
            <Col span={24} className="gutter-row">
              <AdsEditor initialContent={content} onEditorChange={getContent} />
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

export default AdReports;
