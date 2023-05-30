import { useContext, createContext } from 'react';
import { Snackbar } from 'react-native-paper';

export const SnackbarContext = createContext({});

export const useSnackbar = () => {
    return useContext(SnackbarContext);
}

/**
 * Wrapper around snackbar to show information.
 */
const CustomSnackbar = () => {
    const { snackbarInfo, hide } = useContext(SnackbarContext);

    return (
        <Snackbar style={{bottom: 50, zIndex: 1000}} duration={3000} onDismiss={hide} visible={snackbarInfo.visible}>
            {snackbarInfo.message}
        </Snackbar>
    );
};

export default CustomSnackbar;
