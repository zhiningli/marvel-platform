import { useContext, useState } from 'react';

import { Grid, Box, Typography, useTheme } from '@mui/material';
import { FormContainer } from 'react-hook-form-mui';

import AuthTextField from '@/components/AuthTextField';
import GoogleSignInButton from '@/components/GoogleSignInButton/GoogleSignInButton';

import ReCaptchaComponent from '@/components/ReCaptchaComponent/reCaptchacComponent';
import { verifyCaptcha } from '@/libs/utils/ReCaptchaUtil';

import GradientOutlinedButton from '@/components/GradientOutlinedButton';

import styles from './styles';

import sharedStyles from '@/styles/shared/sharedStyles';

import { AUTH_STEPS, VALIDATION_STATES } from '@/libs/constants/auth';
import ALERT_COLORS from '@/libs/constants/notification';
import useWatchFields from '@/libs/hooks/useWatchFields';
import { AuthContext } from '@/libs/providers/GlobalProvider';
import AUTH_REGEX from '@/libs/regex/auth';

import { signUp, signUpWithGoogle } from '@/libs/services/user/signUp';
import { validatePassword } from '@/libs/utils/AuthUtils';

import { signOut } from 'firebase/auth';
import { auth, firestore } from '@/libs/firebase/firebaseSetup';
import { useDispatch} from 'react-redux';
import fetchUserData from '@/libs/redux/thunks/user';
import { useRouter } from 'next/router';
import ROUTES from "@/libs/constants/routes";

// reCaptcha_site_key defined in the .env file
const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const DEFAULT_FORM_VALUES = {
  email: '',
  fullName: '',
  password: '',
  reEnterPassword: '',
};

const DEFAULT_ERR_STATE = {
  email: false,
  fullName: false,
  password: false,
  reEnterPassword: false,
};

const WATCH_FIELDS = [
  {
    fieldName: 'password',
    regexPattern: AUTH_REGEX.password.regex,
  },
  {
    fieldName: 'reEnterPassword',
    regexPattern: AUTH_REGEX.password.regex,
  },
  {
    fieldName: 'email',
    regexPattern: AUTH_REGEX.email.regex,
  },
  {
    fieldName: 'fullName',
    regexPattern: AUTH_REGEX.fullName.regex,
  },
];

/**
 * Sign up form component that handles user registration.
 *
 * @param {object} props - The properties passed to the component.
 * @param {string} props.step - The current step in the sign-up process.
 * @param {function} props.setStep - A function to update the current step.
 * @param {function} props.handleSwitch - A function to switch between sign-up and verify email view.
 * @return {JSX.Element} Returns Sign-Up Form.
 */
