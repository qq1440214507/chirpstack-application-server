import { createMuiTheme } from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import { zhCN } from '@material-ui/core/locale';

const theme = createMuiTheme({
    palette: {
      primary: blue,
    },
},zhCN);
  
export default theme;
