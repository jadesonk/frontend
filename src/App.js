import JobPage from './pages/job.js';
import { ThemeProvider } from 'styled-components';

const theme = {
  whiteColor: '#FFFFFF',
  redColor: '#FF4D4F',
  textColor: '#777777',
  primaryColor: '#00CA7F',
  loadingColor: '#AAAAAA',
  boxShadow: '0 2px 2px 0 rgba(0,0,0, 0.25)',
  borderRadius: '5px',
  font: {
    bold: '700',
    regular: '400',
  },
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <JobPage />
    </ThemeProvider>
  );
}

export default App;
