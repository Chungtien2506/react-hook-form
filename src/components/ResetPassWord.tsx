import React, { useState, useEffect } from "react";
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
import { isStrongPassword } from "validator";

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

interface PasswordFieldProps {
  label: string;
  name: "currentPassword" | "newPassword" | "confirmPassword";
  control: any;
  showPassword: boolean;
  togglePasswordVisibility: (
    field: "currentPassword" | "newPassword" | "confirmPassword"
  ) => void;
  error: any;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
  label,
  name,
  control,
  showPassword,
  togglePasswordVisibility,
  error,
}) => (
  <Stack spacing={0.5}>
    <Typography variant="body2">{label}</Typography>
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Box sx={{ position: "relative", width: "100%" }}>
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Nhập thông tin"
            {...field}
            value={field.value ?? ""}
            sx={{ width: "100%" }}
          />
          <IconButton
            onClick={() => togglePasswordVisibility(name)}
            sx={{
              position: "absolute",
              right: 0,
              top: "50%",
              transform: "translateY(-50%)",
              padding: "0 12px",
            }}
          >
            {showPassword ? <Visibility /> : <VisibilityOff />}
          </IconButton>
        </Box>
      )}
    />
    {error && (
      <Typography color="error" variant="body2">
        {error.message}
      </Typography>
    )}
  </Stack>
);

const ResetPassword: React.FC = () => {
  const {
    handleSubmit,
    control,
    watch,
    trigger,
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

  const checkPasswordStrength = (password: string) => {
    if (isStrongPassword(password)) {
      return "Rất mạnh";
    } else if (password.length >= 8) {
      return "Mạnh";
    } else if (password.length >= 5) {
      return "Trung bình";
    } else {
      return "Yếu";
    }
  };

  useEffect(() => {
    if (newPasswordValue || confirmPasswordValue) {
      trigger(["newPassword", "confirmPassword"]);
    }
  }, [newPasswordValue, confirmPasswordValue, trigger]);

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <Box sx={{ maxWidth: 400, width: "100%" }}>
        <Typography variant="h5" sx={{ textAlign: "center" }}>
          Đổi mật khẩu
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <PasswordField
            label="Mật khẩu hiện tại"
            name="currentPassword"
            control={control}
            showPassword={showPassword.currentPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            error={errors.currentPassword}
          />

          <PasswordField
            label="Mật khẩu mới"
            name="newPassword"
            control={control}
            showPassword={showPassword.newPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            error={errors.newPassword}
          />
          <Typography
            variant="body2"
            sx={{ alignSelf: "flex-end", color: "hsl(var(--hue) 80% 30%)" }}
          >
            {checkPasswordStrength(newPasswordValue)}
          </Typography>

          <PasswordField
            label="Nhập lại mật khẩu mới"
            name="confirmPassword"
            control={control}
            showPassword={showPassword.confirmPassword}
            togglePasswordVisibility={togglePasswordVisibility}
            error={errors.confirmPassword}
          />

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

export default ResetPassword;