const SignUpForm = (props) => {

  const dispatch = useDispatch();
  const router = useRouter();
  
  const { step, setStep, setEmail, handleSwitch } = props;

  const theme = useTheme();

  const [error, setError] = useState(DEFAULT_ERR_STATE);
  const [loading, setLoading] = useState(false);

  const { handleOpenSnackBar } = useContext(AuthContext);


  const { register, control, fieldStates } = useWatchFields(WATCH_FIELDS);
  const { email, fullName, password, reEnterPassword } = fieldStates;

  const passwordMatch = password.value === reEnterPassword.value;

  const [captchaToken, setCaptchaToken] = useState(null);
  const handleCaptchaVerify = (token) => {
    setCaptchaToken(token);
  }
  const setReEnterPasswordStatus = () => {
    if (passwordMatch && password.valid && reEnterPassword.valid) {
      return VALIDATION_STATES.SUCCESS;
    }

    if (password.value === '') return VALIDATION_STATES.DEFAULT;

    return VALIDATION_STATES.ERROR;
  };

  const submitButtonText = () => {
    if (step === AUTH_STEPS.EMAIL) {
      return 'Continue';
    }
    return 'Sign Up';
  };

  const handleSubmit = async () => {
    const isEmailStep = step === AUTH_STEPS.EMAIL;

    setError(DEFAULT_ERR_STATE);

    if (isEmailStep) {
      if (fullName.valid && email.valid) {
        setStep(AUTH_STEPS.PASSWORD);
        return;
      }

      if (!fullName.valid && !email.valid) {
        setError({
          ...error,
          fullName: { message: 'Full name is required' },
          email: { message: 'Email address is required' },
        });
        return;
      }

      if (!fullName.valid) {
        setError({
          ...error,
          fullName: { message: 'Full name is required' },
        });
        return;
      }

      if (!email.valid) {
        setError({
          ...error,
          email: { message: 'Email address is required' },
        });
        return;
      }

      try {
        await verifyCaptcha(captchaToken);
        setCaptchaToken(null);
      } catch (error) {
        handleOpenSnackBar(ALERT_COLORS.ERROR, error.message);
        return;
      }
      
      await signUp(email.value, password.value, fullName.value);
      handleOpenSnackBar(
        ALERT_COLORS.SUCCESS,
        'Account created successfully'
      );

      setEmail(email.value);
    }


    const isPasswordValid = validatePassword(
      { reEnterPassword: reEnterPassword.value, password: password.value },
      setError
    );

    if (isPasswordValid) {
      setLoading(true);

      try {
        await signUp(email.value, password.value, fullName.value);
        handleOpenSnackBar(
          ALERT_COLORS.SUCCESS,
          'Account created successfully'
        );

        setEmail(email.value);
        handleSwitch();
      } catch (err) {
        handleOpenSnackBar(ALERT_COLORS.ERROR, err.message);
      } finally {
        setLoading(false);
        setCaptchaToken(null);
      }
    }
  };

  const handleGoogleSubmit = async () => {
    // Verify reCAPTCHA
    try {
      await verifyCaptcha(captchaToken);
      setCaptchaToken(null);
    } catch (error) {
      handleOpenSnackBar(ALERT_COLORS.ERROR, error.message);
      return;
    }

    setLoading(true);
    try {
      const data = await signUpWithGoogle();
      console.log("sign up information from google: ", data);

      if (data){
        handleOpenSnackBar(ALERT_COLORS.SUCCESS, 'Signed up is successful');
      }

      const userData = await dispatch(
        fetchUserData({ firestore, id: data.user.uid })
      ).unwrap();

      console.log("data from the firestore: ",userData);

      if (userData?.needsBoarding){
        router.replace(ROUTES.BOARDING);
      } else {
        router.replace(ROUTES.HOME);
      }
    } catch (error) {

      setLoading(false);
      router.replace(ROUTES.SIGNUP);
      handleOpenSnackBar(ALERT_COLORS.ERROR, "A problem has occured, please try again later.");
      }
    };

  const renderEmailInput = () => {
    if (step !== AUTH_STEPS.EMAIL) {
      return null;
    }

    return (
      <AuthTextField
        id="email"
        name="email"
        label="Email Address"
        placeholderText="Email address"
        error={!!error.email}
        helperText={
          !email.valid && email.value
            ? AUTH_REGEX.email.message
            : error.email?.message
        }
        state={email.status}
        control={control}
        ref={register}
        focused
      />
    );
  };

  const renderFullNameInput = () => {
    if (step !== AUTH_STEPS.EMAIL) {
      return null;
    }

    return (
      <AuthTextField
        id="fullName"
        name="fullName"
        label="Full Name"
        placeholderText="Full name"
        error={!!error.fullName}
        helperText={
          !fullName.valid && fullName.value
            ? AUTH_REGEX.fullName.message
            : error.fullName?.message
        }
        state={fullName.status}
        control={control}
        ref={register}
        focused
      />
    );
  };

  const renderPasswordAndConfirmPasswordInputs = () => {
    if (step === AUTH_STEPS.EMAIL) return null;

    return (
      <>
        <AuthTextField
          id="password"
          name="password"
          label="Password"
          placeholderText="Enter Password"
          error={!!error.password}
          helperText={
            !password.valid && !!password.value
              ? AUTH_REGEX.password.message
              : error.password?.message
          }
          state={password.status}
          control={control}
          ref={register}
          isPasswordField
          focused
        />
        <AuthTextField
          id="reEnterPassword"
          name="reEnterPassword"
          label="Re-Enter Password"
          placeholderText="Re-Enter Password"
          error={!!error.reEnterPassword}
          helperText={
            !passwordMatch && !!password.value
              ? 'Password does not match'
              : error.reEnterPassword?.message
          }
          state={setReEnterPasswordStatus()}
          control={control}
          ref={register}
          isPasswordField
          focused
        />
      </>
    );
  };

  const renderSubmitButton = () => {
    return (
      <GradientOutlinedButton
        bgcolor={theme.palette.Dark_Colors.Dark[1]}
        loading={step === AUTH_STEPS.PASSWORD && loading}
        textColor={theme.palette.Common.White['100p']}
        clickHandler={handleSubmit}
        text={submitButtonText()}
        {...styles.submitButtonProps}
      />
    );
  };

  const renderSubmitButtonContainer = () => {
    return (
      <Grid {...styles.submitButtonContainer}>

        <GradientOutlinedButton
          bgcolor={theme.palette.Dark_Colors.Dark[1]}
          loading={step === AUTH_STEPS.PASSWORD && loading}
          textColor={theme.palette.Common.White['100p']}
          clickHandler={handleSubmit}
          text={submitButtonText()}
          {...styles.submitButtonProps}
        />

        <Grid {...styles.seperatorContainer}>
          <Box {...styles.seperatorBox}/>
            <legend {...styles.legendStyle}>
              <Typography {...styles.typography}>Or</Typography>
            </legend>
            <Box {...styles.seperatorBox}/>
        </Grid>

        <GoogleSignInButton
          googleSubmitText = "Sign up using Google"
          handleGoogleSubmit={handleGoogleSubmit}
          signInLoading={loading}
        />
      </Grid>
    );
  };


  const renderReCaptcha = () => {
    return (
      <ReCaptchaComponent
        siteKey={SITE_KEY}
        action="signup"
        onVerify={handleCaptchaVerify}
      />
    );
  };

  return (
    <FormContainer defaultValues={DEFAULT_FORM_VALUES} onSuccess={handleSubmit}>
      <Grid {...sharedStyles.formGridProps}>
        {renderEmailInput()}
        {renderFullNameInput()}
        {renderPasswordAndConfirmPasswordInputs()}
        {renderSubmitButtonContainer()}
        {renderReCaptcha()}
      </Grid>
    </FormContainer>
  );
};

export default SignUpForm;
