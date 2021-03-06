import type { NextPage } from 'next'
import Head from 'next/head'
import Avatar from '@mui/material/Avatar';
import Router from "next/router"
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from 'next/link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { server } from './api/service';
import { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="/">
        <a>
          HomeWork Web
        </a>
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

const Login: NextPage = () => {
 const [loading, setLoading] = useState<boolean>(false)
  
  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true)
    const data = new FormData(event.currentTarget);
    try{
      const response = await server.post("/auth/signin", {email:data.get("email"), password:data.get("password")} )
      if(response.data.token){
        window.localStorage.setItem('token', response.data.token)
        console.log(response)
        Router.push("/dashboard")  
      }
    }catch(error){
      console.log(error)
    }
    setLoading(false)
    
  };
  return (
    <>
    <Head>
      <title>HomeWork Web</title>
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    </Head>
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              {loading?<CircularProgress />:"Sign In!"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" >
                  <a>
                    Forgot password?
                  </a>
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" >
                  <a>
                    {"Don't have an account? Sign Up"}
                  </a>
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
    </>
  )
}

export default Login
