import React, { useState } from "react";
import "./App.css";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import Button from "@mui/material/Button";
import { useForm, Controller } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { Typography, Snackbar, Alert } from "@mui/material";

const SignupSchema = Yup.object().shape({
  fromDate: Yup.date()
    .nullable()
    .required("Không được để trống")
    .max(new Date(), "Không được chọn ngày tương lai")
    .test(
      "is-before-toDate",
      "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc",
      function (value) {
        const { toDate } = this.parent;
        return !value || !toDate || value <= toDate;
      }
    ),
  toDate: Yup.date()
    .nullable()
    .required("Không được để trống")
    .min(
      Yup.ref("fromDate"),
      "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu"
    )
    .max(new Date(), "Không được chọn ngày tương lai"),
  fromTime: Yup.date()
    .nullable()
    .required("Không được để trống")
    .max(new Date(), "Không được chọn giờ tương lai")
    .test(
      "is-before-toTime",
      "Giờ bắt đầu phải nhỏ hơn hoặc bằng giờ kết thúc",
      function (value) {
        const { toTime } = this.parent;
        return !value || !toTime || value <= toTime;
      }
    ),
  toTime: Yup.date()
    .nullable()
    .required("Không được để trống")
    .min(Yup.ref("fromTime"), "Giờ kết thúc phải lớn hơn hoặc bằng giờ bắt đầu")
    .max(new Date(), "Không được chọn giờ tương lai"),
});

const App = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    trigger,
    setError,
  } = useForm({
    resolver: yupResolver(SignupSchema),
    defaultValues: {
      fromDate: undefined,
      toDate: undefined,
      fromTime: undefined,
      toTime: undefined,
    },
    mode: "onChange",
  });

  const onSubmit = async (data: any) => {
    const isValid = await trigger();
    if (!isValid) {
      return;
    }

    const fromDateISO = data.fromDate?.toISOString();
    const fromTimeISO = data.fromTime?.toISOString();
    const toDateISO = data.toDate?.toISOString();
    const toTimeISO = data.toTime?.toISOString();

    console.log("Selected From Date and Time (ISO):", fromDateISO, fromTimeISO);
    console.log("Selected To Date and Time (ISO):", toDateISO, toTimeISO);
    setSnackbarOpen(true);

    reset({
      fromDate: undefined,
      toDate: undefined,
      fromTime: undefined,
      toTime: undefined,
    });
  };

  return (
    <div className="App">
      <form onSubmit={handleSubmit(onSubmit)}>
        <table style={{ margin: "auto" }}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <div>
                <Controller
                  name="fromDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        label="From Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? newValue.toDate() : undefined
                          );
                          trigger(["fromDate", "toDate"]);
                        }}
                        maxDate={dayjs()}
                      />
                      {errors.fromDate && (
                        <Typography color="red">
                          {errors.fromDate.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="toDate"
                  control={control}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        label="To Date"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? newValue.toDate() : undefined
                          );
                          trigger(["fromDate", "toDate"]);
                        }}
                        maxDate={dayjs()}
                      />
                      {errors.toDate && (
                        <Typography color="red">
                          {errors.toDate.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </div>
            </DemoContainer>
          </LocalizationProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["TimePicker", "TimePicker"]}>
              <div>
                <Controller
                  name="fromTime"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TimePicker
                        label="From Time"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? newValue.toDate() : undefined
                          );
                          trigger(["fromTime", "toTime"]);
                        }}
                      />
                      {errors.fromTime && (
                        <Typography color="red">
                          {errors.fromTime.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </div>
              <div>
                <Controller
                  name="toTime"
                  control={control}
                  render={({ field }) => (
                    <>
                      <TimePicker
                        label="To Time"
                        value={field.value ? dayjs(field.value) : null}
                        onChange={(newValue) => {
                          field.onChange(
                            newValue ? newValue.toDate() : undefined
                          );
                          trigger(["fromTime", "toTime"]);
                        }}
                      />
                      {errors.toTime && (
                        <Typography color="red">
                          {errors.toTime.message}
                        </Typography>
                      )}
                    </>
                  )}
                />
              </div>
            </DemoContainer>
          </LocalizationProvider>
          <Button
            variant="contained"
            type="submit"
            style={{ marginTop: "10px" }}
          >
            Submit
          </Button>
        </table>
      </form>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Chọn ngày thành công
        </Alert>
      </Snackbar>
    </div>
  );
};

export default App;
