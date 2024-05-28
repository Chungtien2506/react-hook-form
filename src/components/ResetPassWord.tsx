import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import LinearProgress from "@mui/joy/LinearProgress";
import Typography from "@mui/joy/Typography";
import IconButton from "@mui/joy/IconButton";
import Button from "@mui/joy/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

const schema = yup.object().shape({
  currentPassword: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
  newPassword: yup
    .string()
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự")
    .max(20, "Mật khẩu không được vượt quá 20 kí tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ in hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất một chữ thường")
    .matches(/\d/, "Mật khẩu phải có ít nhất một chữ số")
    .matches(/[@$!%*?&#]/, "Mật khẩu phải có ít nhất một kí tự đặc biệt")
    .required("Vui lòng nhập mật khẩu mới"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Mật khẩu nhập lại không khớp")
    .required("Vui lòng nhập lại mật khẩu mới"),
});

const ResetPassWord = () => {
  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [showPassword, setShowPassword] = React.useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  const newPassword = watch("newPassword", "");

  const togglePasswordVisibility = (
    field: "currentPassword" | "newPassword" | "confirmPassword"
  ) => {
    setShowPassword((prevShowPassword) => ({
      ...prevShowPassword,
      [field]: !prevShowPassword[field],
    }));
  };

  const onSubmit = (data: any) => {
    console.log("Password changed", data);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const minLength = 8;

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 400, width: "100%" }}>
        <h3 style={{ textAlign: "center" }}>Đổi mật khẩu</h3>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={0.5}>
            <Typography level="body-xs">Mật khẩu hiện tại</Typography>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <div style={{ position: "relative", width: "100%" }}>
                  <Input
                    type={showPassword.currentPassword ? "text" : "password"}
                    placeholder="Nhập thông tin"
                    {...field}
                    style={{ width: "100%" }}
                  />
                  <IconButton
                    onClick={() => togglePasswordVisibility("currentPassword")}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "0 12px",
                    }}
                  >
                    {showPassword.currentPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </div>
              )}
            />
            {errors.currentPassword && (
              <Typography color="danger" level="body-xs">
                {errors.currentPassword.message}
              </Typography>
            )}
          </Stack>

          <Stack spacing={0.5}>
            <Typography level="body-xs">Mật khẩu mới</Typography>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <div style={{ position: "relative", width: "100%" }}>
                  <Input
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder="Nhập thông tin"
                    {...field}
                    style={{ width: "100%" }}
                  />
                  <IconButton
                    onClick={() => togglePasswordVisibility("newPassword")}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "0 12px",
                    }}
                  >
                    {showPassword.newPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </div>
              )}
            />
            {errors.newPassword && (
              <Typography color="danger" level="body-xs">
                {errors.newPassword.message}
              </Typography>
            )}
            <LinearProgress
              determinate
              size="sm"
              value={Math.min((newPassword.length * 100) / minLength, 100)}
              sx={{
                bgcolor: "background.level3",
                color: "hsl(var(--hue) 80% 40%)",
              }}
            />
            <Typography
              level="body-xs"
              sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
            >
              {newPassword.length < 3 && "Very weak"}
              {newPassword.length >= 3 && newPassword.length < 6 && "Weak"}
              {newPassword.length >= 6 && newPassword.length < 10 && "Strong"}
              {newPassword.length >= 10 && "Very strong"}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography level="body-xs">Nhập lại mật khẩu mới</Typography>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <div style={{ position: "relative", width: "100%" }}>
                  <Input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="Nhập thông tin"
                    {...field}
                    style={{ width: "100%" }}
                  />
                  <IconButton
                    onClick={() => togglePasswordVisibility("confirmPassword")}
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      padding: "0 12px",
                    }}
                  >
                    {showPassword.confirmPassword ? (
                      <Visibility />
                    ) : (
                      <VisibilityOff />
                    )}
                  </IconButton>
                </div>
              )}
            />
            {errors.confirmPassword && (
              <Typography color="danger" level="body-xs">
                {errors.confirmPassword.message}
              </Typography>
            )}
          </Stack>

          <Button
            color="danger"
            variant="solid"
            type="submit"
            sx={{ mt: 2, width: "100%" }}
          >
            Xác nhận
          </Button>
        </form>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} sx={{ width: "100%" }}>
            Mật khẩu đã được thay đổi thành công!
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default ResetPassWord;
