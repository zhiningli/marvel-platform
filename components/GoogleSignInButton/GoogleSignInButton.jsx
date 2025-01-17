import { Grid } from "@mui/material";
import GradientOutlinedButton from "../GradientOutlinedButton";
import GoogleLogo from "@/assets/svg/googleLogo.svg";
import { useTheme } from "@emotion/react";
import styles from "./GoogleSignInButton.styles";

const GoogleSignInButton = (props) => {
    const { googleSubmitText, handleGoogleSubmit, signInLoading, ...externalStyles } = props; 
    const theme = useTheme();
    return (
        <Grid {...styles.submitButtonPropsItem}>
            <GradientOutlinedButton
                icon={<GoogleLogo width="35px" height="50px" />}
                text={googleSubmitText}
                loading={signInLoading}
                iconPlacement="left"
                clickHandler={handleGoogleSubmit}
                {...styles.googleButton}
                {...externalStyles} 
            />
        </Grid>
    );
};

export default GoogleSignInButton;
