/* eslint-ignore */
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Container, Typography } from '@mui/material';

// components
import Page from '../components/Page';
import {LoginForm} from "../sections/authentication/login";


// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  }
}));

// const SectionStyle = styled(Card)(({ theme }) => ({
//   width: '100%',
//   maxWidth: 464,
//   display: 'flex',
//   flexDirection: 'column',
//   justifyContent: 'center',
//   margin: theme.spacing(2, 0, 2, 2)
// }));

const ContentStyle = styled('div')(({ theme }) => ({
  maxWidth: 480,
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

// ----------------------------------------------------------------------


export default function Login({setToken}) {

  return (
      <RootStyle title="Login">
        {/*       <AuthLayout>
        Don’t have an account? &nbsp;
        <Link underline="none" variant="subtitle2" component={RouterLink} to="/register">
          Get started
        </Link>
      </AuthLayout> */}

        <Container maxWidth="sm">
          <ContentStyle>
            <Stack sx={{ mb: 5 }}>
              <Typography variant="h4" gutterBottom>
                Sign into the blackbox
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
            </Stack>

            {/* Display login form*/}
            <LoginForm setToken={setToken}/>

          </ContentStyle>
        </Container>
      </RootStyle>
  );
}

// Login.propTypes = {
//   setToken: PropTypes.func.isRequired
// }