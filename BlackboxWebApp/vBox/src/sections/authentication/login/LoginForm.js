/*eslint-disable*/
import * as Yup from 'yup';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
// material
import {
  //Link,
  Stack,
  //Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  //FormControlLabel
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
// component
import Iconify from '../../../components/Iconify';
import PropTypes from "prop-types";

// ----------------------------------------------------------------------

async function loginUser(credentials) {
  return fetch('https://senior-design-vbox.uc.r.appspot.com/login', {
    //https://ec2-3-86-224-254.compute-1.amazonaws.com:8080/login
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(credentials)
  })
      .then(data => data.json())

  // Store all trip information into sessionStorage
}

export default function LoginForm({setToken}) {

  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)

  //From online
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  const LoginSchema = Yup.object().shape({
    username: Yup.string().required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      navigate('/dashboard', { replace: true });
    }
  });

  const { errors, touched, values, isSubmitting, getFieldProps, handleChange } = formik;

  const handleSubmit = async e => { //whenever any user hits the submit button
    e.preventDefault();

    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  }

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
      <FormikProvider value={formik}>
        <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
                fullWidth
                autoComplete="username"
                type="username"
                label="Username"
                {...getFieldProps('username')}
                error={Boolean(touched.username && errors.username)}
                helperText={touched.username && errors.username}
                onKeyUp={handleChange}
                value={username}
                onChange={e => setUsername(e.target.value)}

            />

            <TextField
                fullWidth
                autoComplete="current-password"
                type={showPassword ? 'text' : 'password'}
                label="Password"
                {...getFieldProps('password')}
                InputProps={{
                  endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleShowPassword} edge="end">
                          <Iconify icon={showPassword ? 'eva:eye-fill' : 'eva:eye-off-fill'} />
                        </IconButton>
                      </InputAdornment>
                  )
                }}
                error={Boolean(touched.password && errors.password)}
                helperText={touched.password && errors.password}
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
          </Stack>

          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          </Stack>

          <LoadingButton
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              loading={isSubmitting}
          >
            Login
          </LoadingButton>
        </Form>
      </FormikProvider>
  );
}


LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired
}