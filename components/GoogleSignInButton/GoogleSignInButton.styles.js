const styles = {
    submitButtonPropsItem: {
        item: true,
        sx: {
            flex: 1,
            width: "100%",
        },
    },
    googleButton: {
        id: "google-sign-in-selector",
        textColor: "#232424",
        bgcolor: '#1e1e1e',
        color: 'grey1',
        inverted: true,
        extraProps: {
            padding: "2px",
            height: { laptop: "54px", desktopMedium: "60px" },
            width: "100%",
        },
        extraButtonProps: {
            fontFamily: "Satoshi Bold",
            fontSize: "16px",
            px: 4,
        },
    },
};

export default styles;
