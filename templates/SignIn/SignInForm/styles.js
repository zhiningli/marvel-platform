const styles = {
  passwordGridProps: {
    position: 'relative',
    container: true,
    rowGap: 1,
    mb: 1,
  },
  passwordInputGridProps: {
    item: true,
    mobileSmall: 12,
  },
  forgotPasswordGridProps: {
    position: 'absolute',
    right: 0,
    bottom: (theme) => ({
      laptop: `-${theme.spacing(3)}`,
      desktop: `-${theme.spacing(4)}`,
      desktopMedium: `-${theme.spacing(5)}`,
    }),
    container: true,
    item: true,
    mobileSmall: 12,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  forgotPasswordProps: {
    component: 'button',
    type: 'button',
    fontFamily: 'Satoshi Bold',
    fontSize: { laptop: '12px', desktopMedium: '14px' },
    sx: {
      mr: 1,
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      color: (theme) => theme.palette.Greyscale[50],
      '&:hover': {
        cursor: 'pointer',
      },
    },
  },
  signInButtonProps: {
    type: 'submit',
    color: 'purple4',
    inverted: true,
    extraProps: {
      padding: '2px',
      height: { laptop: '54px', desktopMedium: '60px' },
      width: '100%',
    },
    extraButtonProps: {
      fontFamily: 'Satoshi Bold',
      fontSize: '16px',
      px: 4,
    },
  },

  submitButtonContainer: {
    width: "100%",
    display: "flex", 
    flexDirection: "column",
    gap: "12px", 

  },

  seperatorContainer: {
    item: true,
    display: "flex", 
    flexDirection: "row", 
    justifyContent: "center", 
    alignItems: "center", 
    sx: { 
      width: "100%",
      height: "20px", 
    },
  },
  seperatorBox: {
    component: "fieldset",
    sx: {
      flex: 1, 
      textAlign: "center",
      height: "2px",
      bgcolor: "#333",
      border: "none",
    },
  },
  legendStyle: {
    style: {
      paddingLeft: 6.5,
      paddingRight: 6.5,
    },
  },
  typography: {
    sx: {
      fontWeight: 600,
      fontSize: 16,
      textAlign: "center",
    },
  },

};

export default styles;
