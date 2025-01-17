const styles = {
  submitButtonProps: {
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
