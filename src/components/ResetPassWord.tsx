import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Stack from "@mui/joy/Stack";
import Input from "@mui/joy/Input";
import { Typography } from "@mui/material";
import IconButton from "@mui/joy/IconButton";
import Button from "@mui/joy/Button";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import isStrongPassword from "../util/isStrongPassword";

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
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const [showPassword, setShowPassword] = useState({
    currentPassword: false,
    newPassword: false,
    confirmPassword: false,
  });

  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const newPasswordValue = watch("newPassword", "");
  const confirmPasswordValue = watch("confirmPassword", "");

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

  const checkPasswordStrength = (password: any) => {
    const score = isStrongPassword(password);
    if (score >= 40) {
      return "Rất mạnh";
    } else if (score >= 30) {
      return "Mạnh";
    } else if (score >= 20) {
      return "Trung bình";
    } else {
      return "Yếu";
    }
  };

  React.useEffect(() => {
    if (newPasswordValue && confirmPasswordValue) {
      if (newPasswordValue !== confirmPasswordValue) {
        setError("confirmPassword", {
          type: "manual",
          message: "Mật khẩu nhập lại không khớp",
        });
        setError("newPassword", {
          type: "manual",
          message: "Mật khẩu nhập lại không khớp",
        });
      } else {
        clearErrors("confirmPassword");
        clearErrors("newPassword");
      }
    }
  }, [newPasswordValue, confirmPasswordValue, setError, clearErrors]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Đổi mật khẩu
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={0.5}>
            <Typography variant="body2">Mật khẩu hiện tại</Typography>
            <Controller
              name="currentPassword"
              control={control}
              render={({ field }) => (
                <Box sx={{ position: "relative", width: "100%" }}>
                  <Input
                    type={showPassword.currentPassword ? "text" : "password"}
                    placeholder="Nhập thông tin"
                    {...field}
                    value={field.value ?? ""}
                    sx={{ width: "100%" }}
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
                </Box>
              )}
            />
            {errors.currentPassword && (
              <Typography color="error" variant="body2">
                {errors.currentPassword.message}
              </Typography>
            )}
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="body2">Mật khẩu mới</Typography>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Box sx={{ position: "relative", width: "100%" }}>
                  <Input
                    type={showPassword.newPassword ? "text" : "password"}
                    placeholder="Nhập thông tin"
                    {...field}
                    value={field.value ?? ""}
                    sx={{ width: "100%" }}
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
                </Box>
              )}
            />
            {errors.newPassword && (
              <Typography color="error" variant="body2">
                {errors.newPassword.message}
              </Typography>
            )}
            <Typography
              variant="body2"
              sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
            >
              {checkPasswordStrength(newPasswordValue)}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Typography variant="body2">Nhập lại mật khẩu mới</Typography>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <Box sx={{ position: "relative", width: "100%" }}>
                  <Input
                    type={showPassword.confirmPassword ? "text" : "password"}
                    placeholder="Nhập thông tin"
                    {...field}
                    value={field.value ?? ""}
                    sx={{ width: "100%" }}
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
                </Box>
              )}
            />
            {errors.confirmPassword && (
              <Typography color="error" variant="body2">
                {errors.confirmPassword.message}
              </Typography>
            )}
            {errors.newPassword && errors.newPassword.type === "manual" && (
              <Typography color="error" variant="body2">
                {errors.newPassword.message}
              </Typography>
            )}
          </Stack>

          <Button color="danger" type="submit" sx={{ mt: 2, width: "100%" }}>
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
      </Box>
    </Box>
  );
};

export default ResetPassWord;
